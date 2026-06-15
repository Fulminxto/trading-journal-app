import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { verifyCode } from "@/lib/two-factor";

type AuthUser = {
  id: string;
  name: string | null;
  username: string;
  role: string;
  status: string;
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 5;

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        preAuthToken: { label: "Pre-auth Token", type: "text" },
        otp: { label: "OTP Code", type: "text" },
      },

      async authorize(credentials) {
        const preAuthToken = credentials?.preAuthToken?.trim();
        const otp = credentials?.otp?.trim();

        // ── Path A: 2FA second factor ─────────────────────────────────────
        if (preAuthToken && otp) {
          const record = await prisma.twoFactorCode.findUnique({
            where: { preAuthToken },
            include: { user: true },
          });

          if (!record || record.used) return null;

          if (record.expiresAt < new Date()) {
            await prisma.twoFactorCode.delete({ where: { id: record.id } });
            return null;
          }

          if (record.attempts >= MAX_OTP_ATTEMPTS) {
            await prisma.twoFactorCode.delete({ where: { id: record.id } });
            return null;
          }

          const isValidOtp = await verifyCode(otp, record.codeHash);

          if (!isValidOtp) {
            await prisma.twoFactorCode.update({
              where: { id: record.id },
              data: { attempts: record.attempts + 1 },
            });
            return null;
          }

          // OTP accepted — consume the record and complete login.
          await prisma.twoFactorCode.delete({ where: { id: record.id } });

          await prisma.user.update({
            where: { id: record.userId },
            data: {
              lastLoginAt: new Date(),
              lastSeenAt: new Date(),
              lastActivityAt: new Date(),
              loginCount: { increment: 1 },
              failedLoginAttempts: 0,
              lockedUntil: null,
            },
          });

          const u = record.user;
          return {
            id: u.id,
            name: u.name,
            username: u.username,
            role: u.role,
            status: u.status,
          };
        }

        // ── Path B: standard username + password ──────────────────────────
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) return null;

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) return null;

        if (user.lockedUntil && user.lockedUntil > new Date()) return null;

        const isPasswordValid = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          const failedLoginAttempts = user.failedLoginAttempts + 1;
          const shouldLock = failedLoginAttempts >= MAX_FAILED_ATTEMPTS;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts,
              lockedUntil: shouldLock
                ? new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000)
                : null,
            },
          });

          return null;
        }

        // If this user has 2FA enabled, signIn() must not be called directly —
        // the client must go through /api/auth/pre-login first.
        if (user.twoFactorEnabled) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            lastSeenAt: new Date(),
            lastActivityAt: new Date(),
            loginCount: { increment: 1 },
            failedLoginAttempts: 0,
            lockedUntil: null,
          },
        });

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      const typedUser = user as AuthUser | undefined;

      if (typedUser) {
        token.id = typedUser.id;
        token.username = typedUser.username;
        token.role = typedUser.role;
        token.status = typedUser.status;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }

      return session;
    },
  },
};

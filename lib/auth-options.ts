import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

type AuthUser = {
  id: string;
  name: string | null;
  username: string;
};

export const authOptions: NextAuthOptions = {
  debug: true,

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
        username: {
          label: "Username",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.username ||
          !credentials?.password
        ) {
          return null;
        }

        const user =
          await prisma.user.findUnique({
            where: {
              username:
                credentials.username,
            },
          });

        if (!user) {
          return null;
        }

        const isPasswordValid =
          await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

        if (!isPasswordValid) {
          return null;
        }

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            lastLoginAt: new Date(),
            lastSeenAt: new Date(),
            lastActivityAt: new Date(),
            loginCount: {
              increment: 1,
            },
          },
        });

        return {
          id: user.id,
          name: user.name,
          username: user.username,
        };
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      const typedUser =
        user as AuthUser | undefined;

      if (typedUser) {
        token.id = typedUser.id;
        token.username =
          typedUser.username;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.username =
          token.username as string;
      }

      return session;
    },
  },
};
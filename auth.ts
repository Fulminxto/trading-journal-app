import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const allowedEmails = [
  "yarikdziuban@gmail.com",
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      return allowedEmails.includes(user.email);
    },
  },
});

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedEmails = [
  "yarikdziuban@gmail.com",
  "ivanguncov@icloud.com",
];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      return allowedEmails.includes(user.email);
    },
  },
});

export { handler as GET, handler as POST };
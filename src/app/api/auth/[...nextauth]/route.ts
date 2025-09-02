import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "940802420753-65hkgm1t0okgsoufbroru4ajup3srmol.apps.googleusercontent.com",
      clientSecret: "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",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Create new user in database
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error handling user sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      // This sends properties to the client, like an access_token and user id from a provider
      return session;
    },
    async jwt({ token, account, profile }) {
      // This persists the OAuth access_token and or the user id to the token right after signin
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };

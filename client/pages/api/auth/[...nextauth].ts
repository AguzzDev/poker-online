import { AxiosError } from "axios";
import { oAuthInput } from "models";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { fetchOAuth } from "services";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      const values = {
        username: user.name,
        email: user.email,
        provider: account.provider,
      } as oAuthInput;
      try {
        const { data } = await fetchOAuth(values);
       
        user.customData = data;
        return true;
      } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        const errorMessage = err.response!.data.message;
        return `/auth?error=${errorMessage}`;
      }
    },
    async jwt({ token, user }: any) {
      if (user?.customData) {
        token = user.customData;
      }

      const { iat, exp, jti, ...rest } = token;
      return rest;
    },
    async session({ session, token }: any) {
      session.user = token;
      return session;
    },
  },
  pages: {
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
      },
    },
  },
};

export default NextAuth(authOptions);

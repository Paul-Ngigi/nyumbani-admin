import { baseUrl } from "@/constants/urls";
import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        const { email, authToken } = credentials as {
          email: string;
          authToken: string;
        };

        console.log("********* Validating user ***********");
        const res = await axios.post(`${baseUrl}/login`, {
          email: email,
          authToken: authToken,
        });

        console.log({ res: res.data });

        console.log("********* Finished validating user ***********");

        if (res && res.data.Status === 200) {
          const user = await res.data.Payload;
          const jwt = user.token;
          const roles = user.roles;          

          return {
            ...credentials,
            jwt,
            roles
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          jwt: user.jwt,
          roles: user.roles
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.jwt = token.jwt;
        session.roles = token.roles;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

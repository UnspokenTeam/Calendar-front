import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials"

import { env } from "@/env";
import apiClient from "@/lib/api-client";
import {AuthResponse, Role} from "@/types/Users";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      email: string;
      access_token: string;
      refresh_token: string;
      role: Role
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    email: string;
    access_token: string;
    refresh_token: string;
    role: Role
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: true,
  callbacks: {
    session: ({ session, token, user }) => {
      return{
      ...session,
          user: {
          ...session.user,
            // eslint-disable-next-line
            //@ts-expect-error
            access_token: token.user.access_token as string,
            id: token.sub,
          },
      }
    },
    jwt({user, token}) {
      if (user) {
        token.user = user;
      }

      return token;
    }
  },
  events: {
    signOut: async() => {
      try {
        await apiClient.post("users/logout", null)

        apiClient.defaults.headers.common.Authorization = null;
      } catch {
        //pass
      }
    }
  },
  providers: [
      Credentials({
        type: "credentials",
        name: "register",
        id: "register",
        credentials: {
          username: {},
          email: {},
          password: {}
        },
        authorize: async (credentials) => {
          const answer = await apiClient.post<AuthResponse>("users/register", credentials);

          if(answer.status != 200) {
            return null;
          }

          apiClient.defaults.headers.common.Authorization = answer.data.access_token;

          return {
            id: answer.data.user.id,
            username: answer.data.user.username,
            email: answer.data.user.email,
            access_token: answer.data.access_token,
            refresh_token: answer.data.refresh_token,
            role: answer.data.user.type
          };
        },
      }),
    Credentials({
      type: "credentials",
      name: "login",
      id: "login",
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const answer = await apiClient.post<AuthResponse>("users/login", {
          username: credentials?.email,
          password: credentials?.password
        });

        if(answer.status != 200) {
          return null;
        }

        apiClient.defaults.headers.common.Authorization = answer.data.access_token;

        return {
          id: answer.data.user.id,
          username: answer.data.user.username,
          email: answer.data.user.email,
          access_token: answer.data.access_token,
          refresh_token: answer.data.refresh_token,
          role: answer.data.user.type
        };
      }
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

import {type DefaultSession, getServerSession, type NextAuthOptions,} from "next-auth";
import Credentials from "next-auth/providers/credentials"
import apiClient from "@/lib/api-client";
import {AuthResponse, Role} from "@/types/Users";
import axios from "axios";
import FormData from "form-data";
import {DefaultJWT} from "next-auth/jwt";

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

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        user: User
    }

    interface User {
        id: string;
        username: string;
        email: string;
        access_token: string;
        refresh_token: string;
        role: Role
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({session, token}) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    access_token: token.user.access_token,
                    username: token.user.username,
                    id: token.sub,
                },
            }
        },
        jwt({user, token, session, trigger}) {
            if (user) {
                token.user = user;
            }

            if (trigger == "update") {
                token.email = (session as AuthResponse).user.email;
                token.user.username = (session as AuthResponse).user.username;
                token.user.role = (session as AuthResponse).user.role;
                token.user.access_token = (session as AuthResponse).access_token;
                token.user.refresh_token = (session as AuthResponse).refresh_token;
            }

            return token;
        }
    },
    events: {
        signOut: async () => {
            try {
                await apiClient.post("users/logout", {}, {
                    headers: {
                        Authorization: `Bearer ${apiClient.defaults.headers.common.Authorization as string}`
                    }
                });
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

                if (axios.isAxiosError(answer)) {
                    if (answer?.response?.status == 400) {
                        throw Error("Имя пользователя или почта уже используется");
                    } else if (answer?.response?.status != 200) {
                        throw Error("Что-то пошло не так");
                    }
                }


                apiClient.defaults.headers.common.Authorization = answer.data.access_token;

                return {
                    id: answer.data.user.id,
                    username: answer.data.user.username,
                    email: answer.data.user.email,
                    access_token: answer.data.access_token,
                    refresh_token: answer.data.refresh_token,
                    role: answer.data.user.role
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
                const data = new FormData();
                data.append("username", credentials?.email);
                data.append("password", credentials?.password);
                const answer = await apiClient.post<AuthResponse>("users/login", data);
                if (axios.isAxiosError(answer) && answer?.response?.status != 200) {
                    throw Error("Credentials are wrong")
                }

                apiClient.defaults.headers.common.Authorization = answer.data.access_token;

                return {
                    id: answer.data.user.id,
                    username: answer.data.user.username,
                    email: answer.data.user.email,
                    access_token: answer.data.access_token,
                    refresh_token: answer.data.refresh_token,
                    role: answer.data.user.role
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
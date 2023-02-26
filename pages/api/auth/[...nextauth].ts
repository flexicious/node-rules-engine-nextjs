import NextAuth, { AuthOptions } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
/// @ts-ignore
import { Database } from "sqlite-async";
export const authOptions:AuthOptions={
    jwt: {
        maxAge: 3600,
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user } ) {
            if (user) {
                token.user = user
            }
            return (token)
        },

        async session({ session, token } ) {
            session.user = token.user || {}
            return (session)
        },
    },

    secret: process.env.NEXT_AUTH_SECRET || "secret",
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                const db = await Database.open('database.db')
                const user = await db.get(`SELECT [id], [username], [email]
                                             FROM [users]
                                            WHERE [email] = ? 
                                              AND [password] = ?
                                            LIMIT 1`, [credentials?.email, credentials?.password])
                if (user) {
                    return user
                } else {
                    return null
                }
            },
        })
    ],
}
export default NextAuth(authOptions)
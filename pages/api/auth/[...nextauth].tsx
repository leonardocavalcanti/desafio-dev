import prisma from '@lib/prisma';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verifyPassword } from "../../../lib/auth";

export default NextAuth({
    session: {
        jwt: true
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout'
    },
    providers: [
        Providers.Credentials({
            id: 'email-login',
            name: 'cnab',
            credentials: {
                email: { label: "Email Address", type: "email", placeholder: "john.doe@example.com" },
                password: { label: "Password", type: "password", placeholder: "Your super secure password" }
            },
            async authorize(credentials) {
                console.log(credentials);
                
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email.toLowerCase()
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        password: true
                    }
                });

                if (!user || !(await verifyPassword(credentials.password, user.password))) {
                    throw new Error('Invalid e-mail or password.');
                }

                return { id: user.id, email: user.email, name: user.name };
            }
        })
    ],
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
            // Add username to the token right after signin
            if (user?.username) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session(session: any, token) {
            session.user = session.user || {}
            session.user.id = token.id;
            session.user.username = token.username;
            return session;
        },
    },
});

import User from '@/model/User';
import dbConnect from '@/utils/mongodb';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { useCallback } from 'react';
import { cookies } from 'next/headers';
import argon2 from 'argon2';


async function login(credentials){
    try{
        dbConnect();
        const user = await User.findOne({username: credentials.username});
        if(!user) throw new Error("Wrong Credentials");
        const storedHashedPassword = user.password.toString();
        console.log('Stored hashed password:', storedHashedPassword);
        console.log('Provided password:', credentials.password);

        const isPasswordValid = await argon2.verify(storedHashedPassword, credentials.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            throw new Error("Wrong Credentials");
        }
        return user;
    } catch (error) {
        console.log("error while logging in ", error);
        throw new Error("Something went wrong from nextauth");
    }
}

export const authOptions = {
    pages: {
        signIn: "/signin", 
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const user = await login(credentials); 
                    console.log({credentials});
                    if (user) {
                        console.log('user is:',user)
                        cookies().set('username', user.username);
                        cookies().set('email', user.email);
                        cookies().set('role', user.role);
                        return user;
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error('Authorization error:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.username = user.username;
                token.email = user.email;
                token.id = user.id;
            }
            console.log('object of token:', token);
            return token;
        },
        async session({session, token}){
            if(token){
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.id = token.id;
            }
            console.log('object of session:', session);
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export const loginAction = async () => {
    await signIn('github');
}

export const logoutAction = async () => {
    await signOut();
}

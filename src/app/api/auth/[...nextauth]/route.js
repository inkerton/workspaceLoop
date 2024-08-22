import User from '@/model/User';
import dbConnect from '@/utils/mongodb';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { useCallback } from 'react';

async function login(credentials){
    try{
        dbConnect();
        const user = await User.findOne({username: credentials.username});
        if(!user) throw new Error("Wrong Credentials");
        if ( credentials.password != user.password) {
            throw new Error("Wrong Credentials!!!");
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
            credentials: {},
            async authorize(credentials) {
                try {
                    const user = await login(credentials); 
                    console.log({credentials});
                    if (user) {
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

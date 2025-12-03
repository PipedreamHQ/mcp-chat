import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter"

import { db, getUser } from '@/lib/db/queries';

import { authConfig } from './auth.config';
import { accounts, user } from '@/lib/db/schema';

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,

  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: accounts,
  }),
  providers: [
    // Credentials({
    //   credentials: {},
    //   async authorize({ email, password }: any) {
    //     const users = await getUser(email);
    //     if (users.length === 0) return null;
    //     // biome-ignore lint: Forbidden non-null assertion.
    //     const passwordsMatch = await compare(password, users[0].password!);
    //     if (!passwordsMatch) return null;
    //     return users[0] as any;
    //   },
    // }),
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prismaNeon } from '../prisma/prismaNeon';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = prismaNeon;

type Role = 'ADMIN' | 'USER';
const VALID_ROLES: Role[] = ['ADMIN', 'USER'];

export const sessionMaxAge = 24 * 60 * 60;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: sessionMaxAge,
    updateAge: 25 * 60 * 60
  },
  pages: {
    signIn: '/login',
    error: '/login/unauthorized'
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toString();
        const password = credentials.password.toString();
        const dbUser = await prisma.userHistory.findFirst({
          where: { email, status: 'ACTIVE' },
          orderBy: { version: 'desc' },
          select: { password: true, role: true, name: true, email: true }
        });
        if (!dbUser?.password) return null;
        const isValidPassword = await bcrypt.compare(password, dbUser.password);
        if (!isValidPassword) return null;
        return {
          id: email,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role
        };
      }
    })
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!user.email) return false;
      if (account?.provider === 'credentials') return true;
      return await isAuthorizedEmail(user.email);
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        const dbUser = await prisma.userHistory.findFirst({
          where: { email: user.email!, status: 'ACTIVE' },
          orderBy: { version: 'desc' },
          select: { role: true, name: true }
        });
        token.name = dbUser?.name;
        token.email = user.email;
        token.role = dbUser?.role;
      }
      if (trigger === 'update' && token.email) {
        const dbUser = await prisma.userHistory.findFirst({
          where: { email: token.email as string, status: 'ACTIVE' },
          orderBy: { version: 'desc' },
          select: { role: true, name: true }
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        const role = token.role;
        const isValidRole = isRecognizedRole(role);
        if (isValidRole) session.user.role = role;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      try {
        const parsedUrl = new URL(url, baseUrl);
        const callbackUrl = parsedUrl.searchParams.get('callbackUrl');
        if (callbackUrl && callbackUrl.startsWith(baseUrl)) return callbackUrl;
        else if (parsedUrl.pathname === '/login') return baseUrl;
      } catch (error) {
        console.error('Error parsing URL in callback redirect:', error);
      }
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    authorized: ({ request, auth }) => {
      if (!auth?.user) return false;
      const pathname = request.nextUrl.pathname;
      const userRole = auth.user.role;
      if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        const url = request.nextUrl.clone();
        url.pathname = '/login/unauthorized';
        return NextResponse.redirect(url);
      }
      if (
        pathname.startsWith('/fornecedor') &&
        userRole !== 'SUPPLIER' &&
        userRole !== 'ADMIN'
      ) {
        const url = request.nextUrl.clone();
        url.pathname = '/login/unauthorized';
        return NextResponse.redirect(url);
      }
      if (pathname.startsWith('/settings') && userRole !== 'ADMIN') {
        const url = request.nextUrl.clone();
        url.pathname = '/login/unauthorized';
        return NextResponse.redirect(url);
      }
      return true;
    }
  }
});

const isAuthorizedEmail = async (email: string) => {
  const dbUser = await prisma.userHistory.findFirst({
    where: { email, status: 'ACTIVE' },
    orderBy: { version: 'desc' }
  });
  return !!dbUser;
};

const isRecognizedRole = (role: unknown): role is Role =>
  VALID_ROLES.includes(role as Role);

export const validateServiceApiKey = (apiKey: string | null): boolean => {
  if (!apiKey || !process.env.SERVICE_API_KEY) return false;
  return apiKey === process.env.SERVICE_API_KEY;
};

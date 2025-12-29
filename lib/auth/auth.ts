import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prismaNeon } from '../prisma/prismaNeon';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = prismaNeon;

type Role = 'ADMIN' | 'USER' | 'SUPPLIER';
const VALID_ROLES: Role[] = ['ADMIN', 'USER', 'SUPPLIER'];

type UserCredentials = {
  email: string;
  password: string;
};

type DbUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  password: string | null;
};

const validateCredentials = (
  credentials: Record<string, unknown> | undefined
): UserCredentials | null => {
  if (!credentials?.email || !credentials?.password) return null;
  return {
    email: credentials.email.toString(),
    password: credentials.password.toString()
  };
};

const findActiveUser = async (email: string): Promise<DbUser | null> => {
  return await prisma.user.findUnique({
    where: { email, status: 'ACTIVE' },
    select: { password: true, role: true, name: true, email: true, id: true }
  });
};

const verifyUserPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

const createAuthUser = (dbUser: DbUser) => {
  return {
    id: dbUser.id,
    name: dbUser.name || '',
    email: dbUser.email,
    role: dbUser.role
  };
};

export const sessionMaxAge = 24 * 60 * 60;

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
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
        const validatedCreds = validateCredentials(credentials);
        if (!validatedCreds) return null;
        const dbUser = await findActiveUser(validatedCreds.email);
        if (!dbUser?.password) return null;
        const isValid = await verifyUserPassword(
          validatedCreds.password,
          dbUser.password
        );
        if (!isValid) return null;
        return createAuthUser(dbUser);
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
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email!, status: 'ACTIVE' },
          select: { role: true, name: true }
        });
        token.name = dbUser?.name;
        token.email = user.email;
        token.role = dbUser?.role;
      }
      if (trigger === 'update' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string, status: 'ACTIVE' },
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
  const dbUser = await prisma.user.findUnique({
    where: { email, status: 'ACTIVE' }
  });
  return !!dbUser;
};

const isRecognizedRole = (role: unknown): role is Role =>
  VALID_ROLES.includes(role as Role);

export const validateServiceApiKey = (apiKey: string | null): boolean => {
  if (!apiKey || !process.env.SERVICE_API_KEY) return false;
  return apiKey === process.env.SERVICE_API_KEY;
};

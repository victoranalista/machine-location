import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: 'ADMIN' | 'USER' | 'SUPPLIER';
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'ADMIN' | 'USER' | 'SUPPLIER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'ADMIN' | 'USER' | 'SUPPLIER';
  }
}

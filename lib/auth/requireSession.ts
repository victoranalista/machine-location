import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';
import { Role } from '@/prisma/generated/prisma/client';

const ALLOWED_ROLES: Role[] = [Role.ADMIN, Role.USER];

export const requireSession = async (allowedRoles: Role[]) => {
  const session = await auth();
  if (!session?.user?.email)
    throw NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  const userRole = session.user.role;
  if (!userRole)
    throw NextResponse.json(
      { error: 'User profile without defined role' },
      { status: 401 }
    );
  if (!ALLOWED_ROLES.includes(userRole))
    throw NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  if (!allowedRoles.includes(userRole))
    throw NextResponse.json({ error: 'Access denied' }, { status: 403 });
  return session.user;
};

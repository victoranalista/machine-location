import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { auth, signOut } from '@/lib/auth/auth';
import Image from 'next/image';
import Link from 'next/link';

export async function User() {
  let session = await auth();
  let user = session?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={user?.image ?? '/placeholder-user.jpg'}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <DropdownMenuItem asChild>
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                className="w-full cursor-pointer justify-start px-2 py-1.5 text-sm font-normal"
              >
                Sair
              </Button>
            </form>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Link href="/login">Login</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

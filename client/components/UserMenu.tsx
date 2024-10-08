import React from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  user: { name: string; email: string; userId: string };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here
    // For example: clear local storage, reset state, redirect to login page
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{user.name}</DropdownMenuItem>
        <DropdownMenuItem>{user.email}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

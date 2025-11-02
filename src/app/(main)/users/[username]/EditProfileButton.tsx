"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import Link from "next/link";

interface EditProfileButtonProps {
  user: UserData;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  return (
    <Link href="/settings">
      <Button variant="outline">
        Edit Profile
      </Button>
    </Link>
  );
}

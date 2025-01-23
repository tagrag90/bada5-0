import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-background">
      <div className="mx-auto flex max-w-5xl flex-nowrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/">
          <Image
            src={Logo}
            alt="logo"
            width={45}
            height={45}
            className="rounded-full md:block"
          />
        </Link>
        {/* <Link href="/" className="hidden text-lg font-bold text-white md:block">
          DTB
        </Link> */}
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}

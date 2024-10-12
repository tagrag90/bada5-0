import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-[#4F4F4F] shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-nowrap items-center justify-center gap-5 px-5 py-3">
        <Image
          src={Logo} //
          alt="logo"
          width={40}
          height={40}
          className="hidden rounded-full md:block"
        />
        <Link href="/" className="text-lg font-bold text-primary text-white">
          DTB
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}

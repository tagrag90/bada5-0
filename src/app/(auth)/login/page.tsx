import loginImage from "@/assets/login-image.png";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import Logo from "@/assets/logo.png";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-screen">
      {/* <div className="hidden w-1/2 md:block">
        <Image
          src={loginImage}
          alt=""
          className="h-screen w-full object-left-top object-cover"
          priority
        />
      </div> */}
      <div className="flex w-full items-center justify-center p-5">
        <div className="w-full max-w-md space-y-1 overflow-y-auto p-10">
          <Image
            src={Logo} //
            alt="logo"
            width={45}
            height={45}
            className="mb-5 rounded-full"
          />
          <h1 className="text-2xl font-bold">돌아오셨군요~</h1>
          <h1 className="text-2xl font-bold">로그인 하고 Bada를 둘러보세요.</h1>
          <div className="space-y-5">
            {/* <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div> */}
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              엇, Bada가 처음이신가요?
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <GoogleSignInButton />
          </div>
        </div>
      </div>
    </main>
  );
}

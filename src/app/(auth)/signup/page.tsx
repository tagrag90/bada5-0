import signupImage from "@/assets/singup-image.png";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import Logo from "@/assets/logo.png";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[32rem] overflow-hidden rounded-2xl">
        <div className="w-full space-y-1 overflow-y-auto p-10">
          <Image
            src={Logo} //
            alt="logo"
            width={45}
            height={45}
            className="mb-5 rounded-full md:block"
          />
          <h1 className="text-2xl font-bold">환영해요!</h1>
          <h1 className="text-2xl font-bold">빠르게 계정을 만들어 볼까요?</h1>
          <p className="py-5 text-base text-[#8b95a1]">
            아래 3개의 칸만 채우면
            <br /> Bada의 모든것을 바로 즐길 수 있어요!
          </p>
          <div className="space-y-5">
            {/* <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div> */}
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              우리가... 처음이 아닌가요?
            </Link>
          </div>
        </div>
        {/* <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-fill md:block"
        /> */}
      </div>
    </main>
  );
}

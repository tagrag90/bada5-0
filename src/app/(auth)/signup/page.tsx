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
        <div className="w-full space-y-1 overflow-y-auto p-8 bg-white rounded-2xl">
          <Image
            src={Logo} //
            alt="logo"
            width={45}
            height={45}
            className="mb-5 rounded-full md:block"
          />
          <h1 className="text-2xl font-bold">Welcome!</h1>
          <h1 className="text-2xl font-bold">Let&apos;s create your account quickly.</h1>
          <p className="py-5 text-base text-[#8b95a1]">
            Just fill in the 3 fields below<br /> to enjoy everything Bada has to offer!
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
              Already have an account?
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

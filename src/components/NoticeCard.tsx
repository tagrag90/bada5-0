import Image from "next/image";
import Logo from "@/assets/logo.png";
interface NoticeCardProps {
  title: string;
  version: string;
  status: string;
}

export function NoticeCard({ title, version, status }: NoticeCardProps) {
  return (
    <div className="space-y-5 rounded-2xl bg-[#333] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
        <Image
            src={Logo}
            alt="logo"
            width={45}
            height={45}
            className="rounded-full md:block"
          />
        </div>
        <span className="text-lg font-bold text-white">Notice</span>
      </div>
      
      <h2 className="mt-4 text-base font-medium text-white">
        {title}
      </h2>

      <div className="mt-4 flex items-center gap-3 bg-[#ff7262]/[0.38] rounded-lg p-2 justify-between">
        <span className="rounded-lg bg-[#ff7262] px-3 py-1 text-white">
          {version}
        </span>
        <span className="text-white">
          {status}
        </span>
      </div>
    </div>
  );
} 
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png";
import LogoBlack from "@/assets/logobalck.png";
import LogoWhite from "@/assets/logowhite.png";

export default function LogoPage() {
  const logos = [
    {
      title: "Primary Logo",
      description: "기본 컬러 로고 - 흰색 배경에 사용",
      image: Logo,
      downloads: [
        { format: "PNG", size: "512x512", url: "/assets/logo.png" },
      ],
      bgColor: "bg-white",
    },
    {
      title: "Black Logo",
      description: "블랙 로고 - 밝은 배경에 사용",
      image: LogoBlack,
      downloads: [
        { format: "PNG", size: "512x512", url: "/assets/logobalck.png" },
      ],
      bgColor: "bg-white",
    },
    {
      title: "White Logo",
      description: "화이트 로고 - 어두운 배경에 사용",
      image: LogoWhite,
      downloads: [
        { format: "PNG", size: "512x512", url: "/assets/logowhite.png" },
      ],
      bgColor: "bg-gray-900",
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1>로고</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Dive to Bada 로고 파일
        </p>
      </div>

      <div>
        <h2>다운로드</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {logos.map((logo) => (
            <div key={logo.title} className="border rounded-lg overflow-hidden">
              {/* 미리보기 */}
              <div className={`flex items-center justify-center h-48 ${logo.bgColor}`}>
                <Image
                  src={logo.image}
                  alt={logo.title}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>

              {/* 정보 */}
              <div className="p-5 bg-white">
                <h3 className="font-semibold mb-1">{logo.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {logo.description}
                </p>

                {/* 다운로드 버튼 */}
                <div className="space-y-2">
                  {logo.downloads.map((download) => (
                    <a
                      key={download.url}
                      href={download.url}
                      download
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        ↓ {download.format} {download.size}
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}


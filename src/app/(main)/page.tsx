// 서버 컴포넌트
import TrendsSidebar from "@/components/TrendsSidebar";
import MainContent from "./MainContent";


export default function Home() {
  return (
    <div className="flex gap-6">
      <MainContent />
      <aside className="sticky top-[5.25rem] hidden h-fit max-h-[calc(100vh-6rem)] overflow-y-auto w-72 flex-none space-y-5 rounded-2xl md:block lg:w-80">
        <TrendsSidebar />
      </aside>
    </div>
  );
}

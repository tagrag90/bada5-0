import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";
import { NoticeCard } from "@/components/NoticeCard";


export default function Home() {
  return (
    <div className="flex gap-6">
      <main className="flex-1">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </main>
      <aside className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 rounded-2xl md:block lg:w-80">
        <NoticeCard 
          title="Divetobada is operating very well!"
          version="Gen 6"
          status="Stable"
        />
        <TrendsSidebar />
      </aside>
    </div>
  );
}

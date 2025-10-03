import { Metadata } from "next";

import Explore from "./Explore";

export const metadata: Metadata = {
  title: "Explore",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-0 mx-2">
        {/* <div className="rounded-2xl bg-card p-5 shadow-sm md:hidden">
          <h1 className="text-center text-2xl font-bold">탐험</h1>
        </div> */}
        <Explore />
      </div>
    </main>
  );
}

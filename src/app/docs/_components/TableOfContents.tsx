"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const content = document.querySelector(".docs-content");
    if (!content) return;

    const headings = content.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      }
      items.push({
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      });
    });

    setToc(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  if (toc.length === 0) return null;

  return (
    <aside className="docs-toc hidden xl:block">
      <div className="space-y-2">
        <p className="font-semibold text-sm mb-3">On this page</p>
        <nav>
          <ul className="space-y-2">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "text-sm transition-colors hover:text-foreground",
                    item.level === 3 && "pl-4",
                    activeId === item.id
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}


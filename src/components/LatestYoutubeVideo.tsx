"use client";

import React, { useEffect, useState } from "react";

interface LatestYoutubeVideoProps {
  channelId: string;
}

const LatestYoutubeVideo: React.FC<LatestYoutubeVideoProps> = ({
  channelId,
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      setError(null);
      try {
        const response = await fetch(
          `/api/youtube/latest?channelId=${channelId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch latest video");
        }
        const data = await response.json();
        if (data.videoId) {
          setVideoId(data.videoId);
        } else {
          throw new Error(data.error || "Video ID not found");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "최신 영상을 불러오는데 실패했습니다.");
      }
    };

    if (channelId) {
      fetchLatestVideo();
    }
  }, [channelId]);

  const renderContent = () => {
    if (error) {
      return <p className="text-sm text-destructive">{error}</p>;
    }

    if (!videoId) {
      return (
        <div className="aspect-video w-full animate-pulse bg-muted mx-[-1rem] mb-[-1rem]"></div>
      );
    }

    return (
      <div className="aspect-video overflow-hidden mx-[-1rem] mb-[-1rem]">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  return (
    <div className="space-y-3 overflow-hidden rounded-2xl bg-card p-4 shadow-sm">
      <div className="text-xl font-bold">Youtube</div>
      {renderContent()}
    </div>
  );
};

export default LatestYoutubeVideo; 
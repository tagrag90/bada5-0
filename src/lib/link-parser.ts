import { Instagram, Youtube, Twitter, Music, Music2, Link2 } from "lucide-react";

export type SocialPlatform = 'instagram' | 'youtube' | 'twitter' | 'tiktok' | 'spotify' | 'other';

export interface ParsedSocialLink {
  url: string;
  platform: SocialPlatform;
  icon: any;
  color: string;
  label: string;
}

export function parseSocialLinks(urls: string[]): ParsedSocialLink[] {
  return urls.map(url => {
    const platform = detectPlatform(url);
    return {
      url,
      platform,
      icon: getPlatformIcon(platform),
      color: getPlatformColor(platform),
      label: getPlatformLabel(platform),
    };
  });
}

function detectPlatform(url: string): SocialPlatform {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('instagram.com')) return 'instagram';
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
  if (lowerUrl.includes('tiktok.com')) return 'tiktok';
  if (lowerUrl.includes('spotify.com')) return 'spotify';
  
  return 'other';
}

function getPlatformIcon(platform: SocialPlatform) {
  const icons = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    tiktok: Music,
    spotify: Music2,
    other: Link2,
  };
  return icons[platform];
}

function getPlatformColor(platform: SocialPlatform): string {
  // 모든 플랫폼을 검정색으로 통일
  return 'text-black hover:text-gray-800';
}

function getPlatformLabel(platform: SocialPlatform): string {
  const labels = {
    instagram: 'Instagram',
    youtube: 'YouTube',
    twitter: 'X (Twitter)',
    tiktok: 'TikTok',
    spotify: 'Spotify',
    other: 'Link',
  };
  return labels[platform];
}

export function extractUsername(url: string, platform: SocialPlatform): string | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    if (platform === 'instagram' || platform === 'twitter' || platform === 'tiktok') {
      const match = path.match(/\/@?([^\/]+)/);
      return match ? `@${match[1]}` : null;
    }
    
    return null;
  } catch {
    return null;
  }
}



export interface SubtitleWord {
  text: string;
  start: number; // relative to clip start, in seconds
  end: number;   // relative to clip start, in seconds
  style?: 'highlight' | 'accent' | 'normal'; // highlight = yellow, accent = green/pink
  emoji?: string; // custom emoji above the word
}

export interface VideoClip {
  id: string;
  title: string;
  startTime: number; // absolute start in source video
  endTime: number;   // absolute end in source video
  viralScore: number; // 0-100
  viralExplanation: string;
  hashtags: string[];
  socialDescription: string;
  words: SubtitleWord[];
  videoUrl?: string; // main video file URL
  secondaryVideoUrl?: string; // gaming / gameplay URL for split screen
}

export type SubtitleStyle = 'hormozi' | 'neon' | 'minimal' | 'bold-retro';

export type VideoLayout = 'vertical-crop' | 'split-screen' | 'widescreen';

export interface SavedWorkspace {
  id: string;
  name: string;
  videoUrl: string;
  videoTitle: string;
  clips: VideoClip[];
  createdAt: string;
}

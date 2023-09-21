export interface Song {
  slug: string;
  videoId: string;
  skipStart?: number;
  name: string;
  difficulty: number;
  lines: Line[];
}

export interface Line {
  time: number;
  lyrics: string;
  fanchants: Fanchant[];
}

export type Fanchant = [string, string, number | null];

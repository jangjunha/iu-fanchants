export interface Song {
  id: string;
  lines: Line[];
}

export interface Line {
  time: number;
  lyrics: string;
  fanchants: Fanchant[];
}

export type Fanchant = [string, number | null];

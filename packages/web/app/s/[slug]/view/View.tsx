"use client";

import { Song } from "iu-fanchants-common/types/song";
import { useMemo, useState } from "react";

import Keypad from "@/components/Keypad";
import { convertCharToKeypad } from "@/utils/key";

import Video from "../Video";
import Link from "next/link";

const DISPLAY_TIME = 0.16;

const View = ({ song }: { song: Song }): React.ReactElement => {
  const [current, setCurrent] = useState(0);
  const keys = useMemo(
    () =>
      song.lines
        .flatMap(({ fanchants }) => fanchants)
        .flatMap(([, k, t]): [string, number][] => {
          if (t == null) return [];
          return [[convertCharToKeypad(k), t]];
        }),
    [song]
  );

  const keypadColor = (keypad: string): string | undefined =>
    keys
      .filter(([, t]) => current >= t - 0.02 && current < t + DISPLAY_TIME)
      .some(([k]) => k === keypad)
      ? "bg-uaena"
      : undefined;
  const isSongEnd = current > song.end;

  return (
    <div className="flex-1 flex flex-col-reverse justify-between py-4">
      {!isSongEnd && <Keypad color={keypadColor} />}
      {isSongEnd && (
        <div className="flex flex-col gap-y-2 min-h-[10.5rem] text-center">
          <Link
            href={`/`}
            className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-black rounded-md py-2"
          >
            처음으로
          </Link>
          <Link
            href={`/s/${song.slug}/play/`}
            className="bg-violet-600 hover:bg-violet-500 border border-violet-500 rounded-md py-2"
          >
            플레이
          </Link>
        </div>
      )}
      <Video
        song={song}
        onPlaying={setCurrent}
        className="flex-1"
        controls
        subtitle
      />
    </div>
  );
};
export default View;

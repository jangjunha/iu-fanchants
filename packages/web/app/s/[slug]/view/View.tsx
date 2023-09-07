"use client";

import { Song } from "iu-fanchants-common/types/song";
import { useMemo, useState } from "react";

import Keypad from "@/components/Keypad";
import { convertCharToKeypad } from "@/utils/key";

import Video from "../Video";

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
    []
  );

  const keypadColor = (keypad: string): string | undefined =>
    keys
      .filter(([, t]) => current >= t - 0.02 && current < t + DISPLAY_TIME)
      .some(([k]) => k === keypad)
      ? "bg-uaena"
      : undefined;

  return (
    <div className="flex-1 flex flex-col-reverse justify-between py-4">
      <Keypad color={keypadColor} />
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

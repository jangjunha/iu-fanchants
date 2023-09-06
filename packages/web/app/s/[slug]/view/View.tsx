"use client";

import { Song } from "iu-fanchants-common/types/song";
import Link from "next/link";
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
    <>
      <h1>
        <Link href="/">아이유 응원법</Link>{" "}
        <Link href={`/s/${song.slug}/`}>{song.name}</Link>
      </h1>
      <Video song={song} onPlaying={setCurrent} controls subtitle />
      <Keypad color={keypadColor} />
    </>
  );
};
export default View;

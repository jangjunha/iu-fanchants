"use client";

import { Song } from "iu-fanchants-common/types/song";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import Keypad from "@/components/Keypad";
import { convertCharToKeypad } from "@/utils/key";

import Video from "../Video";

const JUDGEMENTS = [
  { name: "PERFECT", score: 100, threshold: 0.15 },
  { name: "GREAT", score: 70, threshold: 0.25 },
  { name: "GOOD", score: 30, threshold: 0.6 },
];
const FALSE_SCORE = -50;
const MISS_SCORE = 0;
const DISPLAY_TIME = 0.1;

const scoreToJudgement = (score: number): string | undefined => {
  if (score === MISS_SCORE) return "MISS";
  if (score === FALSE_SCORE) return "ERROR";
  for (const judgement of JUDGEMENTS) {
    if (score === judgement.score) return judgement.name;
  }
};

const Play = ({ song }: { song: Song }): React.ReactElement => {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<
    { key: string; time: number; index?: number; score: number }[]
  >([]);

  const timeline: [string, number][] = useMemo(
    () =>
      song.lines
        .flatMap((l) => l.fanchants)
        .filter(([, , t]) => t != null)
        .map(([, k, t]) => [convertCharToKeypad(k), t as number]),
    []
  );

  useEffect(() => {
    const max_threshold = JUDGEMENTS.slice(-1)[0].threshold;
    const time = current;
    for (const [index, [k, t]] of timeline.entries()) {
      if (!scores.some((s) => s.index === index) && time >= t + max_threshold) {
        setScores((p) => [{ key: k, time, index, score: MISS_SCORE }, ...p]);
      }
    }
  }, [timeline, scores, current]);

  const handlePressKeypad = useCallback(
    async (keypad: string): Promise<void> => {
      for (let i = 0; i < timeline.length; i++) {
        const [k, t] = timeline[i];
        if (scores.some(({ index }) => index === i)) continue;

        if (keypad === k) {
          for (const { threshold, score } of JUDGEMENTS) {
            if (current >= t - threshold && current <= t + threshold) {
              setScores((p) => [
                { key: keypad, time: current, index: i, score },
                ...p,
              ]);
              return;
            }
          }
        }
      }
      setScores((p) => [
        { key: keypad, time: current, score: FALSE_SCORE },
        ...p,
      ]);
    },
    [timeline, scores, current]
  );

  const keypadColor = (keypad: string): string | undefined => {
    for (const { key: k, time: t, score } of scores) {
      if (current < t + DISPLAY_TIME && keypad === k) {
        if (score >= 100) {
          return "bg-blue-500";
        }
        if (score >= 50) {
          return "bg-green-500";
        }
        if (score > 0) {
          return "bg-yellow-500";
        }
        return "bg-red-500";
      }
    }
  };

  return (
    <>
      <h1>
        <Link href="/">아이유 응원법</Link>{" "}
        <Link href={`/s/${song.slug}/`}>{song.name}</Link>
      </h1>
      <Video song={song} onPlaying={setCurrent} />
      <section className="text-center flex justify-between mx-1">
        <div>
          {
            scores
              .filter((s) => current < s.time + DISPLAY_TIME)
              .map(({ score }) => scoreToJudgement(score))[0]
          }
        </div>
        <div>{scores.reduce((acc, s) => acc + s.score, 0)} </div>
      </section>
      <Keypad color={keypadColor} onKeydown={handlePressKeypad} />
    </>
  );
};
export default Play;

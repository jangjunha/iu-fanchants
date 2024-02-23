"use client";

import classNames from "classnames";
import { Song } from "iu-fanchants-common/types/song";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import Keypad from "@/components/Keypad";
import { convertCharToKeypad } from "@/utils/key";

import Video from "../Video";

const JUDGEMENTS = [
  { name: "PERFECT", score: 100, threshold: 0.18 },
  { name: "GREAT", score: 70, threshold: 0.25 },
  { name: "GOOD", score: 30, threshold: 0.6 },
];
const FALSE_SCORE = -30;
const MISS_SCORE = 0;
const DISPLAY_TIME = 0.1;
const JUDGEMENT_DISPLAY_TIME = 0.2;

const scoreToJudgement = (score: number): string => {
  if (score === MISS_SCORE) return "MISS";
  if (score === FALSE_SCORE) return "ERROR";
  for (const judgement of JUDGEMENTS) {
    if (score === judgement.score) return judgement.name;
  }
  return "";
};

const ScoreResult = ({ percent }: { percent: number }): React.ReactElement => {
  const id = "result-grade";
  const cls = "text-8xl";
  if (percent >= 0.99) {
    return (
      <div id={id} className={classNames(cls, "text-uaena")}>
        SSS
      </div>
    );
  }
  if (percent >= 0.975) {
    return (
      <div id={id} className={classNames(cls, "text-violet-400")}>
        SS
      </div>
    );
  }
  if (percent >= 0.95) {
    return (
      <div id={id} className={classNames(cls, "text-teal-400")}>
        S
      </div>
    );
  }
  if (percent >= 0.9) {
    return (
      <div id={id} className={classNames(cls, "text-lime-400")}>
        A
      </div>
    );
  }
  if (percent >= 0.8) {
    return (
      <div id={id} className={classNames(cls, "text-yellow-400")}>
        B
      </div>
    );
  }
  if (percent >= 0.75) {
    return (
      <div id={id} className={classNames(cls, "text-orange-400")}>
        C
      </div>
    );
  }
  if (percent >= 0.5) {
    return (
      <div id={id} className={classNames(cls, "text-rose-400")}>
        D
      </div>
    );
  }
  return (
    <div id={id} className={classNames(cls, "text-neutral-400")}>
      F
    </div>
  );
};

const Result = ({
  scores,
  total,
  max,
}: {
  scores: Score[];
  total: number;
  max: number;
}): React.ReactElement => {
  const handleRetry = () => {
    window.location.reload();
  };
  const buttonCls = "border p-2 text-center rounded-md";
  return (
    <>
      <section className="font-hand">
        <div className="flex flex-col items-center">
          <ScoreResult percent={total / max} />
          <div className="text-2xl text-neutral-400">
            <span id="result-percent">{((total / max) * 100).toFixed(1)}</span>{" "}
            %
          </div>
          <div id="result-total" className="text-2xl">
            {total}
          </div>
        </div>
        <ul className="text-right mt-8">
          {[
            ...JUDGEMENTS,
            { name: "MISS", score: MISS_SCORE, threshold: 0 },
            { name: "ERROR", score: FALSE_SCORE, threshold: 0 },
          ].map(({ name, score }) => {
            return (
              <li key={name} className="flex justify-end">
                <span>{name}</span>
                <span id={`result-detail-${name}`} className="w-12 text-right">
                  {scores.filter(({ score: s }) => s === score).length}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="flex flex-col w-full mt-16 gap-4">
        <button
          onClick={handleRetry}
          className={classNames(
            buttonCls,
            "bg-violet-600 hover:bg-violet-500 border-violet-500"
          )}
        >
          다시하기
        </button>
        <Link
          href="/"
          className={classNames(
            buttonCls,
            "bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-black"
          )}
        >
          처음으로
        </Link>
      </section>
    </>
  );
};

const colorForScore = (score: number, type: string = "text"): string => {
  if (score >= 100) {
    return type === "bg" ? "bg-blue-500" : "text-blue-500";
  }
  if (score >= 50) {
    return type === "bg" ? "bg-green-500" : "text-green-500";
  }
  if (score > 0) {
    return type === "bg" ? "bg-yellow-500" : "text-yellow-500";
  }
  return type === "bg" ? "bg-red-500" : "text-red-500";
};

type Score = { key: string; time: number; index?: number; score: number };

const Play = ({ song }: { song: Song }): React.ReactElement => {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [isEnd, setEnd] = useState(false);

  const timeline: [string, number][] = useMemo(
    () =>
      song.lines
        .flatMap((l) => l.fanchants)
        .filter(([, , t]) => t != null)
        .map(([, k, t]) => [convertCharToKeypad(k), t as number]),
    [song]
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

  const handleEnd = useCallback(() => {
    setEnd(true);
  }, []);

  const keypadColor = (keypad: string): string | undefined => {
    for (const { key: k, time: t, score } of scores) {
      if (current < t + DISPLAY_TIME && keypad === k) {
        return colorForScore(score, "bg");
      }
    }
  };
  const isSongEnd = current > song.end;

  const maxScore = useMemo(
    () => timeline.length * JUDGEMENTS[0].score,
    [timeline]
  );
  const totalScore = scores.reduce((acc, s) => acc + s.score, 0);
  const judgement = scores
    .filter((s) => current < s.time + JUDGEMENT_DISPLAY_TIME)
    .map(({ score, time }): [string, number, number] => [
      scoreToJudgement(score),
      score,
      time,
    ])[0];
  return isEnd ? (
    <div id="result" className="flex flex-col items-center py-16">
      <Result scores={scores} total={totalScore} max={maxScore} />
    </div>
  ) : (
    <div className="flex-1 flex flex-col-reverse justify-between py-4">
      <div className="flex flex-col">
        {!isSongEnd && (
          <Keypad
            disabled={song.end != null && current > song.end}
            color={keypadColor}
            onKeydown={handlePressKeypad}
          />
        )}
        {isSongEnd && (
          <div className="flex flex-col gap-y-2 min-h-[10.5rem] text-center">
            <button
              className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-black rounded-md py-2"
              onClick={() => setEnd(true)}
            >
              결과 보기
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-evenly">
        <Video song={song} onPlaying={setCurrent} onEnd={handleEnd} />
        <section className="text-center flex flex-col">
          <div className="font-hand text-2xl h-8">
            {judgement && (
              <span
                key={judgement[2]}
                className={classNames(
                  "animate-ping font-bold",
                  colorForScore(judgement[1])
                )}
              >
                {judgement[0]}
              </span>
            )}
          </div>
          <div className="font-hand text-neutral-500">{totalScore}</div>
        </section>
      </div>
    </div>
  );
};
export default Play;

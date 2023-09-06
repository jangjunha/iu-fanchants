import classNames from "classnames";
import { Fanchant, Line } from "iu-fanchants-common/types/song";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import YouTube from "react-youtube";

import Keypad from "./components/Keypad";
import blueming from "./songs/blueming";
import { convertCharToKeypad } from "./utils/key";

import "./App.css";

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

const Fanchant_ = ({
  fanchant: [char, t],
  time,
}: {
  fanchant: Fanchant;
  time: number;
}) => {
  const past = t != null && time >= t;
  return (
    <span
      className={classNames({
        "text-uaena": past,
        "text-transparent": t == null,
      })}
    >
      {char}
    </span>
  );
};

const Line_ = ({
  line: { lyrics, fanchants },
  time,
}: {
  line: Line;
  time: number;
}) => {
  return (
    <div className="flex flex-col items-start leading-5">
      <p
        className="min-h-[1.25em] text-slate-400"
        dangerouslySetInnerHTML={{ __html: lyrics }}
      />
      <p className="min-h-[1.25em]">
        {fanchants.map((e, i) => (
          <Fanchant_ fanchant={e} time={time} key={i} />
        ))}
      </p>
    </div>
  );
};

const SONG = blueming;

const App = (): React.ReactElement => {
  const { id } = SONG;

  const timeline: [string, number][] = useMemo(
    () =>
      SONG.lines
        .flatMap((l) => l.fanchants)
        .filter(([, t]) => t != null)
        .map(([c, t]) => [convertCharToKeypad(c), t as number]),
    []
  );
  const [scores, setScores] = useState<
    { key: string; time: number; index?: number; score: number }[]
  >([]);

  const player = useRef<YouTube>(null);
  const [currentTime, setCurrentTime] = useState(0);
  // const key = usePressedKeys();
  // const [keys, setKeys] = useState<[string, number][]>([]);

  const handlePressKeypad = useCallback(
    async (keypad: string): Promise<void> => {
      if (player.current == null) {
        return;
      }
      const time = await player.current.internalPlayer.getCurrentTime();
      for (let i = 0; i < timeline.length; i++) {
        const [k, t] = timeline[i];
        if (scores.some(({ index }) => index === i)) continue;

        if (keypad === k) {
          for (const { threshold, score } of JUDGEMENTS) {
            if (time >= t - threshold && time <= t + threshold) {
              setScores((p) => [{ key: keypad, time, index: i, score }, ...p]);
              return;
            }
          }
        }
      }
      setScores((p) => [{ key: keypad, time, score: FALSE_SCORE }, ...p]);
    },
    [timeline, scores]
  );

  useEffect(() => {
    const timerId = setInterval(() => {
      if (player.current == null) {
        return;
      }
      player.current.internalPlayer.getCurrentTime().then(setCurrentTime);
    }, 1000 / 60);
    return () => clearInterval(timerId);
  }, []);

  const targets = SONG.lines.filter((c) => c.time <= currentTime);
  const [line1] = targets.filter((_, i) => i % 2 === 0).slice(-1);
  const [line2] = targets.filter((_, i) => i % 2 === 1).slice(-1);

  useEffect(() => {
    const max_threshold = JUDGEMENTS.slice(-1)[0].threshold;
    const timerId = setInterval(async () => {
      if (player.current == null) {
        return;
      }
      const time = await player.current.internalPlayer.getCurrentTime();
      for (const [index, [k, t]] of timeline.entries()) {
        if (
          !scores.some((s) => s.index === index) &&
          time >= t + max_threshold
        ) {
          setScores((p) => [{ key: k, time, index, score: MISS_SCORE }, ...p]);
        }
      }
    }, 1000 / 60);
    return () => clearInterval(timerId);
  }, [timeline, scores]);

  const keypadColor = (keypad: string): string | undefined => {
    for (const { key: k, time: t, score } of scores) {
      if (currentTime < t + DISPLAY_TIME && keypad === k) {
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
    <div>
      <YouTube
        videoId={id}
        ref={player}
        className="w-full max-h-[50vh] aspect-video"
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            // controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            rel: 0,
          },
        }}
      />
      <section className="text-lg xs:text-2xl p-4 flex flex-col items-center gap-4">
        <Line_ line={line1} time={currentTime} />
        <Line_ line={line2} time={currentTime} />
      </section>
      <section className="text-center flex justify-between mx-1">
        <div>
          {
            scores
              .filter((s) => currentTime < s.time + DISPLAY_TIME)
              .map(({ score }) => scoreToJudgement(score))[0]
          }
        </div>
        <div>{scores.reduce((acc, s) => acc + s.score, 0)} </div>
      </section>
      <Keypad color={keypadColor} onKeydown={handlePressKeypad} />
      {/* <section className="font-mono bg-slate-800 p-4">
        <p className="font-mono">{time.toFixed(2)}</p>
        <input
          type="text"
          value=""
          onKeyDown={(e) => {
            setKeys((prev) => [...prev, [e.key, time]]);
          }}
        />
        <ul>
          {keys.map(([, t], i) => (
            <li key={i}>{t.toFixed(2)}</li>
          ))}
        </ul>
      </section> */}
    </div>
  );
};

export default App;

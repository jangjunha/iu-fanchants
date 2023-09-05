import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

import "./App.css";
import type { Fanchant, Line } from "./types/song";
import blueming from "./songs/blueming";
import { disassembleHangul } from "@toss/hangul";

const Fanchant = ({
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
    <div className="flex flex-col items-start">
      <p className="min-h-[1.6em] text-slate-400">{lyrics}</p>
      <p className="min-h-[1.6em]">
        {fanchants.map((e, i) => (
          <Fanchant fanchant={e} time={time} key={i} />
        ))}
      </p>
    </div>
  );
};

const SONG = blueming;
const KEYPADS = [
  ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ"],
  ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ"],
  ["ㅋ", "ㅌ", "ㅊ", "ㅍ", "(함성)"],
];

const convertToKeypad = (c: string): string => {
  if (c == "(함성)") {
    return "(함성)";
  }
  const chosung = disassembleHangul(c)[0];
  switch (chosung) {
    case "ㅃ":
      return "ㅂ";
    case "ㅉ":
      return "ㅈ";
    case "ㄸ":
      return "ㄷ";
    case "ㄲ":
      return "ㄱ";
    case "ㅆ":
      return "ㅅ";
  }
  return chosung;
};

const App = (): React.ReactElement => {
  const { id } = SONG;
  const player = useRef<YouTube>(null);
  const [time, setTime] = useState(0);
  // const [keys, setKeys] = useState<[string, number][]>([]);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (player.current == null) {
        return;
      }
      player.current.internalPlayer.getCurrentTime().then(setTime);
    }, 1000 / 60);
    return () => clearInterval(timerId);
  }, []);

  const targets = SONG.lines.filter((c) => c.time <= time);
  const [line1] = targets.filter((_, i) => i % 2 === 0).slice(-1);
  const [line2] = targets.filter((_, i) => i % 2 === 1).slice(-1);

  const highlightKeys = [line1, line2]
    .flatMap((line) => line.fanchants)
    .filter(([, t]) => t != null && t >= time && t < time + 0.1)
    .map(([c]) => convertToKeypad(c));

  return (
    <>
      <YouTube
        videoId={id}
        ref={player}
        className="w-full max-h-[50vh] aspect-video"
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            // controls: 0,
            // disablekb: 1,
            // fs: 0,
            iv_load_policy: 3,
            rel: 0,
          },
        }}
      />
      <section className="text-lg xs:text-2xl p-4 flex flex-col items-center gap-4">
        <Line_ line={line1} time={time} />
        <Line_ line={line2} time={time} />
      </section>
      <section className="select-none flex flex-col [&>div]:flex [&>div]:justify-stretch">
        {KEYPADS.map((row, i) => (
          <div key={i}>
            {row.map((keypad) => (
              <button
                key={keypad}
                className={classNames(
                  "flex-1",
                  "flex",
                  "items-center",
                  "justify-center",
                  "h-12",
                  "border",
                  "border-slate-700",
                  "m-1",
                  "active:bg-slate-500",
                  { "bg-uaena": highlightKeys.includes(keypad) }
                )}
              >
                {keypad}
              </button>
            ))}
          </div>
        ))}
      </section>
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
    </>
  );
};

export default App;

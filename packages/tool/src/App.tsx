import classNames from "classnames";
import { Fanchant, Song } from "iu-fanchants-common/types/song";
import { produce } from "immer";
import { useRef, useState } from "react";
import YouTube from "react-youtube";

type Stage = "source" | "line" | "fanchant";

const isSkipChar = (ch: string): boolean => {
  switch (ch) {
    case " ":
    case "?":
    case ".":
    case "-":
    case '"':
      return true;
  }
  return false;
};

function App() {
  const playerRef = useRef<YouTube>(null);
  const player = playerRef.current?.internalPlayer;

  const [id, setId] = useState("");
  const [stage, setStage] = useState<Stage>("source");

  const [source, setSource] = useState("");

  const [lines, setLines] = useState<[string, string, number | null][]>([]);
  const [fanchants, setFanchants] = useState<Fanchant[][]>([]);

  const skipSpaces = (idx: number) => {
    setFanchants(
      produce((draft) => {
        const line = lines[idx][1];
        const fanchant = draft[idx];
        const ci = fanchant.length;
        if (isSkipChar(line[ci])) {
          draft[idx][ci] = [line[ci], line[ci], null];
        }
      })
    );
  };

  return (
    <div className="flex">
      <section className="p-4 max-w-fit">
        <input
          type="text"
          value={id}
          onChange={(ev) => setId(ev.currentTarget.value)}
          className="border border-slate-200 px-2 mb-4"
          placeholder="Video ID"
        />
        <YouTube videoId={id} ref={playerRef} />
      </section>
      <section className="p-4 flex-1 flex flex-col">
        {stage === "source" && (
          <>
            <h3>가사 입력</h3>
            <textarea
              className="border border-slate-200 h-80"
              value={source}
              onChange={(ev) => setSource(ev.currentTarget.value)}
            />
            <button
              onClick={() => {
                setLines(
                  source
                    .split("\n")
                    .map((line) =>
                      line
                        .replace(/\d{2}\:\d{2}/g, "")
                        .replace(/[()!.]/g, "")
                        .trim()
                    )
                    .filter((line) => line)
                    .map((line) => [line, line, null])
                );
                setStage("line");
              }}
            >
              다음
            </button>
          </>
        )}
        {stage === "line" && (
          <>
            <h3>행 타이밍 입력</h3>
            <ul className="flex flex-col divide-y">
              {lines.map(([lyrics, fanchant, time], idx) => (
                <li key={idx} className="flex odd:bg-white even:bg-slate-100">
                  <div
                    className={classNames(
                      "w-[5em] flex items-center justify-center font-mono bg-violet-100/50 cursor-pointer text-slate-500",
                      {
                        "bg-orange-200/50": time == null,
                      }
                    )}
                    onClick={async () => {
                      const curr = await player.getCurrentTime();
                      setLines(
                        produce((draft) => {
                          draft[idx][2] = curr;
                        })
                      );
                    }}
                  >
                    {time?.toFixed(2) ?? "-"}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <input
                      type="text"
                      value={lyrics}
                      onChange={(ev) =>
                        setLines(
                          produce((draft) => {
                            draft[idx][0] = ev.target.value;
                          })
                        )
                      }
                      className="bg-transparent px-2"
                    />
                    <input
                      type="text"
                      value={fanchant}
                      onChange={(ev) =>
                        setLines(
                          produce((draft) => {
                            draft[idx][1] = ev.target.value;
                          })
                        )
                      }
                      className="bg-transparent px-2"
                    />
                  </div>
                  <div className="flex p-2">
                    <button
                      className="opacity-30 hover:opacity-100"
                      onClick={() => {
                        setLines(
                          produce((draft) => {
                            draft.splice(idx, 1);
                          })
                        );
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setFanchants(Array(lines.length).fill([]));
                setStage("fanchant");
              }}
            >
              다음
            </button>
          </>
        )}
        {stage === "fanchant" && (
          <>
            <h3>응원법 매핑</h3>
            <ul className="divide-y">
              {lines.map(([, raw], idx) => {
                const fanchant = fanchants[idx] ?? [];
                const ci = fanchant.length;
                return (
                  <li className="flex gap-x-2">
                    <input
                      type="text"
                      className="w-8 bg-violet-100"
                      value=""
                      onKeyDown={async (ev) => {
                        switch (ev.key) {
                          case "Enter":
                            if (ci >= raw.length) return;
                            const curr = await player.getCurrentTime();
                            setFanchants(
                              produce((draft) => {
                                draft[idx][ci] = [raw[ci], raw[ci], curr];
                              })
                            );
                            skipSpaces(idx);
                            return;
                          case " ":
                            if (ci >= raw.length) return;
                            setFanchants(
                              produce((draft) => {
                                draft[idx][ci] = [raw[ci], raw[ci], null];
                              })
                            );
                            skipSpaces(idx);
                            return;
                          case "Backspace":
                            setFanchants(
                              produce((draft) => {
                                if (draft[idx].length > 0) {
                                  draft[idx].pop();
                                }
                              })
                            );
                            return;
                        }
                      }}
                    />
                    <p>
                      {[...raw].map((ch, i) => (
                        <span
                          className={classNames({
                            "bg-gray-100":
                              !isSkipChar(ch) &&
                              i < ci &&
                              fanchant[i][2] == null,
                            "bg-green-100":
                              !isSkipChar(ch) &&
                              i < ci &&
                              fanchant[i][2] != null,
                            "bg-violet-200": i === ci,
                            "bg-orange-100": !isSkipChar(ch) && i > ci,
                          })}
                        >
                          {ch}
                        </span>
                      ))}
                    </p>
                  </li>
                );
              })}
            </ul>
            <button onClick={() => setStage("line")}>이전</button>
            <button
              onClick={() => {
                const song: Song = {
                  slug: "",
                  name: "",
                  difficulty: 0,
                  videoId: id,
                  lines: fanchants.map((f, i) => {
                    const [lyrics] = lines[i];
                    let time = 0;
                    if (i >= 2) {
                      time = lines[i - 1][2] ?? 0;
                    }
                    return {
                      time,
                      lyrics,
                      fanchants: f,
                    };
                  }),
                };
                console.log(JSON.stringify(song));
              }}
            >
              완료 (print to console)
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default App;

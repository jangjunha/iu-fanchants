"use client";

import classNames from "classnames";
import { Fanchant, Line, Song } from "iu-fanchants-common/types/song";
import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

const Fanchant_ = ({
  fanchant: [char, , t],
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
    <div
      className={classNames("flex flex-col items-start leading-5 font-hand", {
        "text-lg": fanchants.length < 25,
        "text-base": fanchants.length >= 25 && fanchants.length < 36,
        "text-xs": fanchants.length >= 36,
      })}
    >
      <p
        className="min-h-[1.25rem] text-neutral-400"
        dangerouslySetInnerHTML={{ __html: lyrics }}
      />
      <p className="min-h-[1.25rem]">
        {fanchants.map((e, i) => (
          <Fanchant_ fanchant={e} time={time} key={i} />
        ))}
      </p>
    </div>
  );
};

export interface VideoProps {
  song: Song;
  controls?: boolean;
  subtitle?: boolean;
  onPlaying?(time: number): void;
  onEnd?(): void;
  className?: string;
}

const Video = ({
  song: { videoId, lines },
  controls = false,
  subtitle = false,
  onPlaying,
  onEnd,
  className,
}: VideoProps): React.ReactElement => {
  const player = useRef<YouTube>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const timerId = setInterval(async () => {
      if (player.current == null) {
        return;
      }
      const curr = await player.current.internalPlayer.getCurrentTime();
      setCurrentTime(curr);
      onPlaying?.(curr);
    }, 1000 / 60);
    return () => clearInterval(timerId);
  }, []);

  const targets = lines.filter((c) => c.time <= currentTime);
  const [line1] = targets.filter((_, i) => i % 2 === 0).slice(-1);
  const [line2] = targets.filter((_, i) => i % 2 === 1).slice(-1);

  return (
    <div className={classNames("flex flex-col justify-evenly", className)}>
      <YouTube
        videoId={videoId}
        ref={player}
        className="w-full max-h-[50vh] aspect-video"
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: controls ? 1 : 0,
            disablekb: controls ? 0 : 1,
            fs: 0,
            iv_load_policy: 3,
            rel: 0,
          },
        }}
        onEnd={onEnd}
      />
      {subtitle && (
        <section className="p-4 flex flex-col items-center gap-4">
          <Line_ line={line1} time={currentTime} />
          <Line_ line={line2} time={currentTime} />
        </section>
      )}
    </div>
  );
};
export default Video;

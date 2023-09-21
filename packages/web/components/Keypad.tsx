"use client";

import classNames from "classnames";
import { useEffect } from "react";

import { convertKeyToKeypad } from "@/utils/key";

const KEYPADS = [
  ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ"],
  ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ"],
  ["ㅋ", "ㅌ", "ㅊ", "ㅍ", "(함성)"],
];

export interface KeypadProps {
  disabled?: boolean;
  color?(key: string): string | undefined;
  onKeydown?(key: string): void;
}

const Keypad = ({
  disabled = false,
  color,
  onKeydown,
}: KeypadProps): React.ReactElement => {
  useEffect(() => {
    if (disabled) {
      return;
    }
    const handleKeydown = (ev: KeyboardEvent): void => {
      const keypad = convertKeyToKeypad(ev.key);
      if (keypad == null) {
        return;
      }
      onKeydown?.(keypad);
    };
    window.addEventListener("keydown", handleKeydown, false);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [disabled, onKeydown]);

  return (
    <section className="select-none flex flex-col">
      {KEYPADS.map((row, i) => (
        <div key={i} className="flex justify-stretch">
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
                "border-neutral-700",
                "rounded",
                "m-1",
                color?.(keypad) ?? "bg-neutral-800",
                { "text-neutral-600": disabled }
              )}
              onClick={() => {
                if (!disabled) {
                  onKeydown?.(keypad);
                }
              }}
            >
              {keypad}
            </button>
          ))}
        </div>
      ))}
    </section>
  );
};
export default Keypad;

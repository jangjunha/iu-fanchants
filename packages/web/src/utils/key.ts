import { disassembleHangul } from "@toss/hangul";

export const convertCharToKeypad = (c: string): string => {
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

export const convertKeyToKeypad = (key: string): string | undefined => {
  switch (key) {
    case "ㅂ":
    case "ㅃ":
    case "q":
    case "Q":
      return "ㅂ";
    case "ㅈ":
    case "ㅉ":
    case "w":
    case "W":
      return "ㅈ";
    case "ㄷ":
    case "ㄸ":
    case "e":
    case "E":
      return "ㄷ";
    case "ㄱ":
    case "ㄲ":
    case "r":
    case "R":
      return "ㄱ";
    case "ㅅ":
    case "ㅆ":
    case "t":
    case "T":
      return "ㅅ";
    case "ㅁ":
    case "a":
    case "A":
      return "ㅁ";
    case "ㄴ":
    case "s":
    case "S":
      return "ㄴ";
    case "ㅇ":
    case "d":
    case "D":
      return "ㅇ";
    case "ㄹ":
    case "f":
    case "F":
      return "ㄹ";
    case "ㅎ":
    case "g":
    case "G":
      return "ㅎ";
    case "ㅋ":
    case "z":
    case "Z":
      return "ㅋ";
    case "ㅌ":
    case "x":
    case "X":
      return "ㅌ";
    case "ㅊ":
    case "c":
    case "C":
      return "ㅊ";
    case "ㅍ":
    case "v":
    case "V":
      return "ㅍ";
    case " ":
    case "Enter":
      return "(함성)";
  }
};

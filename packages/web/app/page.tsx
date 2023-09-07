import Image from "next/image";
import Link from "next/link";

import songs from "@/songs";
import logo from "@/public/logo-outline.svg";
import ike from "@/public/logo.svg";
import { Song } from "iu-fanchants-common/types/song";

export default function Home() {
  return (
    <>
      <header className="flex flex-col items-center my-8 text-4xl font-bold">
        <Image src={logo} alt="아이크" className="w-16 mb-4" />
        <h1 className="font-hand">아이유 응원법 초성 리듬게임</h1>
      </header>
      <section className="px-4">
        {songs
          .reduce<Song[][]>((res, song) => {
            res[song.difficulty] = res[song.difficulty] ?? [];
            res[song.difficulty].push(song);
            return res;
          }, [])
          .map((items, difficulty) => (
            <div>
              <header className="text-neutral-300 mb-2">
                {
                  <h3>
                    {Array(difficulty)
                      .fill(null)
                      .map(() => (
                        <Image src={ike} alt="아이크" className="w-6 inline" />
                      ))}
                  </h3>
                }
              </header>
              <ul
                role="list"
                className="bg-white text-black border mb-8 divide-y rounded-md shadow shadow-neutral-600"
              >
                {items.map((song) => (
                  <li key={song.slug} className="flex hover:bg-violet-200">
                    <Link
                      href={`./s/${song.slug}/`}
                      className="flex-1 flex items-center justify-between gap-x-6 px-4 py-4"
                    >
                      <div className="flex items-center min-w-0 gap-x-4">
                        <img
                          className="h-12 w-12 flex-none rounded-full bg-gray-50 object-cover border"
                          src={`https://i3.ytimg.com/vi/${song.videoId}/maxresdefault.jpg
`}
                        />
                        <div className="min-w-0 flex-auto">
                          <p className="font-semibold leading-6">{song.name}</p>
                        </div>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-gray-300"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </section>
    </>
  );
}

import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

import songs from "@/songs";
import Scoreboard from "./Scoreboard";
import { DateTime } from "luxon";

type Props = {
  params: { slug: string };
};

export const generateStaticParams = () =>
  songs.map((song) => ({ slug: song.slug }));

export async function generateMetadata(
  { params: { slug } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const song = songs.filter((s) => s.slug === slug)[0];
  return {
    metadataBase: new URL("https://iu-fanchants.web.app/"),
    title: `아이유 응원법 - ${song.name}`,
    description: `아이유 ${song.name} 응원법 초성 리듬게임!`,
    applicationName: "아이유 응원법 초성 리듬게임",
    openGraph: {
      images: ["/logo.svg"],
    },
    keywords: [
      "아이유 응원법",
      "IU Fanchants",
      `${song.name} 응원법`,
      `${song.name} 리듬게임`,
      "초성 리듬게임",
    ],
    themeColor: "#E4E724",
    alternates: {
      canonical: `https://iu-fanchants.web.app/s/${song.slug}/`,
    },
  };
}

const SongPage = ({ params: { slug } }: Props): React.ReactElement => {
  const song = songs.filter((s) => s.slug === slug)[0];
  return (
    <>
      <img
        className="my-4"
        src={
          song.thumbnail ??
          `https://i3.ytimg.com/vi/${song.videoId}/maxresdefault.jpg`
        }
      />
      <section className="flex flex-col gap-y-2 mt-8 text-center">
        <Link
          href={`/s/${slug}/view/`}
          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-black rounded-md py-2"
        >
          미리보기
        </Link>
        <Link
          href={`/s/${slug}/play/`}
          className="bg-violet-600 hover:bg-violet-500 border border-violet-500 rounded-md py-2"
        >
          플레이
        </Link>
      </section>
      <div className="mt-16">
        <Scoreboard slug={slug} />
      </div>
    </>
  );
};
export default SongPage;

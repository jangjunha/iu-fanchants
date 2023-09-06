import songs from "@/songs";
import Link from "next/link";

export const generateStaticParams = () =>
  songs.map((song) => ({ slug: song.slug }));

const SongPage = ({
  params: { slug },
}: {
  params: { slug: string };
}): React.ReactElement => {
  const song = songs.filter((s) => s.slug === slug)[0];

  const buttonCls =
    "bg-violet-400/40 hover:bg-violet-600/40 border border-violet-400/40 rounded-md text-center py-2";
  return (
    <>
      <h1>
        <Link href="/">아이유 응원법</Link>{" "}
        <Link href={`/s/${slug}/`}>{song.name}</Link>
      </h1>
      <section className="flex flex-col gap-y-2">
        <Link href={`/s/${slug}/view/`} className={buttonCls}>
          미리보기
        </Link>
        <Link href={`/s/${slug}/play/`} className={buttonCls}>
          플레이
        </Link>
      </section>
    </>
  );
};
export default SongPage;

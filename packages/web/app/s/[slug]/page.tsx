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
  return (
    <>
      <img
        className="my-4"
        src={`https://i3.ytimg.com/vi/${song.videoId}/maxresdefault.jpg
`}
      />
      <section className="flex flex-col gap-y-2 text-center text-lg">
        <Link
          href={`/s/${slug}/view/`}
          className="bg-yellow-600 hover:bg-yellow-500 border border-yellow-500 rounded-md py-2"
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
    </>
  );
};
export default SongPage;

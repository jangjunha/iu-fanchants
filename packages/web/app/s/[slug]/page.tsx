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
    </>
  );
};
export default SongPage;

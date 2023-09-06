import songs from "@/songs";

import Play from "./Play";

const PlayPage = ({
  params: { slug },
}: {
  params: { slug: string };
}): React.ReactElement => {
  const song = songs.filter((s) => s.slug === slug)[0];

  return <Play song={song} />;
};
export default PlayPage;

export { generateStaticParams } from "../page";

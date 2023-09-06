import songs from "@/songs";

import View from "./View";

const ViewPage = ({
  params: { slug },
}: {
  params: { slug: string };
}): React.ReactElement => {
  const song = songs.filter((s) => s.slug === slug)[0];

  return <View song={song} />;
};
export default ViewPage;

export { generateStaticParams } from "../page";

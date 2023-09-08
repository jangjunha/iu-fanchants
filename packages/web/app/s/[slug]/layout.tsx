import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo-colored.svg";
import songs from "@/songs";

const SongLayout = ({
  params: { slug },
  children,
}: {
  params: { slug: string };
  children?: React.ReactNode;
}): React.ReactElement => {
  const song = songs.filter((s) => s.slug === slug)[0];
  return (
    <>
      <header className="flex items-center mt-4">
        <Link href="/" className="mr-2 px-2">
          <Image src={logo} alt="아이크" className="w-4 pb-1 inline" />
        </Link>{" "}
        <Link href={`/s/${slug}/`} id="song-name">
          {song.name}
        </Link>
      </header>
      {children}
    </>
  );
};
export default SongLayout;

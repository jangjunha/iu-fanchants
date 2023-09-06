import songs from "@/songs";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>아이유 응원법</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.slug}>
            <Link href={`./s/${song.slug}/`}>{song.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

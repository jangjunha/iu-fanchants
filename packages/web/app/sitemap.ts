import { MetadataRoute } from "next";

import songs from "@/songs";

const staticMap: MetadataRoute.Sitemap = [
  {
    url: "https://iu-fanchants.web.app",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
];

const songsMap: MetadataRoute.Sitemap = songs.map((song) => ({
  url: `https://iu-fanchants.web.app/s/${song.slug}/`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.8,
}));

const sitemap = (): MetadataRoute.Sitemap => [...staticMap, ...songsMap];
export default sitemap;

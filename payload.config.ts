import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { NewJobPositions } from "./collections/NewJobPositions";
import { Departments } from "./collections/Departments";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Icon: "./components/payload/AdminIcon.tsx#default", // or #AdminIcon for named export
        Logo: "./components/payload/AdminLogo.tsx#default",
      },
    },
  },
  collections: [Users, Media, NewJobPositions, Departments],
  localization: {
    locales: [
      {
        label: "English",
        code: "en",
      },
      {
        label: "Bulgarian",
        code: "bg",
      },
    ],
    defaultLocale: "bg", // required
    fallback: true, // defaults to true
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [],
});

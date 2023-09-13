import fonts from "./fonts.json" assert { type: "json" };
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs";
import axios from "axios";
import path from "node:path";
import ora from "ora";

const fontsDirectory = "./fonts";

if (!existsSync(fontsDirectory)) mkdirSync(fontsDirectory);

fonts.fonts.forEach(async (font) => {
  const time = performance.now();
  const spinner = ora(`Downloading ${font.family}...`).start();
  const url = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
    font.family,
  )}`;
  const response = await axios.get(url);
  const fontFile = response.data.match(/url\((.*?)\)/)[1];
  const fontUrl = fontFile.replace(/'|"/g, "");
  const fontResponse = await axios.get(fontUrl, {
    responseType: "arraybuffer",
    onDownloadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percent = Math.floor((loaded / total) * 100);
      spinner.text = `Downloading ${font.family}... ${percent}%`;
    },
  });

  const fontFileName = `${font.family.replace(" ", "-")}.ttf`;
  const fontFilePath = path.join(fontsDirectory, fontFileName);

  let unlinked = false;
  if (existsSync(fontFilePath)) {
    unlinkSync(fontFilePath);
    unlinked = true;
  }

  writeFileSync(fontFilePath, fontResponse.data);
  spinner.succeed(
    `${unlinked ? "Updated" : "Downloaded"} ${fontFileName} in ${Math.floor(
      performance.now() - time,
    )}ms`,
  );
});

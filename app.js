import express from "express";
// middleware-> gives body to each res
import bodyParser from "body-parser";
// url to png qr-image
import qr from "qr-image";
// file system to write and create files
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

// ensures correct urls
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3002;

//  middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "url.html"));
});

app.post("/generate", (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).send("URL is required! ");
  }

  // this saves my qr image in as qr_svg in my public/qr_img.png path
  const qr_svg = qr.image(__dirname, "public", "qr_img.png");

  const qrPath = path.join(__dirname, "public", "qr_img.png");
  qr_svg.pipe(fs.createWriteStream(qrPath));

  // save url to text file called url.txt
  fs.writeFile("url.txt", url, (err) => {
    if (err) throw err;
    console.log("file saved!");
  });

  res.redirect("/qr");
});

app.get("/qr", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "qr.html"));
});

app.listen(port, () => {
  console.log(`server is running at https://localhost:${port}`);
});

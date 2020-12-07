const fs = require("fs");
const path = require("path");

const processFile = (params, next) => (err, rawData) => {
  if (err) {
    return console.log(`Couldn't open file - ${err}`);
  }
  const imagesDir = path.join(__dirname, "images");
  const data = rawData
    .toString()
    .split("\n")
    .filter(x => x.trim() !== "")
    .map(processLine({ ...params, imagesDir }))
    .reverse();
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  next(params, data);
};

const processLine = (params) => (line, i) => {
  const m = line.match(/\{([^}]+)\}/);
  if (!m || m.length < 2) {
    return lineError(line, i, "to match /{([^}]+)}/");
  }

  const data = m[1].split(",");
  if (data.length < 6) {
    return lineError(
      line,
      i,
      "to contain at least 6 numbers within curly braces"
    );
  }
  [cra1, cra2, cra3, dc1, dc2, dc3, ...whatever] = data.map((x) => x.trim());
  const cra = `${cra1}+${cra2}+${cra3}`;
  const dc = `${dc1}+${dc2}+${dc3}`;
  const imageName = path.join(
    params.imagesDir,
    `image_${cra1}_${cra2}_${cra3}_${dc1}_${dc2}_${dc3}.${params.imageType.extension}`
  );
  return { cra, dc, imageName };
};

const lineError = (line, i, expected) =>
  console.log(
    `Line ${i} corrupted - got \"${line}\", was expecting it ${expected}`
  );

module.exports = { processFile };

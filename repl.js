const fs = require("fs");

const equinox = {
  1: "J2000",
  2: "B1950",
};

const projection = {
  1: "SIN",
  2: "TAN",
  3: "ARC",
  4: "NCP",
  5: "GLS",
  6: "MER",
  7: "AIT",
  8: "STG",
};

const polarization = {
  1: "I",
  2: "IQU",
};

const imageType = {
  1: { header: "image%2Fx-fits", extension: "fits" },
  2: { header: "application%2Foctet-stream", extension: "fits" },
  3: { header: "application%2Fpostscript", extension: "ps" },
  4: { header: "image%2Fjpeg", extension: "jpg" },
};

const mkQuestions = (defaults) => [
  {
    text: "Enter data file name\n",
    cb: (questionNo, params, answer) => {
      const filename = answer.trim();

      if (fs.existsSync(filename)) {
        return {
          params: { ...params, filename },
          questionNo: questionNo + 1,
        };
      }
      console.log(`File ${filename} does not exist`);
      return { params, questionNo };
    },
  },
  {
    text: `Select polarization: 1 - Stokes I, 2 - IQU (default: ${defaults.polarization})\n`,
    cb: (questionNo, params, answer) => {
      const a = answer.trim();
      if (a === "") {
        return {
          params: { ...params, polarization: defaults.polarization },
          questionNo: questionNo + 1,
        };
      }

      if (Object.keys(polarization).includes(a)) {
        return {
          params: { ...params, polarization: polarization[a] },
          questionNo: questionNo + 1,
        };
      }
      return { params, questionNo };
    },
  },
  {
    text: `Select image type: 1 - FITS Image, 2 - FITS save to disk, 3 - Contour image, 4 - JPEG image (default: ${defaults.imageType.header.replace(
      "%2F",
      "/"
    )})\n`,
    cb: (questionNo, params, answer) => {
      const a = answer.trim();

      if (a === "") {
        return {
          params: { ...params, imageType: defaults.imageType },
          questionNo: questionNo + 1,
        };
      }
      if (Object.keys(imageType).includes(a)) {
        return {
          params: { ...params, imageType: imageType[a] },
          questionNo: questionNo + 1,
        };
      }
      return { params, questionNo };
    },
  },
  {
    text: `Select equinox: 1 - J2000, 2 - B1950 (default: ${defaults.equinox})\n`,
    cb: (questionNo, params, answer) => {
      const a = answer.trim();
      if (a === "") {
        return {
          params: { ...params, equinox: defaults.equinox },
          questionNo: questionNo + 1,
        };
      }
      if (Object.keys(equinox).includes(a)) {
        return {
          params: { ...params, equinox: equinox[a] },
          questionNo: questionNo + 1,
        };
      }
      return { params, questionNo };
    },
  },
  {
    text: `Select projection: 1 - Sine, 2 - Tangent, 3 - Arc, 4 - North Celestial Pole, 5 - Global sinusoidal, 6 - Mercator, 7 - Aitoff, 8 - Stereographic (default: ${defaults.projection}) \n`,
    cb: (questionNo, params, answer) => {
      const a = answer.trim();
      if (a === "") {
        return {
          params: { ...params, projection: defaults.projection },
          questionNo: questionNo + 1,
        };
      }
      if (Object.keys(projection).includes(a)) {
        return {
          params: { ...params, projection: projection[a] },
          questionNo: questionNo + 1,
        };
      }
      return { params, questionNo };
    },
  },
  {
    text: `Select desired image size (in degrees) (default: ${defaults.imageSize.replace(
      "+",
      " "
    )}) \n`,
    cb: (questionNo, params, answer) => {
      const a = answer.trim();
      if (a === "") {
        return {
          params: { ...params, imageSize: defaults.imageSize },
          questionNo: questionNo + 1,
        };
      }
      const spl = a.split(" ");
      if (spl.length == 2 && !isNaN(Number(spl[0])) && !isNaN(Number(spl[1]))) {
        return {
          params: { ...params, imageSize: `${spl[0].trim()}+${spl[1].trim()}` },
          questionNo: questionNo + 1,
        };
      }
      return { params, questionNo };
    },
  },
  {
    text: `Select pixel spacing (default: ${defaults.pixelSpacing.replace(
      "+",
      " "
    )}) \n`,
    cb: (questionNo, params, answer) => {
      const a = answer.trim();
      if (a === "") {
        return {
          params: { ...params, pixelSpacing: "15.0+15.0" },
          questionNo: questionNo + 1,
        };
      }
      const spl = a.split(" ");
      if (spl.length == 2 && !isNaN(Number(spl[0])) && !isNaN(Number(spl[1]))) {
        return {
          params: {
            ...params,
            pixelSpacing: `${spl[0].trim()}+${spl[1].trim()}`,
          },
          questionNo: questionNo + 1,
        };
      }
      return { params, questionNo };
    },
  },
  {
    text: `Select desired rotation (N through E in degrees) (default: ${defaults.rotation}) \n`,
    cb: (questionNo, params, answer) => {
      const a = answer.trim();
      if (a === "") {
        return {
          params: { ...params, rotation: "0.0" },
          questionNo: questionNo + 1,
        };
      }

      if (!isNaN(Number(a))) {
        return {
          params: { ...params, rotation: a },
          questionNo: questionNo + 1,
        };
      }
      return { params, questionNo };
    },
  },
];

module.exports = { mkQuestions };

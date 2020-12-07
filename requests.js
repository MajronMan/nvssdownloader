const fs = require("fs");
const Stream = require("stream").Transform;

const https = require("https");

const mkBody = ({
  cra,
  dc,
  imageType,
  polarization,
  equinox,
  projection,
  imageSize,
  pixelSpacing,
  rotation,
}) =>
  `Equinox=${equinox}&PolType=${polarization}&ObjName=&RA=${cra}&Dec=%2B${dc}&Size=${imageSize}&Cells=${pixelSpacing}&MAPROJ=${projection}&rotate=${rotation}&Type=${imageType.header}`;

headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7",
  "cache-control": "max-age=0",
  "content-type": "application/x-www-form-urlencoded",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "sec-gpc": "1",
  "upgrade-insecure-requests": "1",
};

const mkHeaders = (body) => ({
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7",
  "Cache-Control": "max-age=0",
  Connection: "keep-alive",
  "Content-Length": body.length,
  "Content-Type": "application/x-www-form-urlencoded",
  DNT: "1",
  Host: "www.cv.nrao.edu",
  Origin: "https://www.cv.nrao.edu",
  Referer: "https://www.cv.nrao.edu/nvss/postage.shtml",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "sec-gpc": "1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.106 Safari/537.36",
});

const sendRequests = (params, data) => {
  if (data.length === 0) {
    return;
  }
  const [x, ...rest] = data;
  sendRequest({ ...x, ...params });
  setTimeout(() => sendRequests(params, rest), 1000);
};

const mkOptions = (body) => ({
  hostname: "www.cv.nrao.edu",
  port: 443,
  path: "/cgi-bin/postage.pl",
  method: "POST",
  headers: mkHeaders(body),
});

const sendRequest = (params) => {
  const body = mkBody(params);
  const options = mkOptions(body);
  const req = https.request(options, (res) => {
    let data = new Stream();

    res.on("data", (chunk) => {
      data.push(chunk);
    });

    res.on("end", () => {
      fs.writeFileSync(params.imageName, data.read());
      console.log(`${params.imageName} downloaded`);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(body);
  req.end();
};

module.exports = { sendRequests };

# NVSS Postage Stamp downloader

Downloads postage stamp for NRAO/VLA Sky Survey (NVSS) radio images of the sky in FITS or JPEG format, or as a contour plot from https://www.cv.nrao.edu/nvss/postage.shtml . Reads a file where each line denotes Central Right Ascension and Central Declination in a format of six comma-separated numbers within curly braces, e.g. `{0, 0, 37.01, 12, 12, 26.6}`.

## Usage

- check `defaultValues.json` to adjust default values for requests (see `repl.js` for accepted values)
- run `npm start` to execute the script

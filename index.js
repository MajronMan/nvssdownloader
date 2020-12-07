const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { mkQuestions } = require("./repl.js");
const { processFile } = require("./fileProcessing.js");
const { sendRequests } = require("./requests");

const start_ = (questions, { questionNo, params }) => {
  if (questionNo < questions.length) {
    const q = questions[questionNo];
    readline.question(q.text, (answer) =>
      start_(questions, q.cb(questionNo, params, answer))
    );
  } else {
    readline.close();
    fs.readFile(params.filename, processFile(params, sendRequests));
  }
};

const rawDefaults = fs.readFileSync("./defaultValues.json");
const defaults = JSON.parse(rawDefaults);
const questions = mkQuestions(defaults);

const start = () => start_(questions, { questionNo: 0, params: {} });

start();

const express = require("express");
const app = express();
const fs = require("fs");
const request = require("request");
const randomFile = require("select-random-file");
const recursive = require("recursive-readdir");

const PATH = "/home/storage/";

function gen(m) {
  return Math.floor(Math.random() * m - 1) + 1;
}

app.get("/random/*", (req, res) => {
  let t = PATH;
  res.set("Content-Type", "image/jpeg");
  recursive(PATH, ["*.gif", "*.mp4"], function (err, files) {
    if (err) return res.send(500);
    let ran = gen(files.length);
    let con = true;
    while (con) {
      if (
        files[ran].split(".").length > 2 ||
        !files[ran].includes(".") === true
      ) {
        ran = gen(files.length);
      } else {
        con = false;
      }
    }
    res.sendFile(files[ran]);
  });
});

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    if (err) callback(err, filename);
    else {
      var stream = request(uri);
      try {
        stream
          .pipe(
            fs.createWriteStream(filename).on("error", function (err) {
              callback(error, filename);
              stream.read();
            })
          )
          .on("close", function () {
            callback(null, filename);
          });
      } catch (e) {
        console.error("download caught - ", e);
      }
    }
  });
};

app.get("*", (req, res) => {
  if (!req.url.includes("save/")) return res.send("500");
  const file = req.url.substring(6, req.url.length);
  x = new Date();
  var UTCseconds = (x.getTime() + x.getTimezoneOffset() * 60 * 1000) / 1000;
  console.log("UTCseconds", UTCseconds);
  console.log(file);
  const filename = file.split("\\").pop().split("/").pop();
  download(file, PATH + UTCseconds.toString() + "-" + filename, (err, res) => {
    if (err) console.err(err);
  });
  file ? res.send(200) : res.send(500);
});

app.listen(8888);

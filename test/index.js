const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const speedBadge = require("../lib");

const TMP = "__tmp.html";

Promise.all([
  speedBadge({
    url: "zawor.ski"
  }),
  speedBadge({
    url: "zawor.ski",
    strat: "Desktop",
    showStratLabel: true
  }),
  speedBadge({
    // should fail, no url
  })
]).then(result => {
  const svgs = result.map(i => i.img);
  fs.writeFileSync(
    TMP,
    svgs
      .map(s => {
        return `<img style="display:block;margin-bottom:12px;" src='data:image/svg+xml;utf8,${s}'/>`;
      })
      .join("")
  );
  try {
    childProcess.execSync(`open -a "Google Chrome" ${path.resolve(TMP)}`);
  } finally {
    fs.unlinkSync(path.resolve(TMP));
  }
});

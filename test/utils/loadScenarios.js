/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const glob = require("glob");
const path = require("path");
const { readFileSync } = require("fs");

const pkg = require("../../package.json");

const debug = {
  version: pkg.version,
  source: "https://github.com/aimee-gm/microformats-parser.git",
  package: "https://www.npmjs.com/package/microformats-parser",
};

const loadScenarios = (baseDir, dir) => {
  const scenarios = glob
    .sync(`${baseDir}/${dir}/**/*.json`)
    .map((testFile) => path.relative(path.join(baseDir, dir), testFile))
    .map((testFile) => testFile.replace(".json", ""))
    .map((name) => {
      const inputPath = path.resolve(baseDir, dir, `${name}.html`);
      const expectedPath = path.resolve(baseDir, dir, `${name}.json`);

      return {
        name,
        input: readFileSync(inputPath, "utf8"),
        expected: Object.assign(
          { debug },
          JSON.parse(readFileSync(expectedPath, "utf8"))
        ),
      };
    });

  if (!scenarios.length) {
    throw new Error("No scenarios found");
  }

  return scenarios;
};

module.exports = loadScenarios;

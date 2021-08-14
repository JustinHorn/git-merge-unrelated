#!/usr/bin/env node

const yargs = require("yargs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
var mv = util.promisify(require("mv"));

const options = yargs
  .usage(
    "\n give --fN <folder_name> of the folder where repo shall be merged into"
  )
  .option("fN", {
    alias: "folderName",
    describe: "",
    type: "string",
    demandOption: true,
  })
  .usage("\n give  --ssh <ssh_of_repo> to merge into the current one")
  .option("ssh", {
    describe: "",
    type: "string",
    demandOption: true,
  })
  .help(true).argv;

const folderName = options.folderName;

const ssh = options.ssh;

console.log(folderName);
console.log(ssh);

const containsFolder = /\//;
const getFirstFolder = /^(.+\/)/;

async function main() {
  await exec(
    `git remote add ${folderName} ${ssh} && git fetch ${folderName} --tags && git merge --allow-unrelated-histories --no-commit ${folderName}/master`
  );

  const { stdout, stderr } = await exec("git diff --name-only --cached");

  console.log("hey!");
  console.log(stdout);
  console.log(stderr);

  const files = new Set();
  const folders = new Set();

  const items = stdout.split("\n");

  items.forEach((i) => {
    if (!i) return;
    if (containsFolder.test(i)) {
      const folderName = getFirstFolder.exec(i)[1];
      folders.add(folderName);
    } else {
      files.add(i);
    }
  });
  console.log(files);
  console.log(folders);

  files.forEach(async (f) => {
    await mv(f, folderName + "/" + f, { mkdirp: true }, function (err) {
      console.error(err);
    });
  });
  folders.forEach(async (f) => {
    await mv(f, folderName + "/" + f, { mkdirp: true }, function (err) {
      console.error(err);
    });
  });

  await exec(
    `git add . && git commit -a -m "Merge remote-tracking branch '${folderName}/master'"`
  );
}
main();

// console.log("hi");

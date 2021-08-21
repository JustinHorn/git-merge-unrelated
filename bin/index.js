#!/usr/bin/env node
const path = require("path");

const yargs = require("yargs");
const util = require("util");
const _exec = util.promisify(require("child_process").exec);
const exec = async (...args) => {
  console.log("git-merge-unrelated: " + args[0]);
  return await _exec(...args);
};
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

const containsFolder = RegExp(path.sep);
const getFirstFolder = RegExp(`^([^${path.sep}]+${path.sep})`);

async function main() {
  await exec(
    'git init && git commit --allow-empty -m "git-merge-unrelated-commit"'
  );
  await exec(`git remote add ${folderName} ${ssh}`);
  await exec(`git fetch ${folderName} --tags `);

  await exec(
    `git merge --allow-unrelated-histories --no-commit ${folderName}/master`
  );

  const { stdout, stderr } = await exec("git diff --name-only --cached");

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

  files.forEach(async (f) => {
    await mv(f, path.join(folderName, f), { mkdirp: true }, function (err) {
      console.error(err);
    });
  });
  folders.forEach(async (f) => {
    await mv(f, path.join(folderName, f), { mkdirp: true }, function (err) {
      console.error(err);
    });
  });

  await exec(
    `git add . && git commit -a -m "Merge remote-tracking branch '${folderName}/master'"`
  );

  await exec(`git remote remove ${folderName}`);
}
main();

#!/usr/bin/env node

/* eslint no-process-exit:0 */

"use strict";

const {exec, cp} = require("shelljs");
const program = require("commander");
const p = require("../package.json");
const {mkdirSync, writeFileSync, readFileSync} = require("fs");
const {join} = require("path");
const request = require("superagent");

const storeDir = join(process.env.HOME, ".iptr");
const itemList = join(storeDir, "items.json");
const publishDir = join(storeDir, "publish");

const getItemFile = () => JSON.parse(readFileSync(itemList, "utf8"));

const itemFilter = (pfile, item) => pfile.filter((proj) => proj.name === item);

const itemExists = (pfile, item) => itemFilter(pfile, item).length > 0;

const getItem = (pfile, item) => itemExists(pfile, item) ?
itemFilter(pfile, item)[0] : false;

const versionExists = (item, version) => item.hasOwnProperty("versions") ?
Object.keys(item.versions).filter((k) => k === version).length > 0 :
false;

const saveitemFile = (pfile) => writeFileSync(itemList, JSON.stringify(pfile));

const makeLink = (hash) => "http://ipfs.io/ipfs/" + hash;

const ipfsAdd = (path) => {

  console.log("adding " + path);

  let res = exec("ipfs add -r " + path);

  if (res.code === 0) {

    let lines = res.output.split(/\r?\n/);
    let lastLine = lines[lines.length - 2];

    return lastLine.split(" ")[1];
  }
};

const init = () => {

  try {

    mkdirSync(storeDir);
    mkdirSync(publishDir);

    writeFileSync(itemList, "[]");

    cp(join(__dirname, "..", "template", "app.js"), publishDir);
    cp(join(__dirname, "..", "template", "index.html"), publishDir);

    return true;
  } catch (e) {

    process.stdout.write(e.message);
    process.exit(1);
  }
};

const additem = (itemName) => {

  let pfile = getItemFile();

  let exists = itemExists(pfile, itemName);

  if (!exists) {

    let item = {

      name: itemName,

      versions: {}
    };

    pfile.push(item);

    writeFileSync(itemList, JSON.stringify(pfile), "utf8");
    console.log(itemName + " added to list of projcets");

    return pfile;
  } else {

    console.log("item " + itemName + " already tracked");
  }
};

const addVersion = (itemName, pathName, version) => {

  let pfile = getItemFile();

  if (!itemExists(pfile, itemName)) {

    pfile = additem(itemName);
  }

  let item = getItem(pfile, itemName);

  if (versionExists(item, version)) {

    console.log("version " + version +
        "is already published at " +
        item.versions[version]);
    process.exit(1);

  } else {

    console.log("creating version");
    let hash = ipfsAdd(pathName);

    if (item && !item.hasOwnProperty("versions")) {

      item.versions = {};
    }

    console.log("object hash: " + hash);
    item.versions[version] = hash;
    saveitemFile(pfile);
  }
};

const open = (itemname, versionname) => {

  let file = getItemFile();

  if (itemExists(file, itemname)) {
    let i = getItem(file, itemname);

    if (versionExists(i, versionname)) {

      let hash = i.versions[versionname];

      console.log("opening " + hash);

      exec("open " + makeLink(hash));
    } else {

      console.log("version doesn't exist");
    }
  } else {

    console.log("unable to find item " + itemname);
  }
};

const publish = () => {

  let items = getItemFile();

  let str = "window.items = " + JSON.stringify(items);

  writeFileSync(join(publishDir, "items.js"), str);

  let hash = ipfsAdd(publishDir);
  request("http://localhost:5001/api/v0/name/publish?arg=" + hash).end((err, res) => {

    if (err) {

      console.log(err);
      process.exit(1);
    }
    console.log("published to ipns/", res.body.Name);
  });
};

program.version(p.version);

program.command("init")
.description("initialise your item storage")
.action(init);

program.command("add <itemname> <pathname> <version>")
.description("publish a new item version to ipfs")
.action(addVersion);

program.command("open <itemname> [versionname]")
.description("open the latest version of a item, or a specific" +
    "version, in your browser")
.action(open);

program.command("list [itemname]",
    "without [itemname], list your items, with" +
    " [itemname], list the published versions of that" +
    " item")
.action(()=>{});


program.command("publish")
.description("generate a HTML page which lists all of your" +
    " stored items and publish it under your ipns")
.action(publish);

program.parse(process.argv);

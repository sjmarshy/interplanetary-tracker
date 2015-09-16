#!/usr/bin/env node

/* eslint no-process-exit:0 */

"use strict";

let {exec} = require("shelljs");
const program = require("commander");
const p = require("../package.json");
const {mkdirSync, writeFileSync, readFileSync} = require("fs");
const {join} = require("path");

const storeDir = join(process.env.HOME, ".iptr");
const itemList = join(storeDir, "items.json");

const getitemFile = () => JSON.parse(readFileSync(itemList, "utf8"));

const itemFilter = (pfile, item) => pfile.filter((proj) => proj.name === item);

const itemExists = (pfile, item) => itemFilter(pfile, item).length > 0;

const getitem = (pfile, item) => itemExists(pfile, item) ?
	itemFilter(pfile, item)[0] : false;

const versionExists = (item, version) => item.hasOwnProperty("versions") ?
  Object.keys(item.versions).filter((k) => k === version).length > 0 :
  false;

const saveitemFile = (pfile) => writeFileSync(itemList, JSON.stringify(pfile));

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
		writeFileSync(itemList, "[]");
		return true;
	} catch (e) {

		process.stdout.write(e.message);
		process.exit(1);
	}
};

const additem = (itemName) => {

	let pfile = getitemFile();

	let exists = itemExists(pfile, itemName);

	if (!exists) {

		pfile.push({
			name: itemName,
			versions: {}
		});

		writeFileSync(itemList, JSON.stringify(pfile), "utf8");
		console.log(itemName + " added to list of projcets");
	} else {

		console.log("item " + itemName + " already tracked");
	}
};

const addVersion = (itemName, pathName, version) => {

  let pfile = getitemFile();

  if (!itemExists(pfile, itemName)) {
    additem(itemName);
  }

  let item = getitem(pfile, itemName);

  if (versionExists(item, version)) {

    console.log("version " + version +
        "is already published at " +
        item.versions[version]);
    process.exit(1);

  } else {

    console.log("creating version");
    let hash = ipfsAdd(pathName);

    if (!item.hasOwnProperty("versions")) {

      item.versions = {};
    }

    console.log("object hash: " + hash);
    item.versions[version] = hash;
    saveitemFile(pfile);

  }
};

program.version(p.version);

program.command("init")
	.description("initialise your item storage")
	.action(init);

program.command("add <itemname> <pathname> <version>")
	.description("publish a new item version to ipfs")
	.action(addVersion);

program.command("open <itemname> [versionname]",
			"open the latest version of a item, or a specific" +
			"version, in your browser")
	.action(()=>{});

program.command("list [itemname]",
		"without [itemname], list your items, with" +
		" [itemname], list the published versions of that" +
		" item")
	.action(()=>{});


program.command("publish",
		"generate a HTML page which lists all of your" +
		" stored items and publish it under your ipns")
	.action(()=>{});

program.parse(process.argv);

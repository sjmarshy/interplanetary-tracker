#!/usr/bin/env node

const program = require("commander");
const p = require("../package.json");
const {writeFileSync, readFileSync} = require("fs");
const {join} = require("path");

const projectPath = join(process.env["HOME"], ".ipfsprojetcs");

const getProjectFile = () => JSON.parse(readFileSync(projectPath, "utf8"));

const projectFilter = (pfile, project) => pfile.filter((p) => { p.name === project });

const projectExists = (pfile, project) => projectFilter(pfile, project) > 0;

const getProject = (pfile, project) => projectExists(pfile, project) ?
	projectFilter(pfile, project)[0] : false;

const versionExists = (project, version) => {
	// TODO
}

const init = () => {

	try {
		writeFileSync(projectPath, "[]");
		return true;
	} catch (e) {

		process.stdout.write(e.message);
		process.exit(1);
	}
};

const addProject = (projectName) => {

	let pfile = getProjectFile();

	let exists = pfile.filter((p) => {
		return p.name === projectName;
	});

	if (exists.length < 1) {

		pfile.push({
			name: projectName,
			versions: {}
		});

		writeFileSync(projectPath, JSON.stringify(pfile), "utf8");
		console.log(projectName + " added to list of projcets");
	} else {

		console.log("project " + projectName + " already tracked");
	}
};

const addVersion = (projectName, pathName, version) => {

	let pfile = getProjectFile();

	if (projectExists(pfile, projectName)) {

		let project = getProject(pfile, projectName);

		// TODO
		if (versionExists(project, version)) {
			console.log("version " + version +
					"is already published at " +
					project[version]);
			process.exit(1);
		} else {

			// TODO
			let hash = ipfsAdd(pathName);

			project[version] = hash;

			console.log(hash);

			// TODO
			saveProjectFile(pfile);
		}
	} else {

		console.log(
			projectName +
			" does not exist, try running `ipfsprojetcs project " +
			projectName);
	
		process.exit(1);
	}

	// check that the version hasn't been published before
	// ipfs add pathname
	// grab the hash and store it in the projects version object,
	// with the version as the key
}

program.version(p.version);

program.command("init")
	.description("initialise your project storage")
	.action(init);

program.command("project <projectname>")
	.description("add a new project to track")
	.action(addProject);

program.command("add <projectname> <pathname> <version>")
	.description("publish a new project version to ipfs")
	.action(addVersion);

program.command("open <projectname> [versionname]",
			"open the latest version of a project, or a specific" +
			"version, in your browser")
	.action(()=>{});

program.command("list [projectname]",
		"without [projectname], list your projects, with" +
		" [projectname], list the published versions of that" +
		" project")
	.action(()=>{});


program.command("publish", 
		"generate a HTML page which lists all of your" +
		" stored projects and publish it under your ipns")
	.action(()=>{})

program.parse(process.argv);

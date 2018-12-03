const $path = require("path");
const $fs = require("fs");
const $child = require("child_process");
const $rimraf = require("rimraf");

function cwd(path, f) {
	var old = process.cwd();

	process.chdir(path);

	try {
		return f();

	} finally {
		process.chdir(old);
	}
}

function runStatus(name, args) {
	var spawn = $child.spawnSync(name, args, {
		cwd: process.cwd(),
		env: process.env,
		stdio: "inherit",
		shell: true
	});

	if (spawn.error != null) {
		throw spawn.error;
	}

	return spawn.status;
}

function run(name, args) {
	const status = runStatus(name, args);

	if (status !== 0) {
		throw new Error("Command failed: " + status);
	}
}

function withLinkSource(path, f) {
	cwd(path, () => {
		run("yarn", ["link"]);
	});

	try {
		return f();

	} finally {
		cwd(path, () => {
			run("yarn", ["unlink"]);
		});
	}
}

function withLinkTargets(paths, f) {
	run("yarn", ["link"].concat(paths));

	try {
		return f();

	} finally {
		run("yarn", ["unlink"].concat(paths));
	}
}

function cp(from, to) {
	$fs.copyFileSync(from, to, $fs.constants.COPYFILE_EXCL);
}

function mv(from, to) {
	$fs.renameSync(from, to);
}

function rm(path) {
	$fs.unlinkSync(path);
}

function withTemporaryDirectory(path, f) {
	$fs.mkdirSync(path);

	try {
		return cwd(path, f);

	} finally {
		$rimraf.sync(path);
	}
}

function compare(a, b) {
	if (a === b) {
		return 0;
	} else if (a < b) {
		return -1;
	} else {
		return 1;
	}
}

// TODO sync version of this
function writeZipFile(info) {
	const output = $fs.createWriteStream(info.output);

	const archive = require("archiver")("zip", {
		zlib: { level: 9 } // Sets the compression level.
	});

	archive.on("warning", (err) => {
		console.error(err);
	});

	archive.on("error", (err) => {
		console.error(err);
	});

	archive.pipe(output);

	archive.directory(info.input, info.folder);

	archive.finalize();
}

function readFile(path) {
	return $fs.readFileSync(path, { encoding: "utf8" });
}

function writeFile(path, contents) {
	$fs.writeFileSync(path, contents);
}

function mapFile(path, f) {
	writeFile(path, f(readFile(path)));
}

function getDir(path) {
	try {
		return $fs.readdirSync(path);

	} catch (e) {
		if (e.code === "ENOTDIR") {
			return null;

		} else {
			throw e;
		}
	}
}

function isDir(path) {
	return $fs.statSync(path).isDirectory();
}

function cpr(from, to) {
	run("cpr", [from, to]);
}

function exists(path) {
	try {
		$fs.accessSync(path, $fs.constants.R_OK);
		return true;

	} catch (e) {
		if (e.code === "ENOENT") {
			return false;

		} else {
			throw e;
		}
	}
}

function gitFetchSubmodule() {
	run("git", ["checkout", "master"]);
	run("git", ["pull", "--rebase"]);
	//run("git", ["submodule", "update", "--init", "--remote", "--rebase", "."]);
}

function gitTag(s) {
	// TODO use signed tags ?
	run("git", ["tag", "--annotate", "-m", s, s]);
	run("git", ["push", "origin", s]);
}

function releaseSubPackage(name, gitName) {
	const distDir = $path.resolve(`dist/${name}`);

	const json = require(`../../${name}/package.json`);

	cwd($path.join("git", gitName), () => {
		gitFetchSubmodule();

		// TODO test that this escaping works correctly on Windows and Linux
		run("cpr", [`"${distDir.replace(/"/g, "\\$&")}"`, "dist", "--delete-first", "--overwrite"]);
		run("git", ["add", "."]);
		run("git", ["commit", "-m", `"Version ${json.version}"`]);
		run("git", ["push"]);
		gitTag(json.version);

		cwd($path.join("dist", "es2015"), () => {
			run("yarn", ["publish", "--new-version", json.version]);
		});
	});

	run("git", ["add", `git/${gitName}`, `package/${name}/package.json`]);
	run("git", ["commit", "-m", `"Published ${gitName} ${json.version}"`]);
	run("git", ["push"]);
	gitTag(`${name}-${json.version}`);
}

exports.cwd = cwd;
exports.runStatus = runStatus;
exports.run = run;
exports.withLinkSource = withLinkSource;
exports.withLinkTargets = withLinkTargets;
exports.cp = cp;
exports.cpr = cpr;
exports.mv = mv;
exports.rm = rm;
exports.getDir = getDir;
exports.isDir = isDir;
exports.exists = exists;
exports.compare = compare;
exports.withTemporaryDirectory = withTemporaryDirectory;
exports.writeZipFile = writeZipFile;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.mapFile = mapFile;
exports.gitFetchSubmodule = gitFetchSubmodule;
exports.gitTag = gitTag;
exports.releaseSubPackage = releaseSubPackage;

const $util = require("./util");
const $path = require("path");
const $fs = require("fs");


function mangleName(name) {
	return name.replace(/[\/\-]/g, "_");
}

function makeSubPackage1(entries, name, fileDir, inputDir, outputDir, packageName, useDefault) {
	const mangledName = mangleName(name);

	$fs.mkdirSync(name);

	$fs.readdirSync(inputDir).forEach((x) => {
		const path = $path.parse(x);

		if (path.name[0] !== ".") {
			if ($util.isDir($path.join(inputDir, x))) {
				makeSubPackage1(entries, `${name}/${x}`, `../${fileDir}/${x}`, `${inputDir}/${x}`, `${outputDir}/${x}`, `${packageName}/${x}`, useDefault);

			} else {
				if (path.ext === ".js") {
					const filename = path.name + ".js";

					if (filename === "index.js") {
						$fs.writeFileSync($path.join(name, name + ".js"),
`import * as m from "../${fileDir}/${path.name}";
window.am4${mangledName} = m;`);

						entries[`${outputDir}/${name}`] = `./${name}/${name}`;

					} else {
						if (useDefault) {
							$fs.writeFileSync($path.join(name, filename),
`import m from "../${fileDir}/${path.name}";
window.am4${mangledName}_${mangleName(path.name)} = m;`);

						} else {
							$fs.writeFileSync($path.join(name, filename),
`import * as m from "../${fileDir}/${path.name}";
window.am4${mangledName}_${mangleName(path.name)} = m;`);
						}

						entries[`${outputDir}/${path.name}`] = `./${name}/${filename}`;
					}
				}
			}
		}
	});
}

function makeSubPackage(entries, name, inputDir, outputDir, packageName, useDefault) {
	makeSubPackage1(entries, name, `../${inputDir}`, `../${inputDir}`, outputDir, packageName, useDefault);
}


function makeSrc(entries, path) {
	$fs.readdirSync(path).forEach((x) => {
		const path = $path.parse(x);

		if (path.ext === ".js") {
			const filename = path.name + ".js";

			if (path.name === "core") {
				$fs.writeFileSync("polyfill.js",
`const Promise = window.Promise;
const promiseThen = Promise && Promise.prototype.then;
const promiseCatch = Promise && Promise.prototype.catch;
const promiseFinally = Promise && Promise.prototype.finally;
const promiseReject = Promise && Promise.reject;
const promiseResolve = Promise && Promise.resolve;
const promiseAllSettled = Promise && Promise.allSettled;
const promiseAll = Promise && Promise.all;
const promiseRace = Promise && Promise.race;
const fetch = window.fetch;
const startsWith = String.prototype.startsWith;
const endsWith = String.prototype.endsWith;

export default function () {
	if (Promise) {
		window.Promise = Promise;

		if (promiseThen) { Promise.prototype.then = promiseThen; }
		if (promiseCatch) { Promise.prototype.catch = promiseCatch; }
		if (promiseFinally) { Promise.prototype.finally = promiseFinally; }
		if (promiseReject) { Promise.reject = promiseReject; }
		if (promiseResolve) { Promise.resolve = promiseResolve; }
		if (promiseAllSettled) { Promise.allSettled = promiseAllSettled; }
		if (promiseAll) { Promise.all = promiseAll; }
		if (promiseRace) { Promise.race = promiseRace; }
	}

	if (fetch) {
		window.fetch = fetch;
	}

	if (startsWith) {
		String.prototype.startsWith = startsWith;
	}

	if (endsWith) {
		String.prototype.endsWith = endsWith;
	}
};`);

				$fs.writeFileSync(filename,
`import fixPolyfills from "./polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
import * as m from "../es2015/core";
window.am4core = m;

// TODO move all of this code into a different module and then import it
function getCurrentScript() {
	if (document.currentScript) {
		return document.currentScript;

	// Internet Explorer only
	} else {
		var scripts = document.getElementsByTagName("script");
		return scripts[scripts.length - 1];
	}
}

function dirpath(x) {
	return /(.*\\/)[^\\/]*$/.exec(x)[1];
}

__webpack_public_path__ = dirpath(getCurrentScript().src);

fixPolyfills();
`);

				entries["core"] = "./" + filename;

			} else {
				const mangledName = mangleName(path.name);

				$fs.writeFileSync(filename,
`import * as m from "../es2015/${path.name}";
window.am4${mangledName} = m;`);

				entries[path.name] = "./" + filename;
			}
		}
	});
}


function runWebpack(name, options) {
	options = options.map(function (option) {
		option = Object.assign({
			"runtimeDir": "",
			"minify": true
		}, option);

		return "template(" + JSON.stringify(option) + ")";
	});

	$fs.writeFileSync("webpack.script.js",
		'var template = require(' + JSON.stringify(name) + ');\nmodule.exports = [' + options.join(",") + '];'
	);

	$util.withLinkSource("../es2015", () => {
		$util.withLinkTargets(["@amcharts/amcharts4"], () => {
			$util.run("webpack", ["--config", "webpack.script.js"]);
		});

		// TODO hacky
		/*$fs.readdirSync("../geodata/script").forEach((x) => {
			const path = $path.parse(x);

			if (path.ext === ".map") {
				$util.rm($path.join("..", "geodata", "script", x));
			}
		});*/
	});
}


exports.makeSubPackage = makeSubPackage;
exports.makeSrc = makeSrc;
exports.runWebpack = runWebpack;

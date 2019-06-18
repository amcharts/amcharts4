const $util = require("./util");
const $path = require("path");
const $fs = require("fs");


function makeSubPackage1(entries, name, fileDir, inputDir, outputDir, packageName, useDefault) {
	const mangledName = name.replace(/\//g, "_");

	$fs.mkdirSync(name);

	$fs.readdirSync(inputDir).forEach((x) => {
		const path = $path.parse(x);

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
window.am4${mangledName}_${path.name} = m;`);

					} else {
					$fs.writeFileSync($path.join(name, filename),
`import * as m from "../${fileDir}/${path.name}";
window.am4${mangledName}_${path.name} = m;`);
					}

					entries[`${outputDir}/${path.name}`] = `./${name}/${filename}`;
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
				$fs.writeFileSync(filename,
`import * as m from "../es2015/core";
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
`);

				entries["core"] = ["core-js/shim", "./" + filename];

			} else {
				$fs.writeFileSync(filename,
`import * as m from "../es2015/${path.name}";
window.am4${path.name} = m;`);

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

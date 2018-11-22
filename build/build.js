const $util = require("./util");
const $path = require("path");
const $fs = require("fs");


$util.cwd("dist", () => {
	var entries = {};

	function makeSubPackage1(name, fileDir, inputDir, outputDir, packageName) {
		const mangledName = name.replace(/\//g, "_");

		$fs.mkdirSync(name);

		$fs.readdirSync(inputDir).forEach((x) => {
			const path = $path.parse(x);

			if ($util.isDir($path.join(inputDir, x))) {
				makeSubPackage1(`${name}/${x}`, `../${fileDir}/${x}`, `${inputDir}/${x}`, `${outputDir}/${x}`, `${packageName}/${x}`);

			} else {
				if (path.ext === ".js") {
					const filename = path.name + ".js";

					if (filename === "index.js") {
						$fs.writeFileSync($path.join(name, filename),
`import * as m from "../${fileDir}/${path.name}";
window.am4${mangledName} = m;`);

					} else {
						$fs.writeFileSync($path.join(name, filename),
`import m from "../${fileDir}/${path.name}";
window.am4${mangledName}_${path.name} = m;`);
					}

					entries[`${outputDir}/${path.name}`] = `./${name}/${filename}`;
				}
			}
		});
	}

	function makeSubPackage(name, inputDir, outputDir, packageName) {
		makeSubPackage1(name, `../${inputDir}`, `../${inputDir}`, outputDir, packageName);
	}

	$util.withTemporaryDirectory("tmp", () => {
		var src = $fs.readdirSync("../es2015");

		src.forEach((x) => {
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

		makeSubPackage("lang", "es2015/lang", "./lang", "@amcharts/amcharts4/lang");
		makeSubPackage("themes", "es2015/themes", "./themes", "@amcharts/amcharts4/themes");
		makeSubPackage("geodata", "geodata/es2015", "../geodata/script", "@amcharts/amcharts4-geodata");
		//makeSubPackage("stock", "stock/es2015", "../stock/script", "@amcharts/amcharts4-stock");


		$fs.writeFileSync("webpack.script.js",
			'var template = require("../../webpack.config");\nmodule.exports = [template(' + JSON.stringify({
				"baseDir": "../script",
				"runtimeDir": "",
				"baseChunk": "core",
				"entry": entries,
				"minify": true
			}) + ')];'
		);

		$util.withLinkSource("../es2015", () => {
			$util.withLinkTargets(["@amcharts/amcharts4"], () => {
				$util.run("webpack", ["--config", "webpack.script.js"]);
			});

			// TODO hacky
			$fs.readdirSync("../geodata/script").forEach((x) => {
				const path = $path.parse(x);

				if (path.ext === ".map") {
					$util.rm($path.join("..", "geodata", "script", x));
				}
			});
		});
	});
});

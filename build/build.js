const $util = require("./util");
const $script = require("./script");

$util.cwd("dist", () => {
	$util.withTemporaryDirectory("tmp", () => {
		var entries = {};

		$script.makeSrc(entries, "../es2015");

		$script.makeSubPackage(entries, "lang", "es2015/lang", "./lang", "@amcharts/amcharts4/lang");
		$script.makeSubPackage(entries, "themes", "es2015/themes", "./themes", "@amcharts/amcharts4/themes");

		$script.runWebpack(entries);
	});
});

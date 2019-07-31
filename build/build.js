const $util = require("./util");
const $script = require("./script");

$util.cwd("dist", () => {
	$util.withTemporaryDirectory("tmp", () => {
		var entries = {};

		$script.makeSrc(entries, "../es2015");

		$script.makeSubPackage(entries, "lang", "es2015/lang", "./lang", "@amcharts/amcharts4/lang", true);
		$script.makeSubPackage(entries, "themes", "es2015/themes", "./themes", "@amcharts/amcharts4/themes", true);
		$script.makeSubPackage(entries, "plugins", "es2015/plugins", "./plugins", "@amcharts/amcharts4/plugins", false);

		$script.runWebpack("../../webpack.config", [{
			"entry": entries,
			"baseDir": "../script",
			"baseChunk": "core",
		}]);
	});
});

import * as amcharts4 from "@amcharts/amcharts4";
import * as sankey from "@amcharts/amcharts4/sankey";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";


amcharts4.system.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", sankey.SankeyDiagram);
chart.data = [
	{ from: "A", to: "D", value: 10 },
	{ from: "B", to: "D", value: 8 },
	{ from: "B", to: "E", value: 4 },
	{ from: "C", to: "E", value: 3 },
	{ from: "D", to: "G", value: 5 },
	{ from: "D", to: "I", value: 2 },
	{ from: "E", to: "H", value: 6 },
	{ from: "D", to: "H", value: 3 },
	{ from: "H", to: "J", value: 7 },
	{ from: "G", to: "J", value: 5 },
	{ from: "I", to: "J", value: 1 }
];

chart.dataFields.fromName = "from";
chart.dataFields.toName = "to";
chart.dataFields.value = "value";

// for right-most label to fit
chart.paddingRight = 30;
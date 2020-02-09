am4core.useTheme(am4themes_animated);

var data = [
	{ name: "A", value: 10 },
	{ name: "B", value: 10 },
	{ name: "C", value: 10 },
	{ name: "X", value: 2, sets: ["A", "B"] },
	{ name: "Y", value: 2, sets: ["A", "C"] },
	{ name: "Z", value: 2, sets: ["B", "C"] },
	{ name: "Q", value: 1, sets: ["A", "B", "C"] }
];

var chart = am4core.create("chartdiv", am4plugins_venn.VennDiagram);
var series = chart.series.push(new am4plugins_venn.VennSeries())

series.dataFields.category = "name";
series.dataFields.value = "value";
series.dataFields.intersections = "sets";
series.data = data;

chart.legend = new am4charts.Legend();
chart.legend.marginTop = 40;
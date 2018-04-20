import * as amcharts4 from "@amcharts/amcharts4/core";
import * as charts from "@amcharts/amcharts4/charts";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", charts.XYChart);

chart.data = [{
	"country": "USA",
	"visits": 23725
}, {
	"country": "China",
	"visits": 1882
}, {
	"country": "Japan",
	"visits": 1809
}, {
	"country": "Germany",
	"visits": 1322
}, {
	"country": "UK",
	"visits": 1122
}, {
	"country": "France",
	"visits": 1114
}, {
	"country": "India",
	"visits": 984
}, {
	"country": "Spain",
	"visits": 711
}, {
	"country": "Netherlands",
	"visits": 665
}, {
	"country": "Russia",
	"visits": 580
}, {
	"country": "South Korea",
	"visits": 443
}, {
	"country": "Canada",
	"visits": 441
}];

chart.padding(40, 40, 40, 40);

let categoryAxis = chart.xAxes.push(new charts.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "country";
categoryAxis.renderer.minGridDistance = 60;


let valueAxis = chart.yAxes.push(new charts.ValueAxis());
valueAxis.min = 0;
valueAxis.max = 24000;
valueAxis.strictMinMax = true;
valueAxis.renderer.minGridDistance = 30;

valueAxis.renderer.labels.template.hiddenState.transitionDuration = 2000;
valueAxis.renderer.labels.template.defaultState.transitionDuration = 2000;

// axis break
let axisBreak = valueAxis.axisBreaks.create();
axisBreak.startValue = 2100;
axisBreak.endValue = 22900;
axisBreak.breakSize = 0.01;


axisBreak.events.on("over", () => {
	axisBreak.animate([{ property: "breakSize", to: 1 }, { property: "opacity", to: 0.1 }], 1500, amcharts4.ease.sinOut);
})
axisBreak.events.on("out", () => {
	axisBreak.animate([{ property: "breakSize", to: 0.01 }, { property: "opacity", to: 1 }], 1000, amcharts4.ease.quadOut);
})


let series = chart.series.push(new charts.ColumnSeries());
series.dataFields.categoryX = "country";
series.dataFields.valueY = "visits";
series.columns.template.tooltipText = "{valueY.value}";
series.columns.template.tooltipY = 0;
series.columns.template.strokeOpacity = 0;

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series.columns.template.adapter.add("fill", (fill, target) => {
	return chart.colors.getIndex(target.dataItem.index);
});
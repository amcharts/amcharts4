import * as amcharts4 from "@amcharts/amcharts4";
import * as xy from "@amcharts/amcharts4/xy";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";


amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", xy.XYChart);

chart.data = [{
	"country": "USA",
	"visits": 3025
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

let categoryAxis = chart.xAxes.push(new xy.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "country";
categoryAxis.renderer.minGridDistance = 60;

let valueAxis = chart.yAxes.push(new xy.ValueAxis());

let series = chart.series.push(new xy.ColumnSeries());
series.dataFields.categoryX = "country";
series.dataFields.valueY = "visits";
series.tooltipText = "{valueY.value}"

chart.cursor = new xy.XYCursor();

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series.columns.template.adapter.add("fill", (fill, target) => {
	return chart.colors.getIndex(target.dataItem.index);
});

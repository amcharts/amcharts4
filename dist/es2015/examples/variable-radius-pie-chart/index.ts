import * as amcharts4 from "@amcharts/amcharts4/core";
import * as charts from "@amcharts/amcharts4/charts";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", charts.PieChart);
chart.data = [{
	"country": "Lithuania",
	"value": 401
}, {
	"country": "Czech Republic",
	"value": 300
}, {
	"country": "Ireland",
	"value": 200
}, {
	"country": "Germany",
	"value": 165
}, {
	"country": "Australia",
	"value": 139
}, {
	"country": "Austria",
	"value": 128
}];


let series = chart.series.push(new charts.PieSeries());
series.dataFields.value = "value";
series.dataFields.radiusValue = "value";
series.dataFields.category = "country";

// this makes initial animation
series.hiddenState.properties.opacity = 1;
series.hiddenState.properties.endAngle = -90;
series.hiddenState.properties.startAngle = -90;

chart.legend = new charts.Legend();
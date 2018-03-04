import * as amcharts4 from "@amcharts/amcharts4";
import * as pie from "@amcharts/amcharts4/pie";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";


amcharts4.system.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", pie.PieChart);
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

chart.innerRadius = amcharts4.percent(50);

let series = chart.series.push(new pie.PieSeries());
series.dataFields.value = "value";
series.dataFields.category = "country";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;

chart.legend = new pie.Legend();
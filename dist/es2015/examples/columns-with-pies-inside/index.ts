import * as amcharts4 from "@amcharts/amcharts4/core";
import * as charts from "@amcharts/amcharts4/charts";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

var data = [{
	"country": "Lithuania",
	"units": 500,
	"pie": [{
		"value": 250,
		"title": "Cat #1"
	}, {
		"value": 150,
		"title": "Cat #2"
	}, {
		"value": 100,
		"title": "Cat #3"
	}]
}, {
	"country": "Czech Republic",
	"units": 300,
	"pie": [{
		"value": 80,
		"title": "Cat #1"
	}, {
		"value": 130,
		"title": "Cat #2"
	}, {
		"value": 90,
		"title": "Cat #3"
	}]
}, {
	"country": "Ireland",
	"units": 200,
	"pie": [{
		"value": 75,
		"title": "Cat #1"
	}, {
		"value": 55,
		"title": "Cat #2"
	}, {
		"value": 70,
		"title": "Cat #3"
	}]
}];


// Create chart instance
var chart = amcharts4.create("chartdiv", charts.XYChart);

// Add data
chart.data = data;

// Create axes
let categoryAxis = chart.xAxes.push(new charts.CategoryAxis());
categoryAxis.dataFields.category = "country";
categoryAxis.renderer.grid.template.location = 0;

let valueAxis = chart.yAxes.push(new charts.ValueAxis());
valueAxis.title.text = "Units sold (M)";
valueAxis.min = 0;

// Create series
var series = chart.series.push(new charts.ColumnSeries());
series.dataFields.valueY = "units";
series.dataFields.categoryX = "country";
series.tooltip.pointerOrientation = "vertical";


let columnTemplate = series.columns.template;
// add tooltip on column, not template, so that slices could also have tooltip
columnTemplate.column.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
columnTemplate.column.tooltipY = 0;
columnTemplate.column.cornerRadiusTopLeft = 20;
columnTemplate.column.cornerRadiusTopRight = 20;
columnTemplate.strokeOpacity = 0;


// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
columnTemplate.adapter.add("fill", (fill, target) => {
	let gradient = new amcharts4.LinearGradient();
	let color = chart.colors.getIndex(target.dataItem.index * 2);
	gradient.addColor(color, 0);
	gradient.addColor(color, 1);
	gradient.rotation = -90;
	return gradient;
});

// create pie chart as a column child
var pieChart = series.columns.template.createChild(charts.PieChart);
pieChart.width = amcharts4.percent(80);
pieChart.height = amcharts4.percent(80);
pieChart.align = "center";
pieChart.valign = "middle";
pieChart.dataFields.data = "pie";

var pieSeries = pieChart.series.push(new charts.PieSeries());
pieSeries.dataFields.value = "value";
pieSeries.dataFields.category = "title";
pieSeries.labels.template.disabled = true;
pieSeries.ticks.template.disabled = true;
pieSeries.slices.template.stroke = amcharts4.color("#ffffff");
pieSeries.slices.template.strokeWidth = 2;

pieSeries.hiddenState.properties.startAngle = -90;
pieSeries.hiddenState.properties.endAngle = 270;
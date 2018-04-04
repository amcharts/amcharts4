import * as amcharts4 from "@amcharts/amcharts4";
import * as xy from "@amcharts/amcharts4/xy";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", xy.XYChart);

let data = [];

chart.data = [{
	"year": "2014",
	"income": 23.5,
	"expenses": 21.1
}, {
	"year": "2015",
	"income": 26.2,
	"expenses": 30.5
}, {
	"year": "2016",
	"income": 30.1,
	"expenses": 34.9
}, {
	"year": "2017",
	"income": 20.5,
	"expenses": 23.1
}, {
	"year": "2018",
	"income": 30.6,
	"expenses": 28.2
}, {
	"year": "2019",
	"income": 34.1,
	"expenses": 31.9,
	"stroke": "3,3",
	"opacity": 0.5
}];

let categoryAxis = chart.xAxes.push(new xy.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.ticks.template.disabled = true;
categoryAxis.renderer.line.opacity = 0;
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.minGridDistance = 40;
categoryAxis.dataFields.category = "year";


let valueAxis = chart.yAxes.push(new xy.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.renderer.line.opacity = 0;
valueAxis.renderer.ticks.template.disabled = true;
valueAxis.min = 0;

let columnSeries = chart.series.push(new xy.ColumnSeries());
columnSeries.dataFields.categoryX = "year";
columnSeries.dataFields.valueY = "expenses";
columnSeries.tooltipText = "expenses: {valueY.value}";
columnSeries.sequencedInterpolation = true;
columnSeries.defaultState.transitionDuration = 1500;
columnSeries.fill = chart.colors.getIndex(4);

let columnTemplate = <amcharts4.RoundedRectangle>columnSeries.columns.template;
columnTemplate.cornerRadiusTopLeft = 10;
columnTemplate.cornerRadiusTopRight = 10;
columnTemplate.strokeWidth = 1;
columnTemplate.strokeOpacity = 1;
columnTemplate.stroke = columnSeries.fill;

let desaturateFilter = new amcharts4.DesaturateFilter();
desaturateFilter.saturation = 0.5;

columnTemplate.filters.push(desaturateFilter);

// first way - get properties from data. but can only be done with columns, as they are separate objects.	
columnTemplate.propertyFields.strokeDasharray = "stroke";
columnTemplate.propertyFields.fillOpacity = "opacity";

// add some cool saturation effect on hover
let desaturateFilterHover = new amcharts4.DesaturateFilter();
desaturateFilterHover.saturation = 1;

let hoverState = columnTemplate.states.create("hover");
hoverState.transitionDuration = 2000;
hoverState.filters.push(desaturateFilterHover);

let lineSeries = chart.series.push(new xy.LineSeries());
lineSeries.dataFields.categoryX = "year";
lineSeries.dataFields.valueY = "income";
lineSeries.tooltipText = "income: {valueY.value}";
lineSeries.sequencedInterpolation = true;
lineSeries.defaultState.transitionDuration = 1500;
lineSeries.stroke = chart.colors.getIndex(11);
lineSeries.fill = lineSeries.stroke;
lineSeries.strokeWidth = 2;

// second way - add axis range.
let lineSeriesRange = categoryAxis.createSeriesRange(lineSeries);
lineSeriesRange.startCategory = "2018";
lineSeriesRange.endCategory = "2019";
lineSeriesRange.contents.strokeDasharray = "3,3";
lineSeriesRange.locations.category = 0.5;

let dropShadow = new amcharts4.DropShadowFilter();
dropShadow.opacity = 0.25;
lineSeries.filters.push(dropShadow);

let bullet = lineSeries.bullets.create();
bullet.fill = lineSeries.stroke;

let circle = bullet.createChild(amcharts4.Circle);
circle.radius = 4;

chart.cursor = new xy.XYCursor();
chart.cursor.behavior = "none";
chart.cursor.lineX.opacity = 0;
chart.cursor.lineY.opacity = 0;

import * as amcharts4 from "@amcharts/amcharts4/core";
import * as charts from "@amcharts/amcharts4/charts";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

// create chart
let chart = amcharts4.create("chartdiv", charts.GaugeChart);
chart.exporting.menu = new amcharts4.ExportMenu();

chart.startAngle = -90;
chart.endAngle = 270;

let axis = chart.xAxes.push(new charts.ValueAxis<charts.AxisRendererCircular>());
axis.min = 0;
axis.max = 12;
axis.strictMinMax = true;

axis.renderer.line.strokeWidth = 8;
axis.renderer.line.strokeOpacity = 1;
axis.renderer.minLabelPosition = 0.05; // hides 0 label
axis.renderer.inside = true;
axis.renderer.labels.template.radius = 30;
axis.renderer.axisFills.template.disabled = true;
axis.renderer.grid.template.disabled = true;
axis.renderer.ticks.template.length = 12;
axis.renderer.ticks.template.strokeOpacity = 1;

// serves as a clock face fill
let range: charts.ValueAxisDataItem = axis.axisRanges.create();
range.startValue = 0;
range.endValue = 12;
range.grid.visible = false;
range.tick.visible = false;
range.label.visible = false;

let axisFill = range.axisFill;
axisFill.fillOpacity = 1;
axisFill.disabled = false;
axisFill.fill = amcharts4.color("#FFFFFF");

// hands
let hourHand = chart.hands.push(new charts.ClockHand());
hourHand.radius = amcharts4.percent(60);
hourHand.startWidth = 10;
hourHand.endWidth = 10;
hourHand.rotationDirection = "clockWise";
hourHand.pin.radius = 8;
hourHand.zIndex = 0;

let minutesHand = chart.hands.push(new charts.ClockHand());
minutesHand.rotationDirection = "clockWise";
minutesHand.startWidth = 7;
minutesHand.endWidth = 7;
minutesHand.radius = amcharts4.percent(78);
minutesHand.zIndex = 1;

let secondsHand = chart.hands.push(new charts.ClockHand());
secondsHand.fill = amcharts4.color("#DD0000");
secondsHand.stroke = amcharts4.color("#DD0000");
secondsHand.radius = amcharts4.percent(85);
secondsHand.rotationDirection = "clockWise";
secondsHand.zIndex = 2;
secondsHand.startWidth = 1;

updateHands();

setInterval(() => {
	updateHands();
}, 1000)

function updateHands() {
	// get current date
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	// set hours
	hourHand.showValue(hours + minutes / 60, 0);
	// set minutes
	minutesHand.showValue(12 * (minutes + seconds / 60) / 60, 0);
	// set seconds
	secondsHand.showValue(12 * date.getSeconds() / 60, 300);
}

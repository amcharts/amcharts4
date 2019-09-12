import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4plugins_timeline from "@amcharts/amcharts4/plugins/timeline";

// Themes begin
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);
// Themes end

var chart = am4core.create("chartdiv", am4plugins_timeline.SpiralChart);
chart.levelCount = 3;
chart.inversed = true;
chart.endAngle = -135;
chart.curveContainer.padding(40,40,40,40);

chart.data = [
  { category: "" },
  { category: "Chandler", value: 47 },
  { category: "Joey", value: 45 },
  { category: "Monica", value: 204 },
  { category: "Phoebe", value: 62 },
  { category: "Rachel", value: 154 },
  { category: "Ross", value: 120 }];

chart.fontSize = 10;
chart.tooltipContainer.fontSize = 10;

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis<am4plugins_timeline.AxisRendererCurveY>());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.minGridDistance = 6;
categoryAxis.renderer.innerRadius = 0;
categoryAxis.renderer.radius = 80;
categoryAxis.cursorTooltipEnabled = false;


let categoryAxisLabelTemplate = categoryAxis.renderer.labels.template;
categoryAxisLabelTemplate.paddingLeft = 20;
categoryAxisLabelTemplate.horizontalCenter = "left";
categoryAxisLabelTemplate.adapter.add("rotation", (rotation, target) => {
  let position = valueAxis.valueToPosition(valueAxis.min);
  return valueAxis.renderer.positionToAngle(position) + 90;
})


var valueAxis = chart.xAxes.push(new am4charts.ValueAxis<am4plugins_timeline.AxisRendererCurveX>());
valueAxis.renderer.minGridDistance = 70;

valueAxis.renderer.line.strokeDasharray = "1,4";
valueAxis.renderer.line.strokeOpacity = 0.5;
valueAxis.cursorTooltipEnabled = false;
valueAxis.min = 0;

let labelTemplate = valueAxis.renderer.labels.template;
labelTemplate.verticalCenter = "middle";
labelTemplate.fillOpacity = 0.4;

labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
labelTemplate.background.fillOpacity = 1;
labelTemplate.padding(7, 7, 7, 7);

var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
series.dataFields.valueX = "value";
series.dataFields.categoryY = "category";

let columnTemplate = series.columns.template;
series.tooltipText = "{categoryY}: {valueX} kisses";
columnTemplate.adapter.add("fill", (fill, target) => {
  return chart.colors.getIndex(target.dataItem.index * 2);
})
columnTemplate.strokeOpacity = 0;
columnTemplate.fillOpacity = 0.5;

let hoverState = columnTemplate.states.create("hover")
hoverState.properties.fillOpacity = 1;


chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.align = "center"
chart.scrollbarX.width = am4core.percent(70);

let cursor = new am4plugins_timeline.CurveCursor();
chart.cursor = cursor;
cursor.xAxis = valueAxis;
cursor.yAxis = categoryAxis;
cursor.lineY.disabled = true;
cursor.lineX.strokeDasharray = "1,4";
cursor.lineX.strokeOpacity = 1;

let label = chart.plotContainer.createChild(am4core.Label);
label.text = "Biggest kissers in Friends"
label.fontSize = 15;
label.x = am4core.percent(80);
label.y = am4core.percent(80);
label.horizontalCenter = "right";
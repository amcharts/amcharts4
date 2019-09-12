am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4plugins_timeline.SpiralChart);
chart.levelCount = 3;
chart.curveContainer.padding(40,40,40,40);

var data = [];
var visits = 100;
for (var i = 0; i < 30; i++) {
  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 20);
  data.push({ date: new Date(2018, 0, i), value: visits });
}

chart.data = data;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.line.disabled = true;
dateAxis.cursorTooltipEnabled = false;
dateAxis.renderer.minGridDistance = 30;
dateAxis.minZoomCount = 5;

var labelTemplate = dateAxis.renderer.labels.template;
labelTemplate.fontSize = 10;
labelTemplate.verticalCenter = "middle";
labelTemplate.horizontalCenter = "middle";
labelTemplate.padding(3, 3, 3, 3);

labelTemplate.adapter.add("rotation", function (rotation, target) {
  var value = target.dataItem.value;
  var endvalue = target.dataItem.endValue;

  var position = dateAxis.valueToPosition(value + (endvalue - value) / 2);

  var angle = dateAxis.renderer.positionToAngle(position);
  return angle;
})


var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.renderer.innerRadius = -25;
valueAxis.renderer.radius = 25;
valueAxis.renderer.minGridDistance = 15;
valueAxis.renderer.axisLocation = 1;


var valueAxisLabelTemplate = valueAxis.renderer.labels.template;
valueAxisLabelTemplate.rotation = - 90;
valueAxisLabelTemplate.fontSize = 10;
valueAxisLabelTemplate.horizontalCenter = "left";


valueAxisLabelTemplate.adapter.add("rotation", function (rotation, target) {
  return dateAxis.renderer.positionToAngle(1) - 90;
})

chart.seriesContainer.zIndex = -1;

var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "value";
series.tooltipText = "{valueY}";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.background.fillOpacity = 0.7;
series.strokeWidth = 2;

chart.cursor = new am4plugins_timeline.CurveCursor();
chart.cursor.xAxis = dateAxis;
chart.cursor.yAxis = valueAxis;
chart.cursor.lineY.disabled = true;

chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.width = am4core.percent(80);
chart.scrollbarX.align = "center";
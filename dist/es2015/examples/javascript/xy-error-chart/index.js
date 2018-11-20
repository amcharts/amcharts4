import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.XYChart);

chart.data = [{
  "x": 10,
  "y": 14,
  "errorX": 3,
  "errorY": 4
}, {
  "x": 5,
  "y": 3,
  "errorX": 1.52,
  "errorY": 6.8
}, {
  "x": -10,
  "y": 3,
  "errorX": 0.8,
  "errorY": 3.5
}, {
  "x": -6,
  "y": 5,
  "errorX": 1.2,
  "errorY": 4.2
}, {
  "x": 11,
  "y": -4,
  "errorX": 2.4,
  "errorY": 3.9
}, {
  "x": 13,
  "y": 1,
  "errorX": 1.5,
  "errorY": 3.3
}, {
  "x": 1,
  "y": 6,
  "errorX": 2,
  "errorY": 3.3
}];

chart.padding(40, 40, 40, 40);

let valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());

let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());

let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueX = "x";
series.dataFields.valueY = "y";
series.strokeOpacity = 0;

let errorBulletY = series.bullets.create(am4charts.ErrorBullet);
errorBulletY.isDynamic = true;
errorBulletY.strokeWidth = 2;
errorBulletY.tooltipText = "x: {valueX.value} y: {valueY.value} error x:{errorX}, error y:{errorY}";

// adapter adjusts height of a bullet
errorBulletY.adapter.add("pixelHeight", (pixelHeight, target) => {
  let dataItem = target.dataItem;

  if (dataItem) {
    let value = dataItem.valueY;
    let errorTopValue = value + dataItem.dataContext.errorY / 2;
    let errorTopY = valueAxisY.valueToPoint(errorTopValue).y;

    let errorBottomValue = value - dataItem.dataContext.errorY / 2;
    let errorBottomY = valueAxisY.valueToPoint(errorBottomValue).y;

    return Math.abs(errorTopY - errorBottomY);
  }
  return pixelHeight;
})


let errorBulletX = series.bullets.create(am4charts.ErrorBullet);
errorBulletX.tooltipText = "x: {valueX.value} y: {valueY.value} error x:{errorX}, error y:{errorY}";
errorBulletX.isDynamic = true;
errorBulletX.strokeWidth = 2;
errorBulletX.rotation = 90; // need to rotate, as error bullet is vertical

let circle = errorBulletX.createChild(am4core.Circle);
circle.radius = 5;
circle.fill = am4core.color("#ffffff");

// adapter adjusts height of a bullet
errorBulletX.adapter.add("pixelHeight", (pixelHeight, target) => {
  let dataItem = target.dataItem;

  if (dataItem) {
    let value = dataItem.valueY;
    let errorTopValue = value + dataItem.dataContext.errorX / 2;
    let errorTopX = valueAxisX.valueToPoint(errorTopValue).x;

    let errorBottomValue = value - dataItem.dataContext.errorX / 2;
    let errorBottomX = valueAxisX.valueToPoint(errorBottomValue).x;

    return Math.abs(errorTopX - errorBottomX);
  }
  return pixelHeight;
})

chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "zoomXY";

chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarY = new am4core.Scrollbar();
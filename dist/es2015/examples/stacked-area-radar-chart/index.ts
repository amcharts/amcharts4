import * as amcharts4 from "@amcharts/amcharts4";
import * as radar from "@amcharts/amcharts4/radar";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

var chart = amcharts4.create("chartdiv", radar.RadarChart);

chart.data = [
  {
    name: "Openlane",
    value1: 560.2,
    value2: 126.9
  },
  {
    name: "Yearin",
    value1: 170.1,
    value2: 90.5
  },
  {
    name: "Goodsilron",
    value1: 120.7,
    value2: 32.3
  },
  {
    name: "Condax",
    value1: 89.4,
    value2: 124.5
  },
  {
    name: "Opentech",
    value1: 78.5,
    value2: 29.7
  },
  {
    name: "Golddex",
    value1: 77.6,
    value2: 162.2
  },
  {
    name: "Isdom",
    value1: 69.8,
    value2: 22.6
  },
  {
    name: "Plusstrip",
    value1: 63.6,
    value2: 45.3
  },
  {
    name: "Kinnamplus",
    value1: 59.7,
    value2: 12.8
  },
  {
    name: "Zumgoity",
    value1: 54.3,
    value2: 19.6
  },
  {
    name: "Stanredtax",
    value1: 52.9,
    value2: 96.3
  },
  {
    name: "Conecom",
    value1: 42.9,
    value2: 11.9
  },
  {
    name: "Zencorporation",
    value1: 40.9,
    value2: 16.8
  },
  {
    name: "Iselectrics",
    value1: 39.2,
    value2: 9.9
  },
  {
    name: "Treequote",
    value1: 36.6,
    value2: 36.9
  },
  {
    name: "Sumace",
    value1: 34.8,
    value2: 14.6
  },
  {
    name: "Lexiqvolax",
    value1: 32.1,
    value2: 35.6
  },
  {
    name: "Sunnamplex",
    value1: 31.8,
    value2: 5.9
  },
  {
    name: "Faxquote",
    value1: 29.3,
    value2: 14.7
  },
  {
    name: "Donware",
    value1: 23.0,
    value2: 2.8
  },
  {
    name: "Warephase",
    value1: 21.5,
    value2: 12.1
  },
  {
    name: "Donquadtech",
    value1: 19.7,
    value2: 10.8
  },
  {
    name: "Nam-zim",
    value1: 15.5,
    value2: 4.1
  },
  {
    name: "Y-corporation",
    value1: 14.2,
    value2: 11.3
  }
];


chart.padding(10, 10, 10, 10);
chart.innerRadius = amcharts4.percent(50);
//chart.startAngle = - 60;
//chart.endAngle = 300;

var categoryAxis = chart.xAxes.push(new radar.CategoryAxis<radar.AxisRendererCircular>());
categoryAxis.dataFields.category = "name";
categoryAxis.renderer.labels.template.location = 0.5;
categoryAxis.mouseEnabled = false;

var categoryAxisRenderer = categoryAxis.renderer;
categoryAxisRenderer.cellStartLocation = 0;
categoryAxisRenderer.tooltipLocation = 0.5;
categoryAxisRenderer.grid.template.disabled = true;
categoryAxisRenderer.ticks.template.disabled = true;

categoryAxisRenderer.axisFills.template.fill = amcharts4.color("#e8e8e8");
categoryAxisRenderer.axisFills.template.fillOpacity = 0.2;
categoryAxisRenderer.axisFills.template.location = -0.5;
categoryAxisRenderer.line.disabled = true;
categoryAxisRenderer.tooltip.disabled = true;
categoryAxis.renderer.labels.template.disabled = true;

categoryAxis.adapter.add("maxZoomFactor", (maxZoomFactor, target) => {
  return target.dataItems.length / 5;
})

var valueAxis = chart.yAxes.push(new radar.ValueAxis<radar.AxisRendererRadial>());

var valueAxisRenderer = valueAxis.renderer;
valueAxisRenderer.line.disabled = true;
valueAxisRenderer.grid.template.disabled = true;
valueAxisRenderer.ticks.template.disabled = true;
valueAxis.min = 0;
valueAxis.renderer.tooltip.disabled = true;

var series1 = chart.series.push(new radar.RadarSeries());
series1.name = "CASH HELD OUTSIDE THE U.S.";
series1.dataFields.categoryX = "name";
series1.dataFields.valueY = "value1";
series1.stacked = true;
series1.fillOpacity = 0.5;
series1.fill = amcharts4.color("#2d4578");
series1.strokeOpacity = 0;
series1.dataItems.template.locations.categoryX = 0.5;
series1.sequencedInterpolation = true;
series1.sequencedInterpolationDelay = 50;
series1.defaultState.transitionDuration = 1500;

var series2 = chart.series.push(new radar.RadarSeries());
series2.name = "TOTAL CASH PILE";
series2.dataFields.categoryX = "name";
series2.dataFields.valueY = "value2";
series2.stacked = true;
series2.fillOpacity = 0.5;
series2.fill = amcharts4.color("#62b5ce");
series2.stacked = true;
series2.strokeOpacity = 0;
series2.dataItems.template.locations.categoryX = 0.5;
series2.sequencedInterpolation = true;
series2.sequencedInterpolationDelay = 50;
series2.defaultState.transitionDuration = 1500;
series2.tooltipText = "[bold]{categoryX}[/]\nTotal: ${valueY.total} \nOverseas: ${value1}";
series2.tooltip.pointerOrientation = "vertical";

chart.seriesContainer.zIndex = -1;
chart.scrollbarX = new amcharts4.Scrollbar();
chart.scrollbarY = new amcharts4.Scrollbar();

chart.padding(0, 0, 0, 0)

chart.scrollbarY.padding(30, 30, 30, 30);
chart.scrollbarX.padding(30, 30, 30, 30);

chart.scrollbarY.background.padding(30, 30, 30, 30);
chart.scrollbarX.background.padding(30, 30, 30, 30);


chart.cursor = new radar.RadarCursor();
chart.cursor.lineX.strokeOpacity = 0.7;
chart.cursor.lineX.strokeDasharray = undefined;
chart.cursor.lineY.strokeOpacity = 0;
chart.cursor.lineX.stroke = amcharts4.color("#62b5ce");
chart.cursor.innerRadius = amcharts4.percent(30);
chart.cursor.radius = amcharts4.percent(50);
chart.cursor.selection.fill = amcharts4.color("#62b5ce");

let bullet = series2.bullets.create();
bullet.fill = amcharts4.color("#000000");
bullet.strokeOpacity = 0;
bullet.locationX = 0.5;
//bullet.copyToLegendMarker = false;


let line = bullet.createChild(amcharts4.Line);
line.x2 = -100;
line.x1 = 0;
line.y1 = 0;
line.y1 = 0;
line.strokeOpacity = 1;

line.stroke = amcharts4.color("#000000");
line.strokeDasharray = "2,3";
line.strokeOpacity = 0.4;

let label = bullet.createChild(amcharts4.Label);
label.text = "{categoryX}";
label.verticalCenter = "middle";
label.paddingLeft = 20;

valueAxis.calculateTotals = true;
let bulletValueLabel = bullet.createChild(amcharts4.Label);
bulletValueLabel.text = "$ {valueY.total}";
bulletValueLabel.verticalCenter = "middle";
bulletValueLabel.horizontalCenter = "right";
bulletValueLabel.dy = -3;

chart.legend = new radar.Legend();
chart.legend.parent = chart.radarContainer;
chart.legend.width = 110;
chart.legend.horizontalCenter = "middle";
chart.legend.markers.template.width = 22;
chart.legend.markers.template.height = 18;
chart.legend.markers.template.dy = 2;
chart.legend.labels.template.fontSize = "0.7em";
chart.legend.dy = 20;

let title = chart.radarContainer.createChild(amcharts4.Label);
title.text = "COMPANIES WITH\nTHE MOST CASH\nHELD OVERSEAS"
title.fontSize = "1.4em";
title.verticalCenter = "bottom";
title.textAlign = "middle";
title.fontWeigth = "800";

chart.maskBullets = false;

let circle = bullet.createChild(amcharts4.Circle);
circle.radius = 2;
let hoverState = circle.states.create("hover");

hoverState.properties.scale = 5;


bullet.adapter.add("dx", (dx, target) => {
  let angle = categoryAxis.getAngle(target.dataItem, "categoryX", 0.5);
  return 20 * amcharts4.math.cos(angle);
})

bullet.adapter.add("dy", (dy, target) => {
  let angle = categoryAxis.getAngle(target.dataItem, "categoryX", 0.5);
  return 20 * amcharts4.math.sin(angle);
})

bullet.adapter.add("rotation", (dy, target) => {
  let angle = Math.min(chart.endAngle, Math.max(chart.startAngle, categoryAxis.getAngle(target.dataItem, "categoryX", 0.5)));
  return angle;
})


line.adapter.add("x2", (x2, target) => {
  let dataItem: radar.RadarSeriesDataItem = <radar.RadarSeriesDataItem>target.dataItem;
  if (dataItem) {
    let position = valueAxis.valueToPosition(dataItem.values.valueY.value + dataItem.values.valueY.stack);
    return -(position * valueAxis.renderer.axisLength + 40);
  }
  return 0;
})


bulletValueLabel.adapter.add("dx", (dx, target) => {
  let dataItem: radar.RadarSeriesDataItem = <radar.RadarSeriesDataItem>target.dataItem;

  if (dataItem) {
    let position = valueAxis.valueToPosition(dataItem.values.valueY.value + dataItem.values.valueY.stack);
    return -(position * valueAxis.renderer.axisLength + 45);
  }
  return 0;
})


chart.seriesContainer.zIndex = 10;
categoryAxis.zIndex = 11;
valueAxis.zIndex = 12;


let previousBullets: amcharts4.Sprite[] = [];
series2.events.on("tooltipshownat", (event) => {
  let dataItem = event.dataItem;

  for (let i = 0; i < previousBullets.length; i++) {
    previousBullets[i].isHover = false;
  }

  previousBullets = [];

  let itemBullet = dataItem.bullets.getKey(bullet.uid);

  for (let i = 0; i < itemBullet.children.length; i++) {
    let sprite = itemBullet.children.getIndex(i);
    sprite.isHover = true;
    previousBullets.push(sprite);
  }
})

series2.tooltip.events.on("visibilitychanged", () => {
  if (!series2.tooltip.visible) {
    for (let i = 0; i < previousBullets.length; i++) {
      previousBullets[i].isHover = false;
    }
  }
})
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/**
 * Chart design inspired by Nicolas Rapp: https://nicolasrapp.com/studio/
 */

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.RadarChart);

chart.data = [
  {
    company: "Openlane",
    value1: 560.2,
    value2: 126.9
  },
  {
    company: "Yearin",
    value1: 170.1,
    value2: 90.5
  },
  {
    company: "Goodsilron",
    value1: 120.7,
    value2: 32.3
  },
  {
    company: "Condax",
    value1: 89.4,
    value2: 124.5
  },
  {
    company: "Opentech",
    value1: 78.5,
    value2: 29.7
  },
  {
    company: "Golddex",
    value1: 77.6,
    value2: 162.2
  },
  {
    company: "Isdom",
    value1: 69.8,
    value2: 22.6
  },
  {
    company: "Plusstrip",
    value1: 63.6,
    value2: 45.3
  },
  {
    company: "Kinnamplus",
    value1: 59.7,
    value2: 12.8
  },
  {
    company: "Zumgoity",
    value1: 54.3,
    value2: 19.6
  },
  {
    company: "Stanredtax",
    value1: 52.9,
    value2: 96.3
  },
  {
    company: "Conecom",
    value1: 42.9,
    value2: 11.9
  },
  {
    company: "Zencorporation",
    value1: 40.9,
    value2: 16.8
  },
  {
    company: "Iselectrics",
    value1: 39.2,
    value2: 9.9
  },
  {
    company: "Treequote",
    value1: 36.6,
    value2: 36.9
  },
  {
    company: "Sumace",
    value1: 34.8,
    value2: 14.6
  },
  {
    company: "Lexiqvolax",
    value1: 32.1,
    value2: 35.6
  },
  {
    company: "Sunnamplex",
    value1: 31.8,
    value2: 5.9
  },
  {
    company: "Faxquote",
    value1: 29.3,
    value2: 14.7
  },
  {
    company: "Donware",
    value1: 23.0,
    value2: 2.8
  },
  {
    company: "Warephase",
    value1: 21.5,
    value2: 12.1
  },
  {
    company: "Donquadtech",
    value1: 19.7,
    value2: 10.8
  },
  {
    company: "Nam-zim",
    value1: 15.5,
    value2: 4.1
  },
  {
    company: "Y-corporation",
    value1: 14.2,
    value2: 11.3
  }
];


chart.padding(0, 0, 0, 0);
chart.radarContainer.dy = 100;
chart.innerRadius = am4core.percent(50);
chart.radius = am4core.percent(100);
chart.zoomOutButton.padding(20, 20, 20, 20);
chart.zoomOutButton.margin(20, 20, 20, 20);
chart.zoomOutButton.background.cornerRadius(40, 40, 40, 40);
chart.zoomOutButton.valign = "bottom";

let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "company";
categoryAxis.renderer.labels.template.location = 0.5;
categoryAxis.interactionsEnabled = false;

let categoryAxisRenderer = categoryAxis.renderer;
categoryAxisRenderer.cellStartLocation = 0;
categoryAxisRenderer.tooltipLocation = 0.5;

categoryAxisRenderer.axisFills.template.fill = am4core.color("#ffffff");
categoryAxisRenderer.axisFills.template.fillOpacity = 0.2;
categoryAxisRenderer.axisFills.template.location = -0.5;
categoryAxisRenderer.axisFills.template.disabled = false;
categoryAxisRenderer.line.disabled = true;
categoryAxisRenderer.tooltip.disabled = true;
categoryAxisRenderer.grid.template.disabled = true;
categoryAxis.renderer.labels.template.disabled = true;

categoryAxis.adapter.add("maxZoomFactor", (maxZoomFactor, target) => {
  return target.dataItems.length / 5;
})

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

let valueAxisRenderer = valueAxis.renderer;
valueAxisRenderer.grid.template.disabled = true;
valueAxisRenderer.line.disabled = true;
valueAxis.min = 0;
valueAxis.renderer.tooltip.disabled = true;

let series1 = chart.series.push(new am4charts.RadarSeries());
series1.name = "CASH HELD OUTSIDE THE U.S.";
series1.dataFields.categoryX = "company";
series1.dataFields.valueY = "value1";
series1.stacked = true;
series1.fillOpacity = 0.5;
series1.fill = am4core.color("#2d4578");
series1.strokeOpacity = 0;
series1.dataItems.template.locations.categoryX = 0.5;
series1.sequencedInterpolation = true;
series1.sequencedInterpolationDelay = 50;

let series2 = chart.series.push(new am4charts.RadarSeries());
series2.name = "TOTAL CASH PILE";
series2.dataFields.categoryX = "company";
series2.dataFields.valueY = "value2";
series2.stacked = true;
series2.fillOpacity = 0.5;
series2.fill = am4core.color("#62b5ce");
series2.stacked = true;
series2.strokeOpacity = 0;
series2.dataItems.template.locations.categoryX = 0.5;
series2.sequencedInterpolation = true;
series2.sequencedInterpolationDelay = 50;
series2.tooltipText = "[bold]{categoryX}[/]\nTotal: ${valueY.total} \nOverseas: ${value1}";
series2.tooltip.pointerOrientation = "vertical";
series2.tooltip.label.fill = am4core.color("#ffffff");
series2.tooltip.label.fontSize = "0.8em";
series2.tooltip.autoTextColor = false;

chart.seriesContainer.zIndex = -1;
chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.parent = chart.bottomAxesContainer;
chart.scrollbarY = new am4core.Scrollbar();

chart.padding(0, 0, 0, 0)

chart.scrollbarY.padding(20, 0, 20, 0);
chart.scrollbarX.padding(0, 20, 0, 80);

chart.scrollbarY.background.padding(20, 0, 20, 0);
chart.scrollbarX.background.padding(0, 20, 0, 80);


chart.cursor = new am4charts.RadarCursor();
chart.cursor.lineX.strokeOpacity = 1;
chart.cursor.lineY.strokeOpacity = 0;
chart.cursor.lineX.stroke = am4core.color("#62b5ce");
chart.cursor.innerRadius = am4core.percent(30);
chart.cursor.radius = am4core.percent(50);
chart.cursor.selection.fill = am4core.color("#62b5ce");

let bullet = series2.bullets.create();
bullet.fill = am4core.color("#000000");
bullet.strokeOpacity = 0;
bullet.locationX = 0.5;


let line = bullet.createChild(am4core.Line);
line.x2 = -100;
line.x1 = 0;
line.y1 = 0;
line.y1 = 0;
line.strokeOpacity = 1;

line.stroke = am4core.color("#000000");
line.strokeDasharray = "2,3";
line.strokeOpacity = 0.4;


let bulletValueLabel = bullet.createChild(am4core.Label);
bulletValueLabel.text = "{valueY.total.formatNumber('$#.0')}";
bulletValueLabel.verticalCenter = "middle";
bulletValueLabel.horizontalCenter = "right";
bulletValueLabel.dy = -3;

let label = bullet.createChild(am4core.Label);
label.text = "{categoryX}";
label.verticalCenter = "middle";
label.paddingLeft = 20;

valueAxis.calculateTotals = true;


chart.legend = new am4charts.Legend();
chart.legend.parent = chart.radarContainer;
chart.legend.width = 110;
chart.legend.horizontalCenter = "middle";
chart.legend.markers.template.width = 22;
chart.legend.markers.template.height = 18;
chart.legend.markers.template.dy = 2;
chart.legend.labels.template.fontSize = "0.7em";
chart.legend.dy = 20;
chart.legend.dx = -9;

chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
let itemHoverState = chart.legend.itemContainers.template.states.create("hover");
itemHoverState.properties.dx = 5;

let title = chart.radarContainer.createChild(am4core.Label);
title.text = "COMPANIES WITH\nTHE MOST CASH\nHELD OVERSEAS"
title.fontSize = "1.2em";
title.verticalCenter = "bottom";
title.textAlign = "middle";
title.horizontalCenter = "middle";
title.fontWeight = "800";

chart.maskBullets = false;

let circle = bullet.createChild(am4core.Circle);
circle.radius = 2;
let hoverState = circle.states.create("hover");

hoverState.properties.scale = 5;

bullet.events.on("positionchanged", (event) => {
  event.target.children.getIndex(0).invalidate();
  event.target.children.getIndex(1).invalidatePosition();
})


bullet.adapter.add("dx", (dx, target) => {
  let angle = categoryAxis.getAngle(target.dataItem, "categoryX", 0.5);
  return 20 * am4core.math.cos(angle);
})

bullet.adapter.add("dy", (dy, target) => {
  let angle = categoryAxis.getAngle(target.dataItem, "categoryX", 0.5);
  return 20 * am4core.math.sin(angle);
})

bullet.adapter.add("rotation", (dy, target) => {
  let angle = Math.min(chart.endAngle, Math.max(chart.startAngle, categoryAxis.getAngle(target.dataItem, "categoryX", 0.5)));
  return angle;
})


line.adapter.add("x2", (x2, target) => {
  let dataItem = target.dataItem;
  if (dataItem) {
    let position = valueAxis.valueToPosition(dataItem.values.valueY.value + dataItem.values.valueY.stack);
    return -(position * valueAxis.axisFullLength + 35);
  }
  return 0;
})


bulletValueLabel.adapter.add("dx", (dx, target) => {
  let dataItem = target.dataItem;

  if (dataItem) {
    let position = valueAxis.valueToPosition(dataItem.values.valueY.value + dataItem.values.valueY.stack);
    return -(position * valueAxis.axisFullLength + 40);
  }
  return 0;
})


chart.seriesContainer.zIndex = 10;
categoryAxis.zIndex = 11;
valueAxis.zIndex = 12;

chart.radarContainer.zIndex = 20;


let previousBullets = [];
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

chart.events.on("maxsizechanged", () => {
  if (chart.pixelInnerRadius < 200) {
    title.disabled = true;
    chart.legend.verticalCenter = "middle";
    chart.legend.dy = 0;
  }
  else {
    title.disabled = false;
    chart.legend.verticalCenter = "top";
    chart.legend.dy = 20;
  }
})
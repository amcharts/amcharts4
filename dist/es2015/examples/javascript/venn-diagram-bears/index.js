import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_venn from "@amcharts/amcharts4/plugins/venn";

am4core.useTheme(am4themes_animated);

let pattern = new am4core.CirclePattern();
pattern.radius = 20;
pattern.height = 50;
pattern.width = 50;
pattern.fill = am4core.color("#ffffff");
pattern.backgroundFill = am4core.color("#000000");
pattern.backgroundOpacity = 1;

let data = [
  { name: "Polar bear", value: 100, color: am4core.color("#FFFFFF") },
  { name: "Black bear", value: 100, color: am4core.color("#000000") },
  { name: "Panda", value: 30, sets: ["Polar bear", "Black bear"], color: pattern }
];

let chart = am4core.create("chartdiv", am4plugins_venn.VennDiagram);
let series = chart.series.push(new am4plugins_venn.VennSeries())

series.dataFields.category = "name";
series.dataFields.value = "value";
series.dataFields.intersections = "sets";
series.data = data;
series.slices.template.propertyFields.fill = "color";
series.slices.template.stroke = am4core.color("#000000");
series.slices.template.strokeWidth = 2;
series.slices.template.tooltipText = "";

series.labels.template.padding(10,14,10,14);
series.labels.template.fill = am4core.color("#ffffff");

let labelBackground = new am4core.RoundedRectangle();
labelBackground.fillOpacity = 1;
labelBackground.cornerRadius(8,8,8,8);
series.labels.template.background = labelBackground;

labelBackground.fill = am4core.color("#000000");

series.hoverSprite.stroke = am4core.color("#FFFFFF");
series.hoverSprite.strokeDasharray = "10,10";
series.hoverSprite.strokeWidth = 4;

chart.legend = new am4charts.Legend();
chart.legend.marginTop = 40;

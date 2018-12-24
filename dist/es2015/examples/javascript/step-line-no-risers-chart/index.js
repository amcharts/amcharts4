import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);

let chart = am4core.create("chartdiv", am4charts.XYChart);


chart.paddingRight = 20;

let data = [];
let visits = 10;
for (let i = 1; i < 60; i++) {
    visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    data.push({ date: new Date(2018, 0, i), value: visits });
}

chart.data = data;

let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.renderer.minWidth = 35;

let series = chart.series.push(new am4charts.StepLineSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "value";
series.noRisers = true;
series.strokeWidth = 2;
series.fillOpacity = 0.2;
series.stroke = chart.colors.getIndex(14);
series.fill = series.stroke;
series.sequencedInterpolation = true;

series.tooltipText = "{valueY.value}";
chart.cursor = new am4charts.XYCursor();

chart.scrollbarX = new am4core.Scrollbar();
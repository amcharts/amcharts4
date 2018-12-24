import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";


am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);

let chart = am4core.create("chartdiv", am4charts.XYChart);


chart.paddingRight = 20;

let data = [];
let seconds = 148000;
for (let i = 1; i < 366; i++) {
    seconds += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 1000);
    data.push({ date: new Date(2018, 0, i), seconds: seconds });
}

chart.data = data;

let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;

let valueAxis = chart.yAxes.push(new am4charts.DurationAxis());
valueAxis.tooltip.disabled = true;
valueAxis.renderer.minWidth = 35;
valueAxis.baseUnit = "second";

let series = chart.series.push(new am4charts.StepLineSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "seconds";
series.tooltipText = "{valueY.formatDuration()}";
series.fillOpacity = 0.3;

chart.cursor = new am4charts.XYCursor();

let scrollbarX = new am4charts.XYChartScrollbar();
scrollbarX.series.push(series);
chart.scrollbarX = scrollbarX;
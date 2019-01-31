import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.XYChart);

let data = [];
let price = 10;
let quantity = 1000;
for (let i = 0; i < 300; i++) {
    price += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
    quantity += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 1000);
    data.push({ date: new Date(2000, 1, i), price: price, quantity: quantity });
}

chart.data = data;
// the following line makes value axes to be arranged vertically.
chart.bottomAxesContainer.layout = "horizontal";
chart.bottomAxesContainer.reverseOrder = true;

let dateAxis = chart.yAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.ticks.template.length = 8;
dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
dateAxis.renderer.grid.template.disabled = true;
dateAxis.renderer.ticks.template.disabled = false;
dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
dateAxis.renderer.inside = true;
dateAxis.renderer.inversed = true;

// these two lines makes the axis to be initially zoomed-in
// dateAxis.start = 0.7;
// dateAxis.keepSelection = true;

let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.renderer.baseGrid.disabled = true;

// width of axis
valueAxis.width = am4core.percent(65);
// this makes gap between panels
valueAxis.marginRight = 30;

// uncomment these lines to fill plot area of this axis with some color
//valueAxis.renderer.gridContainer.background.fill = am4core.color("#000000");
//valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;


let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.dateY = "date";
series.dataFields.valueX = "price";
series.tooltipText = "{valueX.value}";
series.name = "Series 1";

let valueAxis2 = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis2.tooltip.disabled = true;
// width of axis
valueAxis2.width = am4core.percent(35);
valueAxis2.renderer.baseGrid.disabled = true;


// uncomment these lines to fill plot area of this axis with some color
//valueAxis2.renderer.gridContainer.background.fill = am4core.color("#000000");
//valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;

let series2 = chart.series.push(new am4charts.ColumnSeries());
series2.dataFields.dateY = "date";
series2.dataFields.valueX = "quantity";
series2.xAxis = valueAxis2;
series2.tooltipText = "{valueX.value}";
series2.name = "Series 2";

chart.cursor = new am4charts.XYCursor();
chart.cursor.yAxis = dateAxis;
chart.cursor.behavior = "zoomY";

let scrollbarY = new am4charts.XYChartScrollbar();
scrollbarY.series.push(series);
chart.scrollbarY = scrollbarY;
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


//am4core.useTheme(am4themes_animated);

let container = am4core.create("chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);
container.layout = "vertical";

container.events.on("up", function(event) {
  for (var i = 0; i < charts.length; i++) {
    var chart = charts[i];
    var cursor = chart.cursor;
    cursor.selection.hide(0);
  }
});


let chartCount = 3;
let charts: am4charts.XYChart[] = [];
let cursorShowDisposers: am4core.IDisposer[] = [];

// create chart instances
for (let i = 0; i < chartCount; i++) {
  makeChart();
}

initCursorListeners();

// after the charts are made, add scrollbar to the first one
let firstChart = charts[0];
firstChart.scrollbarX = new am4core.Scrollbar();
firstChart.zoomOutButton.disabled = false;

// enable date axis labels for the last one
let lastChart = charts[charts.length - 1];
let lastDateAxis = lastChart.xAxes.getIndex(0);
lastDateAxis.renderer.labels.template.disabled = false;
lastDateAxis.cursorTooltipEnabled = true;


// generate data (although it would be possible to use one data provider for all of the charts, we would need to use different field name for each value)
function generateData() {
  let data = [];
  let value = 10;
  for (let i = 1; i < 366; i++) {
    value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    data.push({ date: new Date(2018, 0, i), name: "name" + i, value: value });
  }
  return data;
}

// create chart
function makeChart() {
  let chart = container.createChild(am4charts.XYChart);
  charts.push(chart);

  chart.data = generateData();
  chart.zoomOutButton.disabled = true;
  chart.padding(10, 15, 10, 15);

  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.labels.template.disabled = true;
  dateAxis.tooltip.animationDuration = 0;
  dateAxis.cursorTooltipEnabled = false;

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;
  valueAxis.tooltip.disabled = true;
  valueAxis.renderer.minWidth = 60;

  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.dateX = "date";
  series.dataFields.valueY = "value";
  series.interpolationDuration = 0;

  series.tooltipText = "{valueY.value}";

  let cursor = new am4charts.XYCursor();
  cursor.lineY.disabled = true;
  cursor.xAxis = dateAxis;
  chart.cursor = cursor;


  // whenever any of the charts is zoomed, we should zoom all other charts
  dateAxis.events.on("selectionextremeschanged", (event) => {
    syncDateAxes(event.target);
  })
}


function initCursorListeners() {
  cursorShowDisposers = [];
  for (let i = 0; i < charts.length; i++) {
    let chart = charts[i];
    let cursor = chart.cursor;
    cursor.interactionsEnabled = true;

    cursorShowDisposers.push(cursor.events.on("shown", (event) => {
      handleShowCursor(event.target);
    }));
  }
}

let shownCursorChangeDisposer: am4core.IDisposer;
let shownCursorZoomStartedDisposer: am4core.IDisposer;
let shownCursorZoomEndedDisposer: am4core.IDisposer;

function handleShowCursor(shownCursor: am4charts.XYCursor) {
  // disable mouse for all other cursors
  for (let i = 0; i < charts.length; i++) {
    let chart = charts[i];
    let cursor = chart.cursor;
    if (cursor != shownCursor) {
      cursor.interactionsEnabled = false;
    }
    // remove show listener
    cursorShowDisposers[i].dispose();
  }

  // add change disposer to the hovered chart cursor
  shownCursorChangeDisposer = shownCursor.lineX.events.on("positionchanged", (event) => {
    syncCursors(shownCursor);
  });


  shownCursorZoomStartedDisposer = shownCursor.events.on("zoomstarted", (event) => {

    for (let i = 0; i < charts.length; i++) {
      let chart = charts[i];
      let cursor = chart.cursor;
      if (cursor != event.target) {
        let point = { x: event.target.point.x, y: 0 };
        cursor.triggerDown(point);
      }
    }
  });

  shownCursorZoomEndedDisposer = shownCursor.events.on("zoomended", (event) => {
    for (let i = 0; i < charts.length; i++) {
      let chart = charts[i];
      let cursor = chart.cursor;
      if (cursor != event.target) {
        let point = { x: event.target.point.x, y: 0 };
        cursor.triggerUp(point);
      }
    }
  });


  shownCursor.events.once("hidden", (event) => {
    shownCursorChangeDisposer.dispose();
    shownCursorZoomStartedDisposer.dispose();
    shownCursorZoomEndedDisposer.dispose();

    for (let i = 0; i < charts.length; i++) {
      let chart = charts[i];
      let cursor = chart.cursor;
      cursor.hide(0);

      cursorShowDisposers[i].dispose();
    }

    initCursorListeners();
  });
}

function syncCursors(syncWithCursor: am4charts.XYCursor) {
  for (let i = 0; i < charts.length; i++) {
    let chart = charts[i];
    let cursor = chart.cursor;

    let point = { x: syncWithCursor.point.x, y: 0 };

    if (cursor != syncWithCursor) {
      cursor.triggerMove(point);
    }
  }
}


function syncDateAxes(syncWithAxis: am4charts.DateAxis) {
  for (let i = 0; i < charts.length; i++) {
    let chart = charts[i];
    let dateAxis: am4charts.DateAxis = <am4charts.DateAxis>chart.xAxes.getIndex(0);
    if (dateAxis != syncWithAxis) {
      dateAxis.events.disableType("selectionextremeschanged");
      dateAxis.start = syncWithAxis.start;
      dateAxis.end = syncWithAxis.end;
      dateAxis.events.enableType("selectionextremeschanged");
    }
  }
}

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

let data = [{
    "country": "Dummy",
    "disabled": true,
    "litres": 1000,
    "color": am4core.color("#dadada"),
    "opacity": 0.3,
    "strokeDasharray": "4,4"
}, {
    "country": "Lithuania",
    "litres": 501.9
}, {
    "country": "Estonia",
    "litres": 301.9
}, {
    "country": "Ireland",
    "litres": 201.1
}, {
    "country": "Germany",
    "litres": 165.8
}, {
    "country": "Australia",
    "litres": 139.9
}, {
    "country": "Austria",
    "litres": 128.3
}];


// cointainer to hold both charts
let container = am4core.create("chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);
container.layout = "horizontal";

container.events.on("maxsizechanged", () => {
    chart1.zIndex = 0;
    separatorLine.zIndex = 1;
    dragText.zIndex = 2;
    chart2.zIndex = 3;
})

let chart1 = container.createChild(am4charts.PieChart);
chart1.hiddenState.properties.opacity = 0; // this makes initial fade in effect

chart1.data = data;
chart1.radius = am4core.percent(70);
chart1.innerRadius = am4core.percent(40);
chart1.zIndex = 1;

let series1 = chart1.series.push(new am4charts.PieSeries());
series1.dataFields.value = "litres";
series1.dataFields.category = "country";
series1.colors.step = 2;

let sliceTemplate1 = series1.slices.template;
sliceTemplate1.cornerRadius = 5;
sliceTemplate1.draggable = true;
sliceTemplate1.inert = true;
sliceTemplate1.propertyFields.fill = "color";
sliceTemplate1.propertyFields.fillOpacity = "opacity";
sliceTemplate1.propertyFields.stroke = "color";
sliceTemplate1.propertyFields.strokeDasharray = "strokeDasharray";
sliceTemplate1.strokeWidth = 1;
sliceTemplate1.strokeOpacity = 1;

let zIndex = 5;

sliceTemplate1.events.on("down", (event) => {
    event.target.toFront();
    // also put chart to front
    let series = <am4charts.PieSeries>event.target.dataItem.component;
    series.chart.zIndex = zIndex++;
})

series1.labels.template.propertyFields.disabled = "disabled";
series1.ticks.template.propertyFields.disabled = "disabled";

sliceTemplate1.states.getKey("active").properties.shiftRadius = 0;

sliceTemplate1.events.on("dragstop", (event) => {
    handleDragStop(event);
})

// separator line and text
let separatorLine = container.createChild(am4core.Line);
separatorLine.x1 = 0;
separatorLine.y2 = 300;
separatorLine.strokeWidth = 3;
separatorLine.stroke = am4core.color("#dadada");
separatorLine.valign = "middle";
separatorLine.strokeDasharray = "5,5";


let dragText = container.createChild(am4core.Label);
dragText.text = "Drag slices over the line";
dragText.rotation = 90;
dragText.valign = "middle";
dragText.align = "center";
dragText.paddingBottom = 5;

// second chart
let chart2 = container.createChild(am4charts.PieChart);
chart2.hiddenState.properties.opacity = 0; // this makes initial fade in effect

chart2.radius = am4core.percent(70);
chart2.data = data;
chart2.innerRadius = am4core.percent(40);
chart2.zIndex = 1;

let series2 = chart2.series.push(new am4charts.PieSeries());
series2.dataFields.value = "litres";
series2.dataFields.category = "country";
series2.colors.step = 2;

let sliceTemplate2 = series2.slices.template;
sliceTemplate2.copyFrom(sliceTemplate1);

series2.labels.template.propertyFields.disabled = "disabled";
series2.ticks.template.propertyFields.disabled = "disabled";

function handleDragStop(event) {
    let targetSlice = event.target;
    let dataItem1: am4charts.PieSeriesDataItem;
    let dataItem2: am4charts.PieSeriesDataItem;
    let slice1: am4core.Slice;
    let slice2: am4core.Slice;

    if (series1.slices.indexOf(targetSlice) != -1) {
        slice1 = targetSlice;
        slice2 = series2.dataItems.getIndex(targetSlice.dataItem.index).slice;
    }
    else if (series2.slices.indexOf(targetSlice) != -1) {
        slice1 = series1.dataItems.getIndex(targetSlice.dataItem.index).slice;
        slice2 = targetSlice;
    }


    dataItem1 = <am4charts.PieSeriesDataItem>slice1.dataItem;
    dataItem2 = <am4charts.PieSeriesDataItem>slice2.dataItem;

    let series1Center = am4core.utils.spritePointToSvg({ x: 0, y: 0 }, series1.slicesContainer);
    let series2Center = am4core.utils.spritePointToSvg({ x: 0, y: 0 }, series2.slicesContainer);

    let series1CenterConverted = am4core.utils.svgPointToSprite(series1Center, series2.slicesContainer);
    let series2CenterConverted = am4core.utils.svgPointToSprite(series2Center, series1.slicesContainer);

    // tooltipY and tooltipY are in the middle of the slice, so we use them to avoid extra calculations
    let targetSlicePoint = am4core.utils.spritePointToSvg({ x: targetSlice.tooltipX, y: targetSlice.tooltipY }, targetSlice);

    if (targetSlice == slice1) {
        if (targetSlicePoint.x > container.pixelWidth / 2) {
            let value = dataItem1.value;

            dataItem1.hide();

            let animation = slice1.animate([{ property: "x", to: series2CenterConverted.x }, { property: "y", to: series2CenterConverted.y }], 400);
            animation.events.on("animationprogress", (event) => {
                slice1.hideTooltip();
            })

            slice2.x = 0;
            slice2.y = 0;

            dataItem2.show();
        }
        else {
            slice1.animate([{ property: "x", to: 0 }, { property: "y", to: 0 }], 400);
        }
    }
    if (targetSlice == slice2) {
        if (targetSlicePoint.x < container.pixelWidth / 2) {

            let value = dataItem2.value;

            dataItem2.hide();

            let animation = slice2.animate([{ property: "x", to: series1CenterConverted.x }, { property: "y", to: series1CenterConverted.y }], 400);
            animation.events.on("animationprogress", (event) => {
                slice2.hideTooltip();
            })

            slice1.x = 0;
            slice1.y = 0;
            dataItem1.show();
        }
        else {
            slice2.animate([{ property: "x", to: 0 }, { property: "y", to: 0 }], 400);
        }
    }

    toggleDummySlice(series1);
    toggleDummySlice(series2);

    series1.hideTooltip();
    series2.hideTooltip();
}

function toggleDummySlice(series: am4charts.PieSeries) {
    let show: boolean = true;
    for (let i = 1; i < series.dataItems.length; i++) {
        let dataItem = series.dataItems.getIndex(i);
        if (dataItem.slice.visible && !dataItem.slice.isHiding) {
            show = false;
        }
    }

    let dummySlice = series.dataItems.getIndex(0);
    if (show) {
        dummySlice.show();
    }
    else {
        dummySlice.hide();
    }
}

series2.events.on("datavalidated", () => {

    let dummyDataItem = series2.dataItems.getIndex(0);
    dummyDataItem.show(0);
    dummyDataItem.slice.draggable = false;
    dummyDataItem.slice.tooltipText = undefined;

    for (let i = 1; i < series2.dataItems.length; i++) {
        series2.dataItems.getIndex(i).hide(0);
    }
})

series1.events.on("datavalidated", () => {
    let dummyDataItem = series1.dataItems.getIndex(0);
    dummyDataItem.hide(0);
    dummyDataItem.slice.draggable = false;
    dummyDataItem.slice.tooltipText = undefined;
})
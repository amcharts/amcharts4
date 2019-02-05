import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.PieChart);


chart.data = [{
    "country": "Lithuania",
    "value": 401
}, {
    "country": "Estonia",
    "value": 300
}, {
    "country": "Ireland",
    "value": 200
}, {
    "country": "Germany",
    "value": 165
}, {
    "country": "Australia",
    "value": 139
}, {
    "country": "Austria",
    "value": 128
}];

chart.innerRadius = am4core.percent(50);

let series = chart.series.push(new am4charts.PieSeries());
series.dataFields.value = "value";
series.dataFields.category = "country";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;
series.alignLabels = false;
series.labels.template.padding(0,0,0,0);

series.labels.template.bent = true;
series.labels.template.radius = 4;

series.slices.template.states.getKey("hover").properties.scale = 1.1;
series.labels.template.states.create("hover").properties.fill = am4core.color("#fff");

series.slices.template.events.on("over", (event)=>{
    event.target.dataItem.label.isHover = true;
})

series.slices.template.events.on("out", (event)=>{
    event.target.dataItem.label.isHover = false;
})

series.ticks.template.disabled = true;

// this creates initial animation
series.hiddenState.properties.opacity = 1;
series.hiddenState.properties.endAngle = -90;
series.hiddenState.properties.startAngle = -90;

chart.legend = new am4charts.Legend();
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
chart.startAngle = 180;
chart.endAngle = 360;
chart.radius = am4core.percent(70);

let series = chart.series.push(new am4charts.PieSeries());
series.dataFields.value = "value";
series.dataFields.category = "country";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;

let fillModifier = new am4core.RadialGradientModifier();
fillModifier.brightnesses.push(-0.2, -0.2, 0, -0.3);
series.slices.template.fillModifier = fillModifier;

// this creates initial animation
series.hiddenState.properties.opacity = 1;
series.hiddenState.properties.endAngle = -90;
series.hiddenState.properties.startAngle = -90;


chart.legend = new am4charts.Legend();
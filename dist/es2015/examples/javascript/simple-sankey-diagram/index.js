import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.SankeyDiagram);


chart.data = [
    { from: "A", to: "D", value: 10 },
    { from: "B", to: "D", value: 8 },
    { from: "B", to: "E", value: 4 },
    { from: "C", to: "E", value: 3 },
    { from: "D", to: "G", value: 5 },
    { from: "D", to: "I", value: 2 },
    { from: "D", to: "H", value: 3 },
    { from: "E", to: "H", value: 6 },
    { from: "G", to: "J", value: 5 },
    { from: "I", to: "J", value: 1 },
    { from: "H", to: "J", value: 9 }
];

chart.dataFields.fromName = "from";
chart.dataFields.toName = "to";
chart.dataFields.value = "value";

// for right-most label to fit
chart.paddingRight = 30;

// make nodes draggable
let nodeTemplate = chart.nodes.template;
nodeTemplate.draggable = true;
nodeTemplate.inert = true;
nodeTemplate.readerTitle = "Drag to rearrange or click to show&hide";
nodeTemplate.showSystemTooltip = true;
nodeTemplate.width = 30;

let defaultState = nodeTemplate.background.defaultState;
let defaultDropShadow = defaultState.filters.push(new am4core.DropShadowFilter());
defaultDropShadow.opacity = 0;

let hoverState = nodeTemplate.background.states.create("hover");
let hoverDropShadow = hoverState.filters.push(new am4core.DropShadowFilter());
hoverDropShadow.dy = 0;
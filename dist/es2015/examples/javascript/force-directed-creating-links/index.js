import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";


am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);

let chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

let data = []
for(let i = 0; i < 15; i++){
  data.push({name: "Node " + i, value:Math.random() * 50 + 10});
}

chart.data = data;

networkSeries.dataFields.value = "value";
networkSeries.dataFields.name = "name";
networkSeries.dataFields.children = "children";
networkSeries.nodes.template.tooltipText = "{name}:{value}";
networkSeries.nodes.template.fillOpacity = 1;
networkSeries.dataFields.id = "name";
networkSeries.dataFields.linkWith = "linkWith";


networkSeries.nodes.template.label.text = "{name}"
networkSeries.fontSize = 10;

let selectedNode;

networkSeries.nodes.template.events.on("up", (event) => {
  let node = event.target;
  if (!selectedNode) {
    node.outerCircle.disabled = false;
    node.outerCircle.strokeDasharray = "3,3";
    selectedNode = node;
  }
  else if (selectedNode == node) {
    node.outerCircle.disabled = true;
    node.outerCircle.strokeDasharray = "";
    selectedNode = undefined;
  }
  else {
    let node = event.target;

    let link = node.linksWith.getKey(selectedNode.uid);

    if (link) {
      node.unlinkWith(selectedNode);
    }
    else {
      node.linkWith(selectedNode, 0.2);
    }
  }
})
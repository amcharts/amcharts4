am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);

var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

var data = []
for(var i = 0; i < 15; i++){
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

var selectedNode;

networkSeries.nodes.template.events.on("up", function (event) {
  var node = event.target;
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
    var node = event.target;

    var link = node.linksWith.getKey(selectedNode.uid);

    if (link) {
      node.unlinkWith(selectedNode);
    }
    else {
      node.linkWith(selectedNode, 0.2);
    }
  }
})
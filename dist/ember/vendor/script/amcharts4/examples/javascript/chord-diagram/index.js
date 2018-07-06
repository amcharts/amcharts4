am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4charts.ChordDiagram);
chart.data = [
    { from: "A", to: "D", value: 10 },
    { from: "B", to: "D", value: 8 },
    { from: "B", to: "E", value: 4 },
    { from: "B", to: "C", value: 2 },
    { from: "C", to: "E", value: 14 },
    { from: "E", to: "D", value: 8 },
    { from: "C", to: "A", value: 4 },
    { from: "G", to: "A", value: 7 },
    { from: "D", to: "B", value: 1 }
];

chart.dataFields.fromName = "from";
chart.dataFields.toName = "to";
chart.dataFields.value = "value";

// make nodes draggable
var nodeTemplate = chart.nodes.template;
nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
nodeTemplate.showSystemTooltip = true;


// all the code below makes it possible to show/hide nodes when clicked.
// It is not necessary if you don't need this behavior.
nodeTemplate.hiddenState.properties.visible = true;
nodeTemplate.hiddenState.properties.opacity = 1;
nodeTemplate.hiddenState.properties.fill = am4core.color("#dadada");

nodeTemplate.events.on("hit", function (event) {
    var node = event.target;
    if (!node.isHidden && !node.isHiding) {
        node.hide();

        node.outgoingDataItems.each(function (dataItem) {
            dataItem.setWorkingValue("value", 0);
        })

        node.incomingDataItems.each(function (dataItem) {
            dataItem.setWorkingValue("value", 0);
        })

    }
    else {
        node.show();

        node.outgoingDataItems.each(function (dataItem) {
            if (!dataItem.toNode.isHidden) {
                dataItem.setWorkingValue("value", dataItem.getValue("value"));
            }
        })

        node.incomingDataItems.each(function (dataItem) {
            if (!dataItem.fromNode.isHidden) {
                dataItem.setWorkingValue("value", dataItem.value);
            }
        })
    }
})
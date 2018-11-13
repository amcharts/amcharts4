import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.ChordDiagram);


let data = [];
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

function randomLetter(except) {
    let letter = letters[Math.floor(Math.random() * letters.length - 1)];
    if (letter == except) {
        return randomLetter(except);
    }
    else {
        return letter;
    }
}

for (let i = 0; i < letters.length; i++) {
    let fromLetter = letters[i];
    for (let o = 0; o < 3; o++) {
        data.push({ from: fromLetter, to: randomLetter(fromLetter), value: Math.round(Math.random() * 100) });
    }
}

chart.data = data;

chart.dataFields.fromName = "from";
chart.dataFields.toName = "to";
chart.dataFields.value = "value";
chart.nonRibbon = true;
chart.sortBy = "name";
chart.startAngle = 90;
chart.endAngle = 450;

let nodeTemplate = chart.nodes.template;
nodeTemplate.fill = am4core.color("#222222");
nodeTemplate.fillOpacity = 0.4;
nodeTemplate.slice.disabled = true;
nodeTemplate.setStateOnChildren = true;
nodeTemplate.label.disabled = true;

nodeTemplate.readerTitle = "Drag to rearrange";
nodeTemplate.showSystemTooltip = true;

let hoverState = nodeTemplate.states.create("hover");
hoverState.properties.fillOpacity = 1;

let linkTemplate = chart.links.template;
linkTemplate.opacity = 0.1;
linkTemplate.defaultState.properties.opacity = 0.1;
linkTemplate.tooltipText = "";

let linkHoverState = linkTemplate.states.create("hover");
linkHoverState.properties.opacity = 1;

nodeTemplate.events.on("over", (event) => {
    let node = event.target;
    node.outgoingDataItems.each((dataItem) => {
        dataItem.link.isHover = true;
    })
})

nodeTemplate.events.on("out", (event) => {
    let node = event.target;
    node.outgoingDataItems.each((dataItem) => {
        dataItem.link.isHover = false;
    })
})

let circleBullet = nodeTemplate.createChild(am4charts.CircleBullet);
circleBullet.setStateOnChildren = true;
circleBullet.circle.radius = 15;

let circleHoverState = circleBullet.states.create("hover");
circleHoverState.properties.scale = 1.5;

// we create a separate label as node.label ispositioned differently and doesn't fit perfectly for one-letter labels
let label = circleBullet.createChild(am4core.Label);
label.text = "{fromName}";
label.horizontalCenter = "middle";
label.verticalCenter = "middle";

let labelHoverState = label.states.create("hover");
labelHoverState.properties.fill = am4core.color("#ffffff");
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

// Create color set
let cs = new am4core.ColorSet();
cs.step = 2;

// Create generic Container
let chart = am4core.create("chartdiv", am4core.Container);
chart.layout = "absolute";
chart.width = am4core.percent(100);
chart.height = am4core.percent(100);

// Add labels
let label1 = chart.createChild(am4core.Label);
label1.text = "Left-aligned\nmulti-line\ntext";
label1.textAlign = "start";
label1.background.fill = cs.next();
label1.fill = label1.background.fill.alternative;
label1.fontSize = 30;
label1.padding(20, 20, 20, 20);

let label2 = chart.createChild(am4core.Label);
label2.text = "Centered\nmulti-line\ntext";
label2.textAlign = "middle";
label2.background.fill = cs.next();
label2.fill = label2.background.fill.alternative;
label2.fontSize = 30;
label2.padding(20, 20, 20, 20);
label2.align = "center";

let label3 = chart.createChild(am4core.Label);
label3.text = "Right-aligned\nmulti-line\ntext";
label3.textAlign = "end";
label3.background.fill = cs.next();
label3.fill = label3.background.fill.alternative;
label3.fontSize = 30;
label3.padding(20, 20, 20, 20);
label3.align = "right";

// Add shapes
let shape1 = chart.createChild(am4core.Circle);
shape1.radius = 70;
shape1.align = "left";
shape1.valign = "bottom";
shape1.fill = cs.next();

let fillModifier = new am4core.RadialGradientModifier();
fillModifier.brightnesses = [-0.8, 1, -0.8];
fillModifier.offsets = [0, 0.5, 1];
shape1.fillModifier = fillModifier;

let shape2 = chart.createChild(am4core.RoundedRectangle);
shape2.cornerRadius(10, 10, 10, 10);
shape2.width = 150;
shape2.height = 150;
shape2.align = "center";
shape2.valign = "bottom";
shape2.stroke = cs.next();
shape2.strokeWidth = 4;

let pattern = new am4core.LinePattern();
pattern.width = 10;
pattern.height = 10;
pattern.stroke = shape2.stroke.lighten(0.5);
pattern.strokeWidth = 1;
pattern.rotation = 45;
shape2.fill = pattern;

let shape3 = chart.createChild(am4core.Triangle);
shape3.width = 150;
shape3.height = 150;
shape3.direction = "right";
shape3.align = "right";
shape3.valign = "bottom";
shape3.stroke = cs.next();
shape3.strokeWidth = 4;

let gradient = new am4core.LinearGradient();
gradient.addColor(shape3.stroke);
gradient.addColor(am4core.color("blue"));
shape3.fill = gradient;
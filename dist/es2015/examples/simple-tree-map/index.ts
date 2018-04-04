import * as amcharts4 from "@amcharts/amcharts4";
import * as treemap from "@amcharts/amcharts4/treemap";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";


amcharts4.useTheme(AnimatedTheme);

// create chart
let chart = amcharts4.create("chartdiv", treemap.TreeMap);
chart.data = [{
	name: "First",
	children: [
		{
			name: "A1",
			value: 100
		},
		{
			name: "A2",
			value: 60
		},
		{
			name: "A3",
			value: 30
		}
	]
},
{
	name: "Second",
	children: [
		{
			name: "B1",
			value: 135
		},
		{
			name: "B2",
			value: 98
		},
		{
			name: "B3",
			value: 56
		}
	]
},
{
	name: "Third",
	children: [
		{
			name: "C1",
			value: 335
		},
		{
			name: "C2",
			value: 148
		},
		{
			name: "C3",
			value: 126
		},
		{
			name: "C4",
			value: 26
		}
	]
},
{
	name: "Fourth",
	children: [
		{
			name: "D1",
			value: 415
		},
		{
			name: "D2",
			value: 148
		},
		{
			name: "D3",
			value: 89
		},
		{
			name: "D4",
			value: 64
		},
		{
			name: "D5",
			value: 16
		}
	]
},
{
	name: "Fifth",
	children: [
		{
			name: "E1",
			value: 687
		},
		{
			name: "E2",
			value: 148
		}
	]
}];

chart.colors.step = 2;

//chart.homeText = "Home";
//chart.navigationBar.disabled = false;

// define data fields
chart.dataFields.value = "value";
chart.dataFields.name = "name";
chart.dataFields.children = "children";

chart.zoomable = false;

// level 0 series template
let level0SeriesTemplate = chart.seriesTemplates.create("0");
level0SeriesTemplate.strokeWidth = 2;

// level 1 series template
let level1SeriesTemplate = chart.seriesTemplates.create("1");
level1SeriesTemplate.tooltip.animationDuration = 0;
level1SeriesTemplate.fillOpacity = 0;
level1SeriesTemplate.strokeOpacity = 0.3;

let bullet1 = level1SeriesTemplate.bullets.push(new treemap.LabelBullet());
bullet1.locationY = 0.5;
bullet1.locationX = 0.5;
bullet1.label.text = "{name}";

// as we have bullets on 1st level only and we want them to be visible, we set current level to 1 (by default it's 0)
chart.currentLevel = 1;
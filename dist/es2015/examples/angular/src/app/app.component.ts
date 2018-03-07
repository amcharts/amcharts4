import * as AmCharts4 from "@amcharts/amcharts4";
import * as XY from "@amcharts/amcharts4/xy";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  ngAfterViewInit() {
	AmCharts4.useTheme(AnimatedTheme);

	let chart = AmCharts4.create("chartdiv", XY.XYChart);

	let data = [];
	let visits = 10;
	for (let i = 0; i < 1000; i++) {
		visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
		data.push({ date: new Date(2000, 1, i), name: "name" + i, value: visits });
	}

	chart.data = data;
	chart.legend.disabled = true;

	let categoryAxis = chart.xAxes.push(new XY.DateAxis());
	categoryAxis.renderer.grid.template.location = 0;

	let valueAxis = chart.yAxes.push(new XY.ValueAxis());
	valueAxis.tooltip.disabled = true;

	let series = chart.series.push(new XY.LineSeries());
	series.dataFields.dateX = "date";
	series.dataFields.valueY = "value";

	series.tooltipText = "{valueY.value}";
	chart.cursor = new XY.XYCursor();
	chart.scrollbarX = new AmCharts4.Scrollbar();
  }
}

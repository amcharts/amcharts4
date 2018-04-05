@amcharts/amcharts4-ember
==============================================================================

Ember add-on for AmCharts V4

Installation
------------------------------------------------------------------------------

```
ember install @amcharts/amcharts4-ember
```


Usage
------------------------------------------------------------------------------

Add the `amcharts4.files` array to your `EmberApp`:

```js
let app = new EmberApp(defaults, {
  amcharts4: {
    files: [

    ]
  }
});
```

Then inside of the `files` you should include the various files that you will be using (if you forget to include a file, you will get a runtime error telling you exactly which file you need to add):

```js
let app = new EmberApp(defaults, {
  amcharts4: {
    files: [
      "xy",
      "themes/animated"
    ]
  }
});
```

Make sure that your template contains a `<div>` element for the chart:

```js
<div id="chartdiv" style="width: 100%; height: 500px;"></div>
```

Lastly, import and use V4 like normal (make sure to use the `didInsertElement` and `willDestroyElement` methods):

```js
import Component from "@ember/component";
import * as amcharts4 from "@amcharts/amcharts4";
import * as xy from "@amcharts/amcharts4/xy";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

export default Component.extend({
  init() {
    this._super(...arguments);
    this.chart = null;
  },

  didInsertElement() {
    this._super(...arguments);

    let chart = amcharts4.create("chartdiv", xy.XYChart);
    chart.paddingRight = 20;

    let data = [];
    let visits = 10;
    for (let i = 1; i < 366; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
    }

    chart.data = data;

    let dateAxis = chart.xAxes.push(new xy.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new xy.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new xy.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
    chart.cursor = new xy.XYCursor();

    let scrollbarX = new xy.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;
  },

  willDestroyElement() {
    if (this.chart) {
      this.chart.dispose();
    }
    this._super(...arguments);
  }
});
```

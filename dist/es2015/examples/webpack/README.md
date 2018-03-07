Using Webpack
=============

amCharts V4 has excellent support for Webpack. This tutorial will show you every step you need to use Webpack with amCharts V4.

First, create a `package.json` file, like this:

```json
{
    "name": "my-custom-project",
    "version": "0.1.0",
    "devDependencies": {
        "@amcharts/amcharts4": "^4.0.0",
        "webpack": "^3.11.0"
    },
    "scripts": {
        "build": "webpack"
    }
}
```

If you are on Windows, you must [follow these instructions](https://github.com/Automattic/node-canvas/wiki/Installation---Windows#install-manually).

Then run `npm install`

Now create an `index.js` file which uses amCharts V4:

```js
import * as amcharts4 from "@amcharts/amcharts4";
import * as xy from "@amcharts/amcharts4/xy";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

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
```

Then create a `webpack.config.js` file, like this:

```js
var $path = require("path");

module.exports = {
    entry: {
        index: "./index.js"
    },

    output: {
        path: $path.join(__dirname, "dist"),
        filename: "[name].js",
        chunkFilename: "[name].js"
    }
}
```

Lastly you can use `npm run build` to build your project! The code will be inside the `dist` folder.

You can now use `<script src="dist/index.js"></script>` in an HTML page to display the chart. You will also need to create a `<div id="chartdiv"></div>` HTML element, like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      #chartdiv {
        width: 100%;
        height: 400px;
      }
    </style>
  </head>
  <body>
    <div id="chartdiv"></div>
    <script src="dist/index.js"></script>
  </body>
</html>
```

You can customize the `index.js`, `webpack.config.js`, and `package.json` files as you wish, but this is a good starting point.

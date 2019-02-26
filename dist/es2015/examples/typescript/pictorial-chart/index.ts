import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

let iconPath = "M256.814,72.75c0-26.898-10.451-52.213-29.43-71.277C226.444,0.529,225.17,0,223.84,0H87.712c-1.329,0-2.604,0.529-3.543,1.473c-18.978,19.064-29.43,44.379-29.43,71.277c0,50.615,37.414,92.654,86.037,99.922v108.88h-21.25c-8.271,0-15,6.729-15,15c0,8.271,6.729,15,15,15h72.5c8.271,0,15-6.729,15-15c0-8.271-6.729-15-15-15h-21.25v-108.88C219.399,165.404,256.814,123.365,256.814,72.75z M106.709,120.879c-1.234,1.083-2.765,1.615-4.285,1.615c-1.807,0-3.604-0.748-4.888-2.212c-13.153-14.986-18.888-34.832-15.733-54.451c0.571-3.543,3.902-5.956,7.45-5.385c3.544,0.57,5.955,3.905,5.386,7.45c-2.538,15.779,2.079,31.747,12.667,43.811C109.674,114.404,109.406,118.511,106.709,120.879z M144.351,136.662c-0.514,3.194-3.274,5.468-6.409,5.468c-0.343,0-0.69-0.027-1.041-0.083c-6.937-1.117-13.6-3.299-19.804-6.488c-3.193-1.641-4.451-5.559-2.811-8.752c1.641-3.194,5.563-4.451,8.752-2.81c4.985,2.562,10.345,4.317,15.929,5.215C142.511,129.782,144.922,133.118,144.351,136.662z";

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.SlicedChart);

chart.data = [{
  "name": "Pinot Noir",
  "value": 354,
  "color": am4core.color("#461b1b")
}, {
  "name": "Primitivo",
  "value": 245,
  "color": am4core.color("#5f2222")
}];

let series = chart.series.push(new am4charts.PictorialStackedSeries());
series.dataFields.value = "value";
series.dataFields.category = "name";
series.startLocation = 0.3
series.endLocation = 0.85

series.slicesContainer.background.fill = am4core.color("#676767")
series.slicesContainer.background.fillOpacity = 0.2;

series.maskSprite.path = iconPath;

series.labelsContainer.width = am4core.percent(100);
series.alignLabels = true;
series.slices.template.propertyFields.fill = "color";
series.slices.template.propertyFields.stroke = "color";

let gradientModifier = new am4core.LinearGradientModifier();
gradientModifier.lightnesses = [0.2, -0.7];
series.slices.template.fillModifier = gradientModifier;
series.slices.template.strokeModifier = gradientModifier;

// this makes the fills to start and end at certain location instead of taking whole picture
series.endLocation = 0.553;
series.startLocation = 0.12;
// this makes initial fill animation
series.hiddenState.properties.startLocation = 0.553;

series.ticks.template.locationX = 0.7;
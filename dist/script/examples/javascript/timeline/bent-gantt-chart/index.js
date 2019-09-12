// Themes begin
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);
// Themes end

var container = am4core.create("chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);
container.tooltipContainer.fontSize = 10;
container.fontSize = 10;

var interfaceColors = new am4core.InterfaceColorSet();
var colorSet = new am4core.ColorSet();

var chart = container.createChild(am4plugins_timeline.CurveChart);

chart.data = [{
  "start": "2019-11-10 08:00",
  "end": "2019-11-10 17:00",
  "task": "Official workday"
}, {
  "start": "2019-11-10 06:00",
  "end": "2019-11-10 11:00",
  "task": "Gathering requirements",
  "bulletf1":false
}, {
  "start": "2019-11-10 11:30",
  "end": "2019-11-10 16:30",
  "task": "Development"
},{
  "start": "2019-11-10 16:00",
  "end": "2019-11-10 18:00",
  "task": "Producing specifications"
}, {
  "start": "2019-11-10 13:00",
  "end": "2019-11-11 01:00",
  "task": "Testing",
  "bulletf2":false 
},{
  "task": ""
} ].reverse();

chart.dateFormatter.dateFormat = "yyyy-MM-dd hh:mm";
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd hh:mm";
chart.dy = 90;
chart.maskBullets = false;

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "task";
categoryAxis.renderer.labels.template.paddingRight = 25;
categoryAxis.renderer.minGridDistance = 10;
categoryAxis.renderer.innerRadius = 0;
categoryAxis.renderer.radius = 100;
categoryAxis.renderer.grid.template.location = 1;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 70;
dateAxis.min = new Date("2019-11-10 05:00").getTime();
dateAxis.max = new Date("2019-11-11 02:00").getTime();

dateAxis.baseInterval = { count: 1, timeUnit: "minute" };
dateAxis.startLocation = -0.5;

dateAxis.renderer.points = [{ x: -400, y: 0 }, { x: -250, y: 0 }, { x: 0, y: 60 }, { x: 250, y: 0 }, { x: 400, y: 0 }];
dateAxis.renderer.autoScale = false;
dateAxis.renderer.polyspline.tensionX = 0.8;
dateAxis.renderer.tooltipLocation = 0;
dateAxis.renderer.grid.template.disabled = true;
dateAxis.renderer.line.strokeDasharray = "1,4";
dateAxis.renderer.line.strokeOpacity = 0.5;
dateAxis.tooltip.background.fillOpacity = 0.2;
dateAxis.tooltip.background.cornerRadius = 5;
dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
dateAxis.tooltip.label.paddingTop = 7;

var labelTemplate = dateAxis.renderer.labels.template;
labelTemplate.verticalCenter = "middle";
labelTemplate.fillOpacity = 0.4;
labelTemplate.background.fill = interfaceColors.getFor("background");
labelTemplate.background.fillOpacity = 1;
labelTemplate.padding(7,7,7,7);

var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
series.columns.template.height = am4core.percent(10);
series.columns.template.tooltipText = "{categoryX}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

series.dataFields.openDateX = "start";
series.dataFields.dateX = "end";
series.dataFields.categoryY = "task";
series.columns.template.propertyFields.fill = "color"; // get color from data
series.columns.template.propertyFields.stroke = "color";
series.columns.template.strokeOpacity = 0;

series.columns.template.adapter.add("fill", function (fill, target) {
   return chart.colors.getIndex(target.dataItem.index * 3);
})

var flagBullet1 = new am4plugins_bullets.FlagBullet();
series.bullets.push(flagBullet1);
flagBullet1.disabled = true;
flagBullet1.propertyFields.disabled = "bulletf1";
flagBullet1.locationX = 1;
flagBullet1.label.text = "start";

var flagBullet2 = new am4plugins_bullets.FlagBullet();
series.bullets.push(flagBullet2);
flagBullet2.disabled = true;
flagBullet2.propertyFields.disabled = "bulletf2";
flagBullet2.locationX = 0;
flagBullet2.background.fill = interfaceColors.getFor("background");
flagBullet2.label.text = "end";

var bullet = new am4charts.CircleBullet();
series.bullets.push(bullet);
bullet.circle.radius = 3;
bullet.circle.strokeOpacity = 0;
bullet.locationX = 0;

bullet.adapter.add("fill", function (fill, target) {
   return chart.colors.getIndex(target.dataItem.index * 3);
})

var bullet2 = new am4charts.CircleBullet();
series.bullets.push(bullet2);
bullet2.circle.radius = 3;
bullet2.circle.strokeOpacity = 0;
bullet2.propertyFields.fill = "color";
bullet2.locationX = 1;

bullet2.adapter.add("fill", function (fill, target) {
   return chart.colors.getIndex(target.dataItem.index * 3);
})

chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.align = "center"
chart.scrollbarX.width = 800;
chart.scrollbarX.parent = chart.bottomAxesContainer;
chart.scrollbarX.dy = - 90;
chart.scrollbarX.opacity = 0.4;

var cursor = new am4plugins_timeline.CurveCursor();
chart.cursor = cursor;
cursor.xAxis = dateAxis;
cursor.yAxis = categoryAxis;
cursor.lineY.disabled = true;
cursor.lineX.strokeDasharray = "1,4";
cursor.lineX.strokeOpacity = 1;

dateAxis.renderer.tooltipLocation2 = 0;
categoryAxis.cursorTooltipEnabled = false;


/// clock
var clock = container.createChild(am4charts.GaugeChart);
clock.toBack();

clock.radius = 120;
clock.dy = -100;
clock.startAngle = -90;
clock.endAngle = 270;

var axis = clock.xAxes.push(new am4charts.ValueAxis());
axis.min = 0;
axis.max = 12;
axis.strictMinMax = true;

axis.renderer.line.strokeWidth = 1;
axis.renderer.line.strokeOpacity = 0.5;
axis.renderer.line.strokeDasharray = "1,4";
axis.renderer.minLabelPosition = 0.05; // hides 0 label
axis.renderer.inside = true;
axis.renderer.labels.template.radius = 30;
axis.renderer.grid.template.disabled = true;
axis.renderer.ticks.template.length = 12;
axis.renderer.ticks.template.strokeOpacity = 1;

// serves as a clock face fill
var range = axis.axisRanges.create();
range.value = 0;
range.endValue = 12;
range.grid.visible = false;
range.tick.visible = false;
range.label.visible = false;

var axisFill = range.axisFill;

// hands
var hourHand = clock.hands.push(new am4charts.ClockHand());
hourHand.radius = am4core.percent(60);
hourHand.startWidth = 5;
hourHand.endWidth = 5;
hourHand.rotationDirection = "clockWise";
hourHand.pin.radius = 8;
hourHand.zIndex = 1;

var minutesHand = clock.hands.push(new am4charts.ClockHand());
minutesHand.rotationDirection = "clockWise";
minutesHand.startWidth = 3;
minutesHand.endWidth = 3;
minutesHand.radius = am4core.percent(78);
minutesHand.zIndex = 2;

chart.cursor.events.on("cursorpositionchanged", function (event) {
   var value = dateAxis.positionToValue(event.target.xPosition)
   var date = new Date(value);
   var hours = date.getHours();
   var minutes = date.getMinutes();
   // set hours
   hourHand.showValue(hours + minutes / 60, 0);
   // set minutes
   minutesHand.showValue(12 * minutes/ 60, 0);       
})
/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */
// Themes begin
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);
// Themes end

var chart = am4core.create("chartdiv", am4plugins_timeline.SerpentineChart);
chart.curveContainer.padding(100, 20, 50, 20);
chart.levelCount = 3;
chart.yAxisRadius = am4core.percent(20);
chart.yAxisInnerRadius = am4core.percent(2);
chart.maskBullets = false;

var colorSet = new am4core.ColorSet();

chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
chart.dateFormatter.dateFormat = "HH";

chart.data = [{
    "category": "",
    "start": "2019-01-10 06:00",
    "end": "2019-01-10 07:00",
    "color": colorSet.getIndex(15),
    "text": "I will have\na healthy day today!",
    "textDisabled": false,
    "icon": "timeline0.svg"
}, {
    "category": "",
    "start": "2019-01-10 07:00",
    "end": "2019-01-10 08:00",
    "color": colorSet.getIndex(14),
    "icon": "timeline1.svg"
},
{
    "category": "",
    "start": "2019-01-10 08:00",
    "end": "2019-01-10 09:00",
    "color": colorSet.getIndex(13),
    "icon": "timeline2.svg"
},
{
    "category": "",
    "start": "2019-01-10 09:00",
    "end": "2019-01-10 10:00",
    "color": colorSet.getIndex(12),
    "icon": "timeline2.svg"
},
{
    "category": "",
    "start": "2019-01-10 10:00",
    "end": "2019-01-10 12:00",
    "color": colorSet.getIndex(11),
    "icon": "timeline2.svg"
},
{
    "category": "",
    "start": "2019-01-10 12:00",
    "end": "2019-01-10 13:00",
    "color": colorSet.getIndex(10),
    "icon": "timeline1.svg"
},
{
    "category": "",
    "start": "2019-01-10 13:00",
    "end": "2019-01-10 14:00",
    "color": colorSet.getIndex(9),
    "text": "One beer doesn't count.",
    "textDisabled": false,
    "icon": "timeline3.svg"
},
{
    "category": "",
    "start": "2019-01-10 14:00",
    "end": "2019-01-10 16:00",
    "color": colorSet.getIndex(8),
    "icon": "timeline2.svg"
},
{
    "category": "",
    "start": "2019-01-10 16:00",
    "end": "2019-01-10 17:00",
    "color": colorSet.getIndex(7),
    "icon": "timeline4.svg"
},
{
    "category": "",
    "start": "2019-01-10 17:00",
    "end": "2019-01-10 20:00",
    "color": colorSet.getIndex(6),
    "icon": "timeline2.svg"
},
{
    "category": "",
    "start": "2019-01-10 20:00",
    "end": "2019-01-10 20:30",
    "color": colorSet.getIndex(5),
    "icon": "timeline3.svg"
},
{
    "category": "",
    "start": "2019-01-10 20:30",
    "end": "2019-01-10 21:30",
    "color": colorSet.getIndex(4),
    "icon": "timeline3.svg"
},
{
    "category": "",
    "start": "2019-01-10 21:30",
    "end": "2019-01-10 22:00",
    "color": colorSet.getIndex(3),
    "icon": "dance.svg"
},
{
    "category": "",
    "start": "2019-01-10 22:00",
    "end": "2019-01-10 23:00",
    "color": colorSet.getIndex(2),
    "icon": "timeline5.svg"
},
{
    "category": "",
    "start": "2019-01-10 23:00",
    "end": "2019-01-11 00:00",
    "color": colorSet.getIndex(1),
    "icon": "timeline6.svg"
},
{
    "category": "",
    "start": "2019-01-11 00:00",
    "end": "2019-01-11 01:00",
    "color": colorSet.getIndex(0),
    "text": "Damn...",
    "textDisabled": false,
    "icon": "timeline7.svg"
}];

chart.fontSize = 10;
chart.tooltipContainer.fontSize = 10;

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.labels.template.paddingRight = 25;
categoryAxis.renderer.minGridDistance = 10;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 70;
dateAxis.baseInterval = { count: 30, timeUnit: "minute" };
dateAxis.renderer.tooltipLocation = 0;
dateAxis.renderer.line.strokeDasharray = "1,4";
dateAxis.renderer.line.strokeOpacity = 0.5;
dateAxis.tooltip.background.fillOpacity = 0.2;
dateAxis.tooltip.background.cornerRadius = 5;
dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
dateAxis.tooltip.label.paddingTop = 7;
dateAxis.endLocation = 0;
dateAxis.startLocation = -0.5;

var labelTemplate = dateAxis.renderer.labels.template;
labelTemplate.verticalCenter = "middle";
labelTemplate.fillOpacity = 0.4;
labelTemplate.background.fill = am4core.color("#000");
labelTemplate.background.fillOpacity = 1;
labelTemplate.padding(7, 7, 7, 7);

var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
series.columns.template.height = am4core.percent(10);

series.dataFields.openDateX = "start";
series.dataFields.dateX = "end";
series.dataFields.categoryY = "category";
series.baseAxis = categoryAxis;
series.columns.template.propertyFields.fill = "color"; // get color from data
series.columns.template.propertyFields.stroke = "color";
series.columns.template.strokeOpacity = 0;
series.columns.template.fillOpacity = 0.6;

var imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
imageBullet1.locationX = 1;
imageBullet1.propertyFields.stroke = "color";
imageBullet1.background.propertyFields.fill = "color";
imageBullet1.image = new am4core.Image();
imageBullet1.image.propertyFields.href = "icon";
imageBullet1.image.scale = 0.5;
imageBullet1.circle.radius = am4core.percent(100);
imageBullet1.dy = -5;


var textBullet = series.bullets.push(new am4charts.LabelBullet());
textBullet.label.propertyFields.text = "text";
textBullet.disabled = true;
textBullet.propertyFields.disabled = "textDisabled";
textBullet.label.strokeOpacity = 0;
textBullet.locationX = 1;
textBullet.dy = - 100;
textBullet.label.textAlign = "middle";

chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.align = "center"
chart.scrollbarX.width = am4core.percent(75);
chart.scrollbarX.opacity = 0.5;

var cursor = new am4plugins_timeline.CurveCursor();
chart.cursor = cursor;
cursor.xAxis = dateAxis;
cursor.yAxis = categoryAxis;
cursor.lineY.disabled = true;
cursor.lineX.strokeDasharray = "1,4";
cursor.lineX.strokeOpacity = 1;

dateAxis.renderer.tooltipLocation2 = 0;
categoryAxis.cursorTooltipEnabled = false;


var label = chart.createChild(am4core.Label);
label.text = "Another unlucky day in the office."
label.isMeasured = false;
label.y = am4core.percent(35);
label.x = am4core.percent(50);
label.horizontalCenter = "middle";
label.fontSize = 20;
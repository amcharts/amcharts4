import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";



am4core.useTheme(am4themes_animated)

var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.padding(40, 40, 40, 40);

chart.numberFormatter.bigNumberPrefixes = [
  { "number": 1e+3, "suffix": "K" },
  { "number": 1e+6, "suffix": "M" },
  { "number": 1e+9, "suffix": "B" }
];

var label = chart.plotContainer.createChild(am4core.Label);
label.x = am4core.percent(97);
label.y = am4core.percent(95);
label.horizontalCenter = "right";
label.verticalCenter = "middle";
label.dx = -15;
label.fontSize = 50;

var playButton = chart.plotContainer.createChild(am4core.PlayButton);
playButton.x = am4core.percent(97);
playButton.y = am4core.percent(95);
playButton.verticalCenter = "middle";
playButton.events.on("toggled", function(event) {
  if (event.target.isActive) {
    play();
  }
  else {
    stop();
  }
})

var stepDuration = 4000;

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "network";
categoryAxis.renderer.minGridDistance = 1;
categoryAxis.renderer.inversed = true;
categoryAxis.renderer.grid.template.disabled = true;

var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;
valueAxis.rangeChangeEasing = am4core.ease.linear;
valueAxis.rangeChangeDuration = stepDuration;
valueAxis.extraMax = 0.1;

var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.categoryY = "network";
series.dataFields.valueX = "MAU";
series.tooltipText = "{valueX.value}"
series.columns.template.strokeOpacity = 0;
series.columns.template.column.cornerRadiusBottomRight = 5;
series.columns.template.column.cornerRadiusTopRight = 5;
series.interpolationDuration = stepDuration;
series.interpolationEasing = am4core.ease.linear;

var labelBullet = series.bullets.push(new am4charts.LabelBullet())
labelBullet.label.horizontalCenter = "right";
labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
labelBullet.label.textAlign = "end";
labelBullet.label.dx = -10;

chart.zoomOutButton.disabled = true;

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series.columns.template.adapter.add("fill", function(fill, target){
  return chart.colors.getIndex(target.dataItem.index);
});

var year = 2003;
label.text = year.toString();

var interval;

function play() {
  interval = setInterval(function(){
    nextYear();
  }, stepDuration)
  nextYear();
}

function stop() {
  if (interval) {
    clearInterval(interval);
  }
}

function nextYear() {
  year++

  if (year > 2018) {
    year = 2003;
  }

  var newData = allData[year];
  var itemsWithNonZero = 0;
  for (var i = 0; i < chart.data.length; i++) {
    chart.data[i].MAU = newData[i].MAU;
    if (chart.data[i].MAU > 0) {
      itemsWithNonZero++;
    }
  }

  if (year == 2003) {
    series.interpolationDuration = stepDuration / 4;
    valueAxis.rangeChangeDuration = stepDuration / 4;
  }
  else {
    series.interpolationDuration = stepDuration;
    valueAxis.rangeChangeDuration = stepDuration;
  }

  chart.invalidateRawData();
  label.text = year.toString();

  categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });
}


categoryAxis.sortBySeries = series;

var allData = {
  "2003": [
    {
      "network": "Facebook",
      "MAU": 0
    },
    {
      "network": "Flickr",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },

    {
      "network": "Friendster",
      "MAU": 4470000
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 0
    },
    {
      "network": "Orkut",
      "MAU": 0
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 0
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 0
    },
    {
      "network": "WeChat",
      "MAU": 0
    },
    {
      "network": "Weibo",
      "MAU": 0
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 0
    }
  ],
  "2004": [
    {
      "network": "Facebook",
      "MAU": 0
    },
    {
      "network": "Flickr",
      "MAU": 3675135
    },
    {
      "network": "Friendster",
      "MAU": 5970054
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 980036
    },
    {
      "network": "Orkut",
      "MAU": 4900180
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 0
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 0
    },
    {
      "network": "WeChat",
      "MAU": 0
    },
    {
      "network": "Weibo",
      "MAU": 0
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 0
    }
  ],
  "2005": [
    {
      "network": "Facebook",
      "MAU": 0
    },
    {
      "network": "Flickr",
      "MAU": 7399354
    },
    {
      "network": "Friendster",
      "MAU": 7459742
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 9731610
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 19490059
    },
    {
      "network": "Orkut",
      "MAU": 9865805
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 0
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 0
    },
    {
      "network": "WeChat",
      "MAU": 0
    },
    {
      "network": "Weibo",
      "MAU": 0
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 1946322
    }
  ],
  "2006": [
    {
      "network": "Facebook",
      "MAU": 0
    },
    {
      "network": "Flickr",
      "MAU": 14949270
    },
    {
      "network": "Friendster",
      "MAU": 8989854
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 19932360
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 54763260
    },
    {
      "network": "Orkut",
      "MAU": 14966180
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 248309
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 0
    },
    {
      "network": "WeChat",
      "MAU": 0
    },
    {
      "network": "Weibo",
      "MAU": 0
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 19878248
    }
  ],
  "2007": [
    {
      "network": "Facebook",
      "MAU": 0
    },
    {
      "network": "Flickr",
      "MAU": 29299875
    },
    {
      "network": "Friendster",
      "MAU": 24253200
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 29533250
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 69299875
    },
    {
      "network": "Orkut",
      "MAU": 26916562
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 488331
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 0
    },
    {
      "network": "WeChat",
      "MAU": 0
    },
    {
      "network": "Weibo",
      "MAU": 0
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 143932250
    }
  ],
  "2008": [
    {
      "network": "Facebook",
      "MAU": 100000000
    },
    {
      "network": "Flickr",
      "MAU": 30000000
    },
    {
      "network": "Friendster",
      "MAU": 51008911
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 55045618
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 72408233
    },
    {
      "network": "Orkut",
      "MAU": 44357628
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 1944940
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 0
    },
    {
      "network": "WeChat",
      "MAU": 0
    },
    {
      "network": "Weibo",
      "MAU": 0
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 294493950
    }
  ],
  "2009": [
    {
      "network": "Facebook",
      "MAU": 276000000
    },
    {
      "network": "Flickr",
      "MAU": 41834525
    },
    {
      "network": "Friendster",
      "MAU": 28804331
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 57893524
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 70133095
    },
    {
      "network": "Orkut",
      "MAU": 47366905
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 3893524
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 0
    },
    {
      "network": "WeChat",
      "MAU": 0
    },
    {
      "network": "Weibo",
      "MAU": 0
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 413611440
    }
  ],
  "2010": [
    {
      "network": "Facebook",
      "MAU": 517750000
    },
    {
      "network": "Flickr",
      "MAU": 54708063
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 166029650
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 59953290
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 68046710
    },
    {
      "network": "Orkut",
      "MAU": 49941613
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 0
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 43250000
    },
    {
      "network": "WeChat",
      "MAU": 0
    },
    {
      "network": "Weibo",
      "MAU": 19532900
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 480551990
    }
  ],
  "2011": [
    {
      "network": "Facebook",
      "MAU": 766000000
    },
    {
      "network": "Flickr",
      "MAU": 66954600
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 170000000
    },
    {
      "network": "Google+",
      "MAU": 0
    },
    {
      "network": "Hi5",
      "MAU": 46610848
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 46003536
    },
    {
      "network": "Orkut",
      "MAU": 47609080
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 0
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 0
    },
    {
      "network": "Twitter",
      "MAU": 92750000
    },
    {
      "network": "WeChat",
      "MAU": 47818400
    },
    {
      "network": "Weibo",
      "MAU": 48691040
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 642669824
    }
  ],
  "2012": [
    {
      "network": "Facebook",
      "MAU": 979750000
    },
    {
      "network": "Flickr",
      "MAU": 79664888
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 170000000
    },
    {
      "network": "Google+",
      "MAU": 107319100
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 0
    },
    {
      "network": "MySpace",
      "MAU": 0
    },
    {
      "network": "Orkut",
      "MAU": 45067022
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 0
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 146890156
    },
    {
      "network": "Twitter",
      "MAU": 160250000
    },
    {
      "network": "WeChat",
      "MAU": 118123370
    },
    {
      "network": "Weibo",
      "MAU": 79195730
    },
    {
      "network": "Whatsapp",
      "MAU": 0
    },
    {
      "network": "YouTube",
      "MAU": 844638200
    }
  ],
  "2013": [
    {
      "network": "Facebook",
      "MAU": 1170500000
    },
    {
      "network": "Flickr",
      "MAU": 80000000
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 170000000
    },
    {
      "network": "Google+",
      "MAU": 205654700
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 117500000
    },
    {
      "network": "MySpace",
      "MAU": 0
    },
    {
      "network": "Orkut",
      "MAU": 0
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 0
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 293482050
    },
    {
      "network": "Twitter",
      "MAU": 223675000
    },
    {
      "network": "WeChat",
      "MAU": 196523760
    },
    {
      "network": "Weibo",
      "MAU": 118261880
    },
    {
      "network": "Whatsapp",
      "MAU": 300000000
    },
    {
      "network": "YouTube",
      "MAU": 1065223075
    }
  ],
  "2014": [
    {
      "network": "Facebook",
      "MAU": 1334000000
    },
    {
      "network": "Flickr",
      "MAU": 0
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 170000000
    },
    {
      "network": "Google+",
      "MAU": 254859015
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 250000000
    },
    {
      "network": "MySpace",
      "MAU": 0
    },
    {
      "network": "Orkut",
      "MAU": 0
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 135786956
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 388721163
    },
    {
      "network": "Twitter",
      "MAU": 223675000
    },
    {
      "network": "WeChat",
      "MAU": 444232415
    },
    {
      "network": "Weibo",
      "MAU": 154890345
    },
    {
      "network": "Whatsapp",
      "MAU": 498750000
    },
    {
      "network": "YouTube",
      "MAU": 1249451725
    }
  ],
  "2015": [
    {
      "network": "Facebook",
      "MAU": 1516750000
    },
    {
      "network": "Flickr",
      "MAU": 0
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 170000000
    },
    {
      "network": "Google+",
      "MAU": 298950015
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 400000000
    },
    {
      "network": "MySpace",
      "MAU": 0
    },
    {
      "network": "Orkut",
      "MAU": 0
    },
    {
      "network": "Pinterest",
      "MAU": 0
    },
    {
      "network": "Reddit",
      "MAU": 163346676
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 475923363
    },
    {
      "network": "Twitter",
      "MAU": 304500000
    },
    {
      "network": "WeChat",
      "MAU": 660843407
    },
    {
      "network": "Weibo",
      "MAU": 208716685
    },
    {
      "network": "Whatsapp",
      "MAU": 800000000
    },
    {
      "network": "YouTube",
      "MAU": 1328133360
    }
  ],
  "2016": [
    {
      "network": "Facebook",
      "MAU": 1753500000
    },
    {
      "network": "Flickr",
      "MAU": 0
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 398648000
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 550000000
    },
    {
      "network": "MySpace",
      "MAU": 0
    },
    {
      "network": "Orkut",
      "MAU": 0
    },
    {
      "network": "Pinterest",
      "MAU": 143250000
    },
    {
      "network": "Reddit",
      "MAU": 238972480
    },
    {
      "network": "Snapchat",
      "MAU": 238648000
    },
    {
      "network": "TikTok",
      "MAU": 0
    },
    {
      "network": "Tumblr",
      "MAU": 565796720
    },
    {
      "network": "Twitter",
      "MAU": 314500000
    },
    {
      "network": "WeChat",
      "MAU": 847512320
    },
    {
      "network": "Weibo",
      "MAU": 281026560
    },
    {
      "network": "Whatsapp",
      "MAU": 1000000000
    },
    {
      "network": "YouTube",
      "MAU": 1399053600
    }
  ],
  "2017": [
    {
      "network": "Facebook",
      "MAU": 2035750000
    },
    {
      "network": "Flickr",
      "MAU": 0
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 495657000
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 750000000
    },
    {
      "network": "MySpace",
      "MAU": 0
    },
    {
      "network": "Orkut",
      "MAU": 0
    },
    {
      "network": "Pinterest",
      "MAU": 195000000
    },
    {
      "network": "Reddit",
      "MAU": 297394200
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 239142500
    },
    {
      "network": "Tumblr",
      "MAU": 593783960
    },
    {
      "network": "Twitter",
      "MAU": 328250000
    },
    {
      "network": "WeChat",
      "MAU": 921742750
    },
    {
      "network": "Weibo",
      "MAU": 357569030
    },
    {
      "network": "Whatsapp",
      "MAU": 1333333333
    },
    {
      "network": "YouTube",
      "MAU": 1495657000
    }
  ],
  "2018": [
    {
      "network": "Facebook",
      "MAU": 2255250000
    },
    {
      "network": "Flickr",
      "MAU": 0
    },
    {
      "network": "Friendster",
      "MAU": 0
    },
    {
      "network": "Google Buzz",
      "MAU": 0
    },
    {
      "network": "Google+",
      "MAU": 430000000
    },
    {
      "network": "Hi5",
      "MAU": 0
    },
    {
      "network": "Instagram",
      "MAU": 1000000000
    },
    {
      "network": "MySpace",
      "MAU": 0
    },
    {
      "network": "Orkut",
      "MAU": 0
    },
    {
      "network": "Pinterest",
      "MAU": 246500000
    },
    {
      "network": "Reddit",
      "MAU": 355000000
    },
    {
      "network": "Snapchat",
      "MAU": 0
    },
    {
      "network": "TikTok",
      "MAU": 500000000
    },
    {
      "network": "Tumblr",
      "MAU": 624000000
    },
    {
      "network": "Twitter",
      "MAU": 329500000
    },
    {
      "network": "WeChat",
      "MAU": 1000000000
    },
    {
      "network": "Weibo",
      "MAU": 431000000
    },
    {
      "network": "Whatsapp",
      "MAU": 1433333333
    },
    {
      "network": "YouTube",
      "MAU": 1900000000
    }
  ]
}

chart.data = JSON.parse(JSON.stringify(allData[year]));
categoryAxis.zoom({ start: 0, end: 1 / chart.data.length });

series.events.on("inited", function() {
  setTimeout(function() {
    playButton.isActive = true; // this starts interval
  }, 2000)
})
var data = [
{'date': '2010-01-01T00:00:00Z', 'value': 'Red'},
{'date': '2010-01-01T00:30:00Z', 'value': 'Red'},
{'date': '2010-01-01T01:00:00Z', 'value': 'Blue'},
{'date': '2010-01-01T01:30:00Z', 'value': 'Blue'},
{'date': '2010-01-01T02:00:00Z', 'value': 'Red'},
{'date': '2010-01-01T02:30:00Z', 'value': 'Red'},
{'date': '2010-01-01T03:00:00Z', 'value': 'Blue'},
{'date': '2010-01-01T03:30:00Z', 'value': 'Blue'},
{'date': '2010-01-01T04:00:00Z', 'value': 'Red'},
{'date': '2010-01-01T04:30:00Z', 'value': 'Red'},
];

var config1 = {
    "type": "XYChart",
  "titles": [{"text": "Red - Green - Blue"}],
  "data": data,
    "xAxes": [{
        "type": "DateAxis",
    }],
    "yAxes": [{
        "type": "CategoryAxis",
        "data": [
            {"value": 'Red'},
            {"value": 'Green'},
            {"value": 'Blue'},
        ],
        "dataFields": {
            "category": "value"
        },
    }],
    "series": [{
        "type": "LineSeries",
        "dataFields": {
            "dateX": "date",
            "categoryY": "value"
        },
        "bullets":[{
            "type": "CircleBullet",
        }],
    }],
    "dateFormatter": {
        "inputDateFormat": "i",
    },
};



var chart1 = am4core.createFromConfig(config1, "chartdiv1");

var config2 = {
    "type": "XYChart",
   "titles": [{"text": "Blue - Green - Red"}],
  "data": data,
    "xAxes": [{
        "type": "DateAxis",
    }],
    "yAxes": [{
        "type": "CategoryAxis",
        "data": [
      {"value": 'Blue'},
            {"value": 'Green'},
      {"value": 'Red'},
        ],
        "dataFields": {
            "category": "value"
        },
    }],
    "series": [{
        "type": "LineSeries",
        "dataFields": {
            "dateX": "date",
            "categoryY": "value"
        },
        "bullets":[{
            "type": "CircleBullet",
        }],
    }],
    "dateFormatter": {
        "inputDateFormat": "i",
    },
};

var chart2 = am4core.createFromConfig(config2, "chartdiv2");

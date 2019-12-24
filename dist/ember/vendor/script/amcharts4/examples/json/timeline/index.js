// Set theme
am4core.useTheme(am4themes_animated);

var chart = am4core.createFromConfig({

  // Generic settings
  "curveContainer": {
    "paddingTop": 100,
    "paddingRight": 20,
    "paddingBottom": 50,
    "paddingLeft": 20
  },
  "levelCount": 3,
  "yAxisRadius": "20%",
  "yAxisInnerRadius": "2%",
  "maskBullets": false,

  // Font settings
  "fontSize": 10,
  "tooltipContainer": {
    "fontSize": 10
  },

  // Date formatting
  "dateFormatter": {
    "inputDateFormat": "yyyy-MM-dd HH:mm",
    "dateFormat": "HH"
  },

  // Category axis
  "yAxes": [{
    "type": "CategoryAxis",
    "id": "a1",
    "cursorTooltipEnabled": false,
    "dataFields": {
      "category": "category"
    },
    "renderer": {
      "grid": {
        "disabled": true
      },
      "labels": {
        "paddingRight": 25
      },
      "minGridDistance": 10
    }
  }],

  // Date axis
  "xAxes": [{
    "type": "DateAxis",
    "id": "a2",
    "endLocation": 0,
    "startLocation": -0.5,
    "baseInterval": { count: 30, timeUnit: "minute" },
    "tooltipLocation2": 0,
    "renderer": {
      "minGridDistance": 70,
      "tooltipLocation": 0,
      "line": {
        "strokeDasharray": "1,4",
        "strokeOpacity": 0.5
      },
      "labels": {
        "verticalCenter": "middle",
        "fillOpacity": 0.4,
        "paddingTop": 7,
        "paddingRight": 7,
        "paddingBottom": 7,
        "paddingLeft": 7,
        "background": {
          "fill": "#fff",
          "fillOpacity": 1
        }
      }
    },
    "tooltip": {
      "background": {
        "fillOpacity": 0.2,
        "cornerRadius": 5
      },
      "label": {
        "fill": "#000",
        "paddingTop": 7
      }
    }
  }],
  
  // Series
  "series": [{
    "type": "CurveColumnSeries",
    "baseAxis": "a1",
    
    "dataFields": {
      "openDateX": "start",
      "dateX": "end",
      "categoryY": "category"
    },
    
    "columns": {
      "height": "15%",
      "strokeOpacity": 0,
      "fillOpacity": 0.6,
      "propertyFields": {
        "fill": "color",
        "stroke": "color"
      }
    },

    "bullets": [{
      // Image bullet
      "type": "PinBullet",
      "locationX": 1,
      "dy": -5,
      "propertyFields": {
        "stroke": "color"
      },
      "background": {
        "propertyFields": {
          "fill": "color"
        }
      },
      "image": {
        "type": "Image",
        "scale": 0.5,
        "propertyFields": {
          "href": "icon"
        }
      },
      "circle": {
        "radius": "100%"
      }
    }, {
      // Label bullet
      "type": "LabelBullet",
      "locationX": 1,
      "dy": -100,
      "disabled": true,
      "propertyFields": {
        "disabled": "textDisabled"
      },
      "label": {
        "strokeOpacity": 0,
        "textAlign": "middle",
        "propertyFields": {
          "text": "text"
        }
      }
    }]
  }],

  // Scrollbar
  "scrollbarX": {
    "type": "Scrollbar",
    "align": "center",
    "width": "75%",
    "opacity": 0.5
  },

  // Cursor
  "cursor": {
    "type": "CurveCursor",
    "xAxis": "a2",
    "yAxis": "a1",
    "lineY": {
      "disabled": true
    },
    "lineX": {
      "strokeDasharray": "1,4",
      "strokeOpacity": 1
    }
  },

  // Label
  "children": [{
    "type": "Label",
    "forceCreate": true,
    "text": "Another unlucky day in the office.",
    "isMeasured": false,
    "y": "40%",
    "x": "50%",
    "horizontalCenter": "middle",
    "fontSize": 20
  }],

  // Data
  "data": [{
    "category": "",
    "start": "2019-01-10 06:00",
    "end": "2019-01-10 07:00",
    "color": "#7ddc67",
    "text": "I will have\na healthy day today!",
    "textDisabled": false,
    "icon": "timeline0.svg"
  }, {
    "category": "",
    "start": "2019-01-10 07:00",
    "end": "2019-01-10 08:00",
    "color": "#a0dc67",
    "icon": "timeline1.svg"
  }, {
    "category": "",
    "start": "2019-01-10 08:00",
    "end": "2019-01-10 09:00",
    "color": "#c3dc67",
    "icon": "timeline2.svg"
  }, {
    "category": "",
    "start": "2019-01-10 09:00",
    "end": "2019-01-10 10:00",
    "color": "#dcd267",
    "icon": "timeline2.svg"
  }, {
    "category": "",
    "start": "2019-01-10 10:00",
    "end": "2019-01-10 12:00",
    "color": "#dcaf67",
    "icon": "timeline2.svg"
  }, {
    "category": "",
    "start": "2019-01-10 12:00",
    "end": "2019-01-10 13:00",
    "color": "#dc8c67",
    "icon": "timeline1.svg"
  }, {
    "category": "",
    "start": "2019-01-10 13:00",
    "end": "2019-01-10 14:00",
    "color": "#dc6967",
    "text": "One beer doesn't count.",
    "textDisabled": false,
    "icon": "timeline3.svg"
  }, {
    "category": "",
    "start": "2019-01-10 14:00",
    "end": "2019-01-10 16:00",
    "color": "#dc6788",
    "icon": "timeline2.svg"
  }, {
    "category": "",
    "start": "2019-01-10 16:00",
    "end": "2019-01-10 17:00",
    "color": "#dc67ab",
    "icon": "timeline4.svg"
  }, {
    "category": "",
    "start": "2019-01-10 17:00",
    "end": "2019-01-10 20:00",
    "color": "#dc67ce",
    "icon": "timeline2.svg"
  }, {
    "category": "",
    "start": "2019-01-10 20:00",
    "end": "2019-01-10 20:30",
    "color": "#c767dc",
    "icon": "timeline3.svg"
  }, {
    "category": "",
    "start": "2019-01-10 20:30",
    "end": "2019-01-10 21:30",
    "color": "#a367dc",
    "icon": "timeline3.svg"
  }, {
    "category": "",
    "start": "2019-01-10 21:30",
    "end": "2019-01-10 22:00",
    "color": "#8067dc",
    "icon": "dance.svg"
  }, {
    "category": "",
    "start": "2019-01-10 22:00",
    "end": "2019-01-10 23:00",
    "color": "#6771dc",
    "icon": "timeline5.svg"
  }, {
    "category": "",
    "start": "2019-01-10 23:00",
    "end": "2019-01-11 00:00",
    "color": "#6794dc",
    "icon": "timeline6.svg"
  }, {
    "category": "",
    "start": "2019-01-11 00:00",
    "end": "2019-01-11 01:00",
    "color": "#67b7dc",
    "text": "Damn...",
    "textDisabled": false,
    "icon": "timeline7.svg"
  }],

}, "chartdiv", am4plugins_timeline.SerpentineChart);

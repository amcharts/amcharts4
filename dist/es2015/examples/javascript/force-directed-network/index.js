import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

let chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);

let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
networkSeries.dataFields.linkWith = "linkWith";
networkSeries.dataFields.name = "name";
networkSeries.dataFields.id = "name";
networkSeries.dataFields.value = "value";
networkSeries.dataFields.children = "children";

networkSeries.nodes.template.label.text = "{name}"
networkSeries.fontSize = 8;
networkSeries.linkWithStrength = 0;

let nodeTemplate = networkSeries.nodes.template;
nodeTemplate.tooltipText = "{name}";
nodeTemplate.fillOpacity = 1;
nodeTemplate.label.hideOversized = true;
nodeTemplate.label.truncate = true;

let linkTemplate = networkSeries.links.template;
linkTemplate.strokeWidth = 1;
let linkHoverState = linkTemplate.states.create("hover");
linkHoverState.properties.strokeOpacity = 1;
linkHoverState.properties.strokeWidth = 2;

nodeTemplate.events.on("over", (event) => {
    let dataItem = event.target.dataItem;
    dataItem.childLinks.each((link) => {
        link.isHover = true;
    })
})

nodeTemplate.events.on("out", (event) => {
    let dataItem = event.target.dataItem;
    dataItem.childLinks.each((link) => {
        link.isHover = false;
    })
})

networkSeries.data = [
   {
      "name":"Phoebe",
      "value":102,
      "linkWith":[
         "Gunther"
      ],
      "children":[
         {
            "name":"David",
            "value":14
         },
         {
            "name":"Roger",
            "value":1
         },
         {
            "name":"Duncan",
            "value":1
         },
         {
            "name":"Rob Dohnen",
            "value":2
         },
         {
            "name":"Ryan",
            "value":5
         },
         {
            "name":"Malcom",
            "value":1
         },
         {
            "name":"Robert",
            "value":1
         },
         {
            "name":"Sergei",
            "value":1
         },
         {
            "name":"Vince",
            "value":2
         },
         {
            "name":"Jason",
            "value":1
         },
         {
            "name":"Rick",
            "value":2
         },
         {
            "name":"Gary",
            "value":7
         },
         {
            "name":"Jake",
            "value":2
         },
         {
            "name":"Eric",
            "value":3
         },
         {
            "name":"Mike",
            "value":18
         }
      ]
   },
   {
      "name":"Monica",
      "value":204,
      "linkWith":[
         "Rachel",
         "Chandler",
         "Ross",
         "Joey",
         "Phoebe"
      ],
      "children":[
         {
            "name":"Paul the wine guy",
            "value":1
         },
         {
            "name":"Mr Geller",
            "value":8
         },
         {
            "name":"Mrs Geller",
            "value":14
         },
         {
            "name":"Aunt Lilian",
            "value":2
         },
         {
            "name":"Nana",
            "value":1
         },
         {
            "name":"Young Ethan",
            "value":5
         },
         {
            "name":"Ben",
            "value":9
         },
         {
            "name":"Fun Bobby",
            "value":3
         },
         {
            "name":"Richard",
            "value":16
         },
         {
            "name":"Mrs Green",
            "value":4
         },
         {
            "name":"Paolo2",
            "value":1
         },
         {
            "name":"Pete",
            "value":10
         },
         {
            "name":"Chip",
            "value":1
         },
         {
            "name":"Timothy (Burke)",
            "value":1
         },
         {
            "name":"Emily",
            "value":17
         },
         {
            "name":"Dr. Roger",
            "value":3
         }
      ]
   },
   {
      "name":"Ross",
      "value":216,
      "linkWith":[
         "Joey",
         "Phoebe",
         "Mrs Geller",
         "Aunt Lilian",
         "Mrs Bing",
         "Ben",
         "Mrs Green",
         "Emily"
      ],
      "children":[
         {
            "name":"Carol",
            "value":10
         },
         {
            "name":"Celia",
            "value":2
         },
         {
            "name":"Julie",
            "value":6
         },
         {
            "name":"Chloe",
            "value":1
         },
         {
            "name":"Bonnie",
            "value":4
         },
         {
            "name":"Messy Girl (Cheryl)",
            "value":5
         },
         {
            "name":"Jill",
            "value":1
         },
         {
            "name":"Elizabeth",
            "value":8
         },
         {
            "name":"Aunt Millie",
            "value":2
         },
         {
            "name":"Mona",
            "value":11
         },
         {
            "name":"Emma",
            "value":7
         },
         {
            "name":"Charlie",
            "value":13
         }
      ]
   },
   {
      "name":"Chandler",
      "value":167,
      "linkWith":[
         "Joey",
         "Phoebe"
      ],
      "children":[
         {
            "name":"Aurora",
            "value":2
         },
         {
            "name":"Jill Goodacre",
            "value":1
         },
         {
            "name":"Janice",
            "value":12
         },
         {
            "name":"Mrs Bing",
            "value":6
         },
         {
            "name":"Nina",
            "value":1
         },
         {
            "name":"Susie",
            "value":5
         },
         {
            "name":"Mary Theresa",
            "value":1
         },
         {
            "name":"Ginger",
            "value":2
         },
         {
            "name":"Joanna",
            "value":5
         },
         {
            "name":"Kathy",
            "value":9
         },
         {
            "name":"Mr Bing",
            "value":1
         }
      ]
   },
   {
      "name":"Rachel",
      "value":158,
      "linkWith":[
         "Chandler",
         "Ross",
         "Joey",
         "Phoebe",
         "Mr Geller",
         "Mrs Geller"
      ],
      "children":[
         {
            "name":"Paolo",
            "value":5
         },
         {
            "name":"Barry",
            "value":1
         },
         {
            "name":"Dr Green",
            "value":3
         },
         {
            "name":"Mark3",
            "value":1
         },
         {
            "name":"Josh",
            "value":2
         },
         {
            "name":"Gunther",
            "value":2
         },
         {
            "name":"Joshua",
            "value":3
         },
         {
            "name":"Danny",
            "value":1
         },
         {
            "name":"Mr. Zelner",
            "value":1
         },
         {
            "name":"Paul Stevens",
            "value":3
         },
         {
            "name":"Tag",
            "value":4
         },
         {
            "name":"Melissa",
            "value":1
         },
         {
            "name":"Gavin",
            "value":2
         }
      ]
   },
   {
      "name":"Joey",
      "value":88,
      "linkWith":[
         "Phoebe",
         "Janice",
         "Mrs Green",
         "Kathy",
         "Emily",
         "Charlie"
      ],
      "children":[
         {
            "name":"Lorraine",
            "value":2
         },
         {
            "name":"Melanie",
            "value":2
         },
         {
            "name":"Erica",
            "value":2
         },
         {
            "name":"Kate",
            "value":4
         },
         {
            "name":"Lauren",
            "value":2
         },
         {
            "name":"Estelle",
            "value":1
         },
         {
            "name":"Katie",
            "value":2
         },
         {
            "name":"Janine",
            "value":9
         },
         {
            "name":"Erin",
            "value":1
         },
         {
            "name":"Cecilia",
            "value":3
         }
      ]
   }
];

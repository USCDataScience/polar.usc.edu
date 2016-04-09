$(document).ready(function () {
  var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 1800,
    //viewBoxSize: => use @default
    innerRadius: 600 / 4,
    //outerRadius: => use @default
    radiusMin: 50,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default
    data: {
      items: [
        {text: "Age", count: "3.56"},
      //  {text: "Agriculture", count: "0.08"},
       // {text: "Animal", count: "0.31"},
        //{text: "Assessment", count: "0.10"},
        //{text: "Atmosphere", count: "0.02"},
        {text: "Continent", count: "1.28"},
       //{text: "Datastate", count: "0.51"},
       //{text: "EntryStorage", count: "0.31"},
        {text: "Frequency ", count: "2.01"},
        {text: "Human Activity", count: "6.51"},
        {text: "Impact", count: "1.69"},
       // {text: "InorganicCompound", count: "0.31"},
        // {text: "Investigation", count: "0.57"},
        //{text: "Landform", count: "0.30"},
        //{text: "LivingEnitity", count: "0.08"},
        {text: "Location", count: "10.26"},
        //{text: "MarineAnimal", count: "0.91"},
        //{text: "Measurement", count: "0.22"},
        {text: "Ocean", count: "2.80"},
        //{text: "Phenomena", count: "0.32"},
        //{text: "Physics", count: "0.13"},
        //{text: "Profession", count: "0.09"},
        {text: "Research", count: "1.64"},
        //{text: "Science", count: "0.19"},
        //{text: "Season", count: "0.80"},
        {text: "SpatialEntity", count: "3.15"},
        //{text: "SpeedState", count: "0.15"},
        //{text: "StateOfMatter", count: "0.21"},
        //{text: "TemperatureRange", count: "0.33"},
        //{text: "TrigonometricFunction", count: "0.04"},
        {text: "Trust", count: "1.04"},
        {text: "Unit", count: "54.9"},
       // {text: "Vehicle", count: "0.21"},
        //{text: "WaterBody", count: "0.89"},
        {text: "NumericalEntity", count: "3.87"}
          ],
      eval: function (item) {return (item.count*90);},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
        {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "count",
              classed: {count: true},
              style: {
                "font-size": "28px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "text",
              classed: {text: true},
              style: {
                "font-size": "14px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
});
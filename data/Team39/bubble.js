$(document).ready(function () {
    var  totalNum = 0;
    var totalNumQuery = "http://localhost:8983/solr/collection1/select?q=Region:%22North%20America%22";

    $.getJSON( totalNumQuery + "&indent=true&wt=json", {})
    .done(function( data ) {
      totalNum = data.response.numFound;      
    });

  var counts = [0,0,0,0,0];
  var topics = ["Ice", "Sea","Human","Space","Education"];
  for(var i = 0; i < 5; i++){
    var query = totalNumQuery + "AND%20(title:*" + topics[i] + 
            "*%20OR%20Description:*" + topics[i] + "*%20OR%20Content:*" + topics[i]
        + "*)%20&indent=true&wt=json";

    $.getJSON( query, {})
    .done(function( data ) {
      counts[i] = ((data.response.numFound)/totalNum).toFixed(4)*100;
    });
  }

  var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 600,
    //viewBoxSize: => use @default
    innerRadius: 600 / 3.5,
    //outerRadius: => use @default
    radiusMin: 50,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default



    data: {
      items: [
        {text: "Space", count: 0.66},
        {text: "Ice", count:0.59},
        {text: "Sea", count: 0.51},
        {text: "Human", count: 0.77},
        {text: "Education", count: 0.44},
      ],
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: {
          //text: "(See more detail)",
          style: {
            "font-size": "12px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            //"font-weight": "700",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
        }
      },
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
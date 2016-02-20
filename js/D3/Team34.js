  /*
  var myMap = {}; 


    $.getJSON("http://localhost:8983/solr/collection1/select/?q={!func}sum(mul(sum(tf(content,oil),tf(content,gas)),5),tf(content,Arctic))&wt=json&json.wrf=?&indent=true&rows=1000&facet=true&facet.field=location", function(result){
    //  alert(result['facet_counts']['facet_fields']['location']);
       var count = 0;
      var key;
      $.each(result['facet_counts']['facet_fields']['location'], function(v,d){
        if(count%2===0)
          key = d;
        else
        {
          if(d>200&&key.indexOf("Earth")===-1)
            if(key.indexOf("earth")===-1)
          myMap[key] = d;
        }  
        count++;
      });
  */
$(document).ready(function () {
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

/*
    earth,1509,Earth,734,Arctic,554,United States,356,Arctic Ocean,319,Alaska,301,Republic of Benin,286,Canada,242,Commonwealth of Australia,230,Colorado,152,Tennessee,131,Europe,122,Oak Ridge,121,Russian Federation,112,People’s Republic of China,110,California,108,Federative Republic of Brazil,99,*/

    data: {
      items: [
        {text: "Arctic", count: "554"},
        {text: "United States", count: "356"},
        {text: "Arctic Ocean", count: "319"},
        {text: "Alaska", count: "301"},
        {text: "Republic of Benin", count: "286"},
        {text: "Canada", count: "242"},
        {text: "Commonwealth of Australia", count: "230"},
        {text: "Colorado", count: "152"},
        {text: "Tennessee", count: "131"},
      ],
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: {
          
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

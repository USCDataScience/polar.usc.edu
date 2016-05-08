// InitChart();
// for (i = 0; i < 20; i++) {
//   $('<input type="radio" id="radio01" name="radio" /><label for="radio01"><span></span>Radio Button 1</label><br>')
//   .appendTo('#radiocontainer');
// }
var resultdata;
var maxmindata;
$.get("maxmin.txt", function(data, status) {
  data = JSON.parse(data);
  maxmindata = data;
  $.get("sizeratiodata.json", function(ratiodata, status) {
  // console.log(data);
  resultdata = ratiodata;
    for(key in data) {
      radioid = key + "radio"
      $('<div><input type="radio" id="'+radioid+'" name="radio" onclick="createPlot(\''+key+'\')"/>' + 
        '<label for="'+radioid+'" onclick="createPlot(\''+key+'\')"><span></span>'+key+'</label></div>')
        .appendTo('#radiocontainer');
    }
      createPlot('text/html');
      $("#text\\/htmlradio").prop("checked", true);
  });
  // addLine(data, "blue");
});

function createXYDict(list) {
  xylist = [];
  for(var i=0; i<list.length; i++) {
    xydict = {};
    xydict['x'] = i;
    xydict['y'] = list[i];
    xylist.push(xydict);
  }
  return xylist;
}

function createPlot(key) {
    d3.selectAll('#finger').remove();
    d3.selectAll('#correlate').remove();
    d3.selectAll('.axis').remove();
    console.log(maxmindata);
    if(maxmindata[key]['maxbody']>maxmindata[key]['maxmeta']) {
      ymax = maxmindata[key]['maxbody'];
    } else {
      ymax = maxmindata[key]['maxmeta'];
    }
    xmax = resultdata[key][0].length;
    InitChart(xmax, ymax);
    var fingerprint = createXYDict(resultdata[key][0]);
    var correlation = createXYDict(resultdata[key][1]);
    addLine(fingerprint, "blue", "finger");
    addLine(correlation, "green", "correlate");
}

// $.get("correlationcord.json", function(data, status) {
//   console.log(data);
//   addLine(data, "green");
// });

function InitChart(xmax, ymax) {
  var vis = d3.select("#visualisation"),
    WIDTH = 750,
    HEIGHT = 500,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 100
    },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, xmax]),

    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, ymax]),

    xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(5)
      .tickSubdivide(true),

    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .tickSubdivide(true);


  vis.append("svg:g")
    // .transition()
    // .duration(1000)
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);

  vis.append("svg:g")
    // .transition()
    // .duration(1000)
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  lineFunc = d3.svg.line()
  .x(function (d) {
    return xRange(d.x);
  })
  .y(function (d) {
    return yRange(d.y);
  });
}


function pathTween(lineData) {
        var interpolate = d3.scale.quantile()
                .domain([0,1])
                .range(d3.range(1, lineData.length + 1));
        return function(t) {
            return lineFunc(lineData.slice(0, interpolate(t)));
        };
    }

function addLine(lineData, color, type) {
  var vis = d3.select("#visualisation");
  vis.append("svg:path")
  // .attr('class', 'line')
  // .attr('d', lineFunc(lineData[0]))
  // .transition()
  // .duration(2000)
  .attr("id", type)
  .attr('d', lineFunc(lineData))
  .attr("stroke", color)
  .attr("stroke-width", 1)
  .attr("fill", "none");
}
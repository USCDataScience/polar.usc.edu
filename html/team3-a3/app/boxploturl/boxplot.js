function createplot(filename) {
d3.select(".my-svg").remove();
//initialize the dimensions
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 800 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom,
    padding = 20
    midline = (height - padding) / 2;

//initialize the x scale
var xScale = d3.scale.linear()
               .range([padding, width - padding]);  

//initialize the x axis
var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

//initialize boxplot statistics
var data = [],
    outliers = [],
    minVal = Infinity,
    lowerWhisker = Infinity,
    q1Val = Infinity,
    medianVal = 0,
    q3Val = -Infinity,
    iqr = 0,
    upperWhisker = -Infinity,
    maxVal = -Infinity;

d3.csv(filename + '.csv', type, function(error,csv) { // load the data
  
  data = csv.map(function(d) {
    return d.value;
  });

  data = data.sort(d3.ascending);

  //calculate the boxplot statistics
  minVal = data[0],
  q1Val = d3.quantile(data, .25),
  medianVal = d3.quantile(data, .5),
  q3Val = d3.quantile(data, .75),
  iqr = q3Val - q1Val,
  maxVal = data[data.length - 1];
  // lowerWhisker = d3.max([minVal, q1Val - iqr])
  // upperWhisker = d3.min([maxVal, q3Val + iqr]);

  var index = 0;

  //search for the lower whisker, the mininmum value within q1Val - 1.5*iqr
  while (index < data.length && lowerWhisker == Infinity) {

    if (data[index] >= (q1Val - 1.5*iqr))
      lowerWhisker = data[index];
    else
      outliers.push(data[index]);
    index++;
  }

  index = data.length-1; // reset index to end of array

  //search for the upper whisker, the maximum value within q1Val + 1.5*iqr
  while (index >= 0 && upperWhisker == -Infinity) {

    if (data[index] <= (q3Val + 1.5*iqr))
      upperWhisker = data[index];
    else
      outliers.push(data[index]);
    index--;
  }
 
  //map the domain to the x scale +10%
  xScale.domain([0,maxVal*1.10]);

  var svg = d3.select("#visualisation")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .classed("my-svg", true);;

  //append the axis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0, " + (height - padding) + ")")
     .call(xAxis);

  //draw verical line for lowerWhisker
  svg.append("line")
     .attr("class", "whisker")
     .attr("x1", xScale(lowerWhisker))
     .attr("x2", xScale(lowerWhisker))
     .attr("stroke", "black")
     .attr("y1", midline - 10)
     .attr("y2", midline + 10);

  //draw vertical line for upperWhisker
  svg.append("line")  
     .attr("class", "whisker")
     .attr("x1", xScale(upperWhisker))
     .attr("x2", xScale(upperWhisker))
     .attr("stroke", "black")
     .attr("y1", midline - 10)
     .attr("y2", midline + 10);

  //draw horizontal line from lowerWhisker to upperWhisker
  svg.append("line")
     .attr("class", "whisker")
     .attr("x1",  xScale(lowerWhisker))
     .attr("x2",  xScale(upperWhisker))
     .attr("stroke", "black")
     .attr("y1", midline)
     .attr("y2", midline);

  //draw rect for iqr
  svg.append("rect")    
     .attr("class", "box")
     .attr("stroke", "black")
     .attr("fill", "white")
     .attr("x", xScale(q1Val))
     .attr("y", padding)
     .attr("width", xScale(iqr) - padding)
     .attr("height", 20);

  //draw vertical line at median
  svg.append("line")
     .attr("class", "median")
     .attr("stroke", "black")
     .attr("x1", xScale(medianVal))
     .attr("x2", xScale(medianVal))
     .attr("y1", midline - 10)
     .attr("y2", midline + 10);

  svg.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (width/2) +","+(height-65)+")")  // centre below axis
    .text(filename.split("/")[3]);

  //draw data as points
  svg.selectAll("circle")
     .data(csv)     
     .enter()
     .append("circle")
     .attr("r", 2.5)
     .attr("class", function(d) {
      if (d.value < lowerWhisker || d.value > upperWhisker)
        return "outlier";
      else 
        return "point";
     })     
     .attr("cy", function(d) {
      return random_jitter();
     }) 
     .attr("cx", function(d) {
      return xScale(d.value);   
     })
     .append("title")
     .text(function(d) {
      return "Date: " + d.date + "; value: " + d.value;
     }); 

});

function random_jitter() {
  if (Math.round(Math.random() * 1) == 0)
    var seed = -5;
  else
    var seed = 5; 
  return midline + Math.floor((Math.random() * seed) + 1);
}

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
}
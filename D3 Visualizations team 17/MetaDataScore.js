var fileType = null;
function myFunction() {
        var path = "MDScore.tsv";
        drawFPBarChart("tab1",path);

        }

function drawFPBarChart(tabId,path,minMaxFlag){
    var margin = {top: 70, right: 20, bottom: 30, left: 250},
    width = 1170 - margin.left - margin.right,
    height = 530 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.5);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        //.scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
    return "<strong>File Number: <span style='color:red'>"+ d.letter+"</span> Metadata Score: </strong> <span style='color:red'>" + Math.round(d.frequency*1000) + "</span>";
  })
      
    var tipArr = [];

    var svg = d3.select("#"+tabId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.tsv("MDScore.tsv", type, function(error, data) {
     console.log(data);
      x.domain(data.map(function(d) { return d.letter; }));
      y.domain([0, 0.3]);//d3.max(data, function(d) { return d.frequency; })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            //.attr("dy", ".5em")
            .style("text-anchor", "middle")
            .text("File Number");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Metadata Score");
      
      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.letter); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.frequency); })
          .attr("height", function(d) { return height - y(d.frequency); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)

    });

    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }
}//end of drawBarChart


var width = 800,
    height = 800,
    radius = Math.min(width-10, height-10) / 2;

var color = d3.scale.category20()



/*d3.scale.category20()
var color = d3.scale.ordinal()
    .domain([1,739588])
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);*/
var arc = d3.svg.arc()
    .outerRadius(radius + 5)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .padAngle(.0001)
    .value(function(d) { return d.value; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
d3.json("../../data/Team15_data/filetypes.json", function(error,data) {
if (error) 
{
return console.warn(error);
}

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([50, 0])
  .html(function(d) {
    return "  <span style='color:red;font-size:200%;'>mimetype:</span>"+"<span style='color:white;font-size:200%;'>" + d.data.type +" ,"+ "<span style='color:red;font-size:100%;'> value:</span>" + d.data.value+ "</span>";
  })
  
svg.call(tip);
  
console.log(data);
var g = svg.selectAll(".arc")
      .data(pie(data.types))
    .enter().append("g")
      .attr("class", "arc")
      //tooltip
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
   

g.append("path")
      .attr("d", arc)
      .style("fill", function(d){ return color(d.data.value)});
     
      



    
});

 /*
       g.append("text")
      .attr("transform", function(d) {  console.log(d);return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.type; });*/
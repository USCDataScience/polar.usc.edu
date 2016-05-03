var width =960,
	height =600;
var fill = d3.scale.category20();

d3.csv("count_words.csv", function(data){
	console.log("in");
	var metadata = data
	.filter(function (d){ return +d.count>0 ; })
	.map(function(d){ return { text: d.language, size :d.count};})
	.sort(function(a,b) { return d3.descending(a.size, b.size); })
	/*.slice(0,25)*/;
	
var layout = d3.layout.cloud()
    .size([width, height])
    .words(metadata)
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw);
layout.start();
});
function draw(words) {
  d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
	console.log(words);
}

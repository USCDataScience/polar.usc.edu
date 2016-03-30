//d3.json("../data/viz-all.json",function(data){
d3.json("../data/CO_1456988132.json",function(data){
	i = 0;
	var bardata = [];
	for(var key in data){
		//for( var k in data[key])
		//{
			bardata.push(data[key])
		//}
		i++;
		
	}
	show_chart(bardata,key);
});
//for (var i =0;i<50;i++)
//	bardata.push(Math.round(Math.random()*30+10))
function show_chart(bardata,mimetype){
var height = 400,
	width = 3400,
	barwdith = 256,
	baroffset = 5;

var heightScale = d3.scale.linear()
			.domain([0,d3.max(bardata)])
			.range([0,height])

var lengthScale = d3.scale.ordinal()
			.domain(d3.range(0,bardata.length))
			.rangeBands([0,width])

function colors_google(n) {
  var colors_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colors_g[n % colors_g.length];
  //return "#109618";
}

var color = d3.scale.linear()
			.domain([0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1])
			.range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"])

var tooltip = d3.select('body').append('div')
				.style('position','absolute')
				.style('padding','0 20px')
				.style('background','white')
				.style('opacity',0)

var mydiv = d3.select("#chart").append('div')
	.attr('class','well')
	.style('overflow','auto')
	
var mysvg = mydiv.append('svg')
			.attr('width',width)
			.attr('height',height)

	
var bar = mysvg.selectAll("rect")
	.data(bardata)
	.enter().append("svg:rect");

	// Defined width and height
	bar
	.attr('width',10)
	.attr('height',function(d,i){
		return heightScale(d);
	})

	// Now we will define the positions of the bars
	bar.style('fill',function(d,i){
			return color(d)	
		})
		.attr('x',function(d,i){
			return (i*13 + 20);
		})
		.attr('y',function(d,i){
			return height - heightScale(d);
		})
		.on('mouseover',function(d){
			tooltip.transition()
				.style('opacity',0.9)
			tooltip.html(d)
				.style('left',d3.event.pageX +'px')
				.style('top',d3.event.pageY+'px')
			d3.select(this)
				.style('opacity',0.5)
		})
		.on('mouseout',function(d){
			d3.select(this)
				.style('opacity',1)
		});
	
	// Drawing the X and Y axis
	mysvg.selectAll(".xaxis")
		.data(bardata)
		.enter().append("svg:text")
		.attr("x",function(data,i){
			return (i*13 + 22);
		})
		.attr("y",height - 12)
		.attr("text-anchor","middle")
		.style("font-size","13px")
		.style("font-family","Times New Roman, Times, serif")
		.text(function(d,i){
			return i;
		})
		.attr("transform",function(d,i){
			return "rotate(-90,"+ (i*13 + 22)+","+(height - 12)+")";
		});

	mysvg.selectAll(".ylabel")
	  .data(heightScale.ticks(10))
	  .enter().append("svg:text")
	  .attr('x',18)
	  .attr('y',function(d) {return height - heightScale(d);})
	  .attr("text-anchor", "end")
	  .style("font-size","13px")
	  .style("font-family","Times New Roman, Times, serif") 
	  .text(function(d) {return d;});
	
	mysvg.selectAll(".yTicks")
	  .data(heightScale.ticks(10))
	  .enter().append("svg:line")
	  .attr('x1','18')
	  .attr('y1',function(d) {return height - heightScale(d);})
	  .attr('x2',width)
	  .attr('y2',function(d) {return height - heightScale(d);})
	  .style('stroke','#E0D8E0');

	mydiv.append("p")
	.text("Fig : BFD for "+mimetype)
	.style("text-align","center")

}

//d3.json("../data/viz-all.json",function(data){
elem = document.getElementById("fileselection");
elem.addEventListener("change",function(){
	document.getElementById("chart").innerHTML = "";
	fname = elem.value;
	mtype = elem.name;
	filename = "../../data/team24ev/"+fname;
	d3.json(filename,function(data){
		for(var key in data ) {
			var bardata = data[key];
		/*i = 0;
		var bardata = new Array(8);
		for(i=0;i< 8;i++){
			bardata[i] = new Array(256);
			bardata[i].push(data[i]);
			console.log(data[i]);
		}*/
		}
		show_chart(bardata,key);
	});	
});

//for (var i =0;i<50;i++)
//	bardata.push(Math.round(Math.random()*30+10))
function show_chart(bardata,mimetype){
var height = 250,
	width = 3500,
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
			.range(['#f6faaa','#FEE08B','#FDAE61','#F46D43','#D53E4F','#9E0142'])
			//.range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"])

var tooltip = d3.select('body').append('div')
				.style('position','absolute')
				.style('padding','0 20px')
				.style('background','white')
				.style('opacity',0)

var mydiv = d3.select("#chart").append('div')
	.style('overflow','auto')
	
var mysvg = mydiv.append('svg')
			.attr('width',width)
			.attr('height',height)

var mydata = new Array(256);
	mysvg.selectAll(".xaxis")
	  .data(mydata)
	  .enter().append("svg:text")
	  .attr("x",function(d,i){
	  	return (i*20 + 10);
	  })
	  .attr("y",height - 20)
	  .attr("text-anchor", "middle")
	  .style("font-size","15px")
	  .style("font-family","Times New Roman, Times, serif") 
	  .text(function(d,i) {
	  		return String.fromCharCode(i);
	  		//return i;
	   });

	
var bar = mysvg.selectAll("g")
	.data(bardata)
	.enter().append("g")
	.selectAll("rect")
	.data(function(d,i,j){
		return d;
	})
	.enter().append("svg:rect")
	.attr('width',20)
	.attr('height',20)
	.style('fill',function(d,i,j){
			return color(d)	
	})
	.text(function(d,i,j){
		return d;
	})
	.attr('x',function(d,i,j){
		return (i*25 + 15);
	})
	.attr('y',function(d,i,j){
		return (j*25+ 10);
	})
	.on('mouseover',function(d,i,j){
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
	mysvg.selectAll(".yaxis")
		.data(bardata)
		.enter().append("svg:text")
		.attr("y",function(d,i,j){
			if( i == 0)
				return (30);
			else
				return (i*25 + 30);
		})
		.attr("x",5)
		.attr("text-anchor","middle")
		.style("font-size","20px")
		.style("font-family","Times New Roman, Times, serif")
		.text(function(d,i,j){
			return i;
		});

		
	/*mysvg.selectAll(".yTicks")
	  .data(heightScale.ticks(10))
	  .enter().append("svg:line")
	  .attr('x1','18')
	  .attr('y1',function(d) {return height - heightScale(d);})
	  .attr('x2',width)
	  .attr('y2',function(d) {return height - heightScale(d);})
	  .style('stroke','#E0D8E0');
	*/
	mydiv.append("p")
	.text("Fig : FHT Profile for "+mimetype)
	.style("text-align","center")

}

function colors_google(n) {
  var colors_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colors_g[n % colors_g.length];
}

var height = 400,
	width = 400,
	radius = 200,
	inradius = 100;

var tempColor;

var piedata = [];
d3.json("../../data/team24ev/ontology/overall.json",function(error,data){
	for ( var k in data)
	{
		//console.log(data[k]);
        piedata.push(data[k]);
	}	
	display_data(piedata);
})

function display_data(piedata)
{
  
    var pie = d3.layout.pie()
    			.value(function(d){
                    //console.log(d.value);
    				return d.value;
    			})

    var arc = d3.svg.arc()
    			.outerRadius(radius)

    var color = d3.scale.category10();


    var tooltip = d3.select('body').append('div')
    				.style('position','absolute')
    				.style('padding','0 10px')
    				.style('background','white')
    				.style('color','black')
    				.style('opacity',0)

    var mychart = d3.select("#chart").append('svg')
    	.attr('width', width)
    	.attr('height',height)
    	.append('g')
    	.attr('transform','translate('+ (width-radius )+','+ (height -radius) +')')
    	.selectAll('path').data(pie(piedata))
    	.enter()
		.append('path')
        .attr('d',arc)
		.attr('fill',function(d,i){
			return colors_google(i);	
		})
		.on('mouseover',function(d){
			tooltip.transition()
				.style('opacity',0.9)
			tooltip.html(d.data.name+','+d.data.value)
				.style('left',d3.event.pageX +'px')
				.style('top',d3.event.pageY+'px')
			tempColor = this.style.fill;
			d3.select(this)
				.style('opacity',0.8)
		})
		.on('mouseout',function(d){
			d3.select(this)
				.style('opacity',1)
				.style('fill',tempColor)
		});
}
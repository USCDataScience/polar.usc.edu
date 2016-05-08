'use strict'
var margin = {top: 20, right: 10, bottom: 20, left: 10};
var width  = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var radius = 200
var colors = d3.scale.category20();	//Categorical colors : we dont care abt specific colors : d3.scale.category20(); d3.scale.category20b(); d3.scale.category20c();

function mapNames(code){
	switch(code){
		case "be" : return "Belarusian";
		case "ca" : return "Catalan";
		case "da" : return "Danish";
		case "de" : return "German";
		case "eo" : return "Esperanto";
		case "et" : return "Estonian";
		case "el" : return "Greek";
		case "en" : return "English";
		case "es" : return "Spanish";
		case "fi" : return "Finnish";
		case "fr" : return "French";
		case "fa" : return "Persian";
		case "gl" : return "Galician";
		case "hu" : return "Hungarian";
		case "is" : return "Icelandic";
		case "it" : return "Italian";
		case "lt" : return "Lithuanian";
		case "nl" : return "Dutch";
		case "no" : return "Norwegian";
		case "pl" : return "Polish";
		case "pt" : return "Portuguese";
		case "ro" : return "Romanian";
		case "ru" : return "Russian";
		case "sk" : return "Slovakian";
		case "sl" : return "Slovenian";
		case "sv" : return "Swedish";
		case "th" : return "Thai";
		case "uk" : return "Ukrainian";
		default : return "Unknown";
	}
}

function mapColor(color)
{
	//color values used from https://github.com/mbostock/d3/wiki/Ordinal-Scales
	switch(color){
		case "no" : return "#393b79";
		case "de" : return "#1f77b4";
		case "ru" : return "#aec7e8";
		case "fi" : return "#ff7f0e";
		case "be" : return "#ffbb78";
		case "pt" : return "#2ca02c";
		case "lt" : return "#98df8a";
		case "fr" : return "#d62728";
		case "hu" : return "#ff9896";
		case "unknown" : return "#9467bd";
		case "uk" : return "#c5b0d5";
		case "sk" : return "#8c564b";
		case "sl" : return "#c49c94";
		case "ca" : return "#e377c2";
		case "sv" : return "#f7b6d2";
		case "gl" : return "#ff7f0e";
		case "el" : return "#393b79";
		case "en" : return "#8ca252";
		case "is" : return "#c7c7c7";
		case "eo" : return "#bcbd22";
		case "it" : return "#e7969c";
		case "es" : return "#dbdb8d";
		case "et" : return "#9c9ede";
        case "th" : return "#843c39";
        case "fa" : return "#b5cf6b";
		case "pl" : return "#17becf";
		case "da" : return "#7f7f7f";
		case "ro" : return "#ad494a";
        case "nl" : return "#3182bd";
		default : return "#636363";
	}

}

function langDiversityAnalysis(jsonFileName){
	d3.json(jsonFileName, function(objects) {	
		//console.log(objects);
		var piedata = [];
		var key;
		for (key in objects) 
		{
			piedata.push(objects[key]);
		}
		
		var pie = d3.layout.pie()
				.value(function(d) {
						return d.count;
				});
		
		var arc = d3.svg.arc().outerRadius(radius);
				
		var jsonFile = jsonFileName.replace(/(.*)\.json/g, "$1");
		var idJsonFile = jsonFile;
		
		var svg = d3.select('#container').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('padding', "40px")
			.attr('id', idJsonFile);

			
		var myChart = svg.append('g')
			.attr('transform', 'translate('+(width-radius)+','+(height-radius)+')')
			.selectAll('path').data(pie(piedata))
			.enter().append('g')
				.attr('class', 'slice');
		
		svg.append("text")
				.text(jsonFile)
				.attr("transform", "translate(" + 200 + "," + 15 + ")")
				.attr("text-decoration-style", "solid")
				.attr("font", "15px");

		var slices = svg.selectAll('g.slice')
				.append('path')
				.attr('fill', function(d, i) {
					//console.log(d.data.mimeType , " : ", mapColor(d.data.mimeType));
					return mapColor(d.data.langType);
				})
				.attr('d', arc);
		
		var tooltip = d3.select('body').append('div')
			.style('position', 'absolute')
			.style('padding', '0 10px')
			.style('background', 'white')
			.style('opacity', 1)
			.style('display', 'none')
			.attr('id',idJsonFile);
			
		var tempColor;

		var text = svg.selectAll('g.slice')
			.on('mouseover', function(d) {
				//console.log(d);
				tooltip.transition()
					.style('opacity', .9)
					.style('display', 'block')
					.style('z-index', 10);
				//console.log(d.data.mimeType);
				tooltip.html(d.data.langType + " : " + mapNames(d.data.langType) + " : " + d.data.count)
					.style('left', (d3.event.pageX - 35) + 'px')
					.style('top',  (d3.event.pageY - 30) + 'px')


				tempColor = this.style.fill;
				d3.select(this)
					.style('opacity', .5)
					.style('fill', 'yellow')
			})

			.on('mouseout', function(d) {
					tooltip.html("")
					tooltip.transition()
						.style('opacity', 0)
						.style('display', 'none');
					d3.select(this)
					.style('opacity', 1)
					.style('fill', tempColor)
			})
	});
}

langDiversityAnalysis("langDiversity.json");


	var sum=0;
	window.onload = function() {
		var selection = d3.select("#language_select")
		d3.json('../../data/team24/solr_response_lang_parsed.json', function(error,data) {
		  data.forEach(function(d) {
			selection.append("option")
					.text(d.text)
					.attr('value',d.size)
			sum+=d.size;
		  });
		});
		selection.on('change', function() {
			var valueSelected = d3.event.target.value;  
			display_data(valueSelected);
		});
	}

	var svg = d3.select("#speedometer")
	.append("svg:svg")
	.attr("width", 900)
	.attr("height", 700);

	var gauge = iopctrl.arcslider()
			.radius(275)
			.events(false)
			.indicator(iopctrl.defaultGaugeIndicator);
	gauge.axis().orient("in")
			.normalize(true)
			.ticks(12)
			.tickSubdivide(4)
			.tickSize(10, 10, 10)
			.tickPadding(5)
			.scale(d3.scale.linear()
					.domain([0, 100])
					.range([-3*Math.PI/4, 3*Math.PI/4]));

	var segDisplay = iopctrl.segdisplay()
			.width(80)
			.digitCount(6)
			.negative(false)
			.decimals(0);

	svg.append("g")
			.attr("class", "segdisplay")
			.attr("transform", "translate(275, 500)")
			.call(segDisplay);

	svg.append("g")
			.attr("class", "gauge")
			.call(gauge);

	function display_data(data) {
		segDisplay.value(data);
		gauge.value(data/sum*100);
		console.log(data)
	}

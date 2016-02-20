/*
 * d3 elements (https://bitbucket.org/artstr/d3elements.git)
 * Copyright 2014 Artana Pty Ltd
 * Licensed under MIT (https://bitbucket.org/artstr/d3elements/src/master/LICENSE)
 */
/* global d3: true, _, console */

var d3 = (function (d3, _) {
	"use strict";
	// requires d3 & underscorejs
	// adds d3.elts.timeSeriesChart

	function timeSeriesChart() {
		// based on http://bost.ocks.org/mike/chart/time-series-chart.js
		// note this uses underscore.js (just for _.map)
		// The x-accessor for the path generator; xScale ∘ xValue.
		function xX(d) {
			return xScale(d[0]);
		}
		// The x-accessor for the path generator; yScale ∘ yValue.
		function yY(d) {
			return yScale(d[1]);
		}
		var margin = {top: 10, right: 20, bottom: 120, left: 60},
			width = 760,
			height = 120,
			duration = 500,
			svgClass = "time-series-chart",
			highlightedAreaClass = "highlighted-area",
			gradientId = "gradient-timeseries-fill",
			xValue = function(d) { return d[0]; },  // eg. to read date strings myChart.x(function(d) { return d3.time.format("%Y%m%d").parse(d[0]); })
			yValue = function(d) { return +d[1]; },
			xScale = d3.time.scale(),
			yScale = d3.scale.linear(),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
			xAxisText = function(textSel) {  // rotates x labels 90 degrees
							textSel.attr("x", -8)
								.attr("y", 0)
								.attr("dy", ".35em")
								.attr("transform", "rotate(-90)")
								.style("text-anchor", "end");
						},
			yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6).tickSize(6, 0),
			smartYFormat = false, // nicely chooses %s for small y-values
			area = d3.svg.area().x(xX).y1(yY),
			line = d3.svg.line().x(xX).y(yY),
			strokeColor = "gray",
			fillColor = ["lightgray", "gray"],  // uses a gradient
			strokeWidth = 1,
			rangeWidget = null,
			maxNotes = 7,
			notes = null, // eg. an array of objects {startDate: x1, endDate: x2, priority: 1, ... } 
			              // (only startDate and endDate, in the same format as the dates in the main data, are required by this code)
			notesMarkerAttr = {r: 10, stroke: 'white', 'stroke-width': 1}, // a dict of attributes to apply to the notes markers
			notesMarkerStyle = {opacity: 0.82}, // a dict of attributes to apply to the notes markers
			notesMarkerDuration = 500,
			// function called when notes marker is clicked; must call the close handler to hide highlighted range
			notesMarkerClick = function(elt, note, closeHandler) { console.log(elt, note, closeHandler); },
			notesUniqueId = function(d) { return [d.startDate, d.endDate, d.title].join("-")}, // a function to unique identify each note
			xDomain = null, // set this to restrict the x domain
			highlightRange = null,
			onRangeChange = function() {}; // function(data, start, end) {} - hook to eg. show stats on selected range; start & end optional.

		var fullXDomain;

		function update(elt, data) {
			// call with raw data if that's all you've got, otherwise you can pass the processed data
			var heightWithoutRange = height - (rangeWidget ? rangeWidget.height() : 0);

			fullXDomain = d3.extent(data, function(d) { return d[0]; });
			if (!xDomain) { xDomain = fullXDomain }

			var bisect = d3.bisector(function(d) { return d[0] }).left;
			_.each(notes, function(note) {
				// TODO - can we generalize to allow formats other than [x,y] ?
				note.start = xValue([note.startDate]);
				note.end = xValue([note.endDate || note.startDate]);
				note.show = (note.start>=xDomain[0]) && (note.start<=xDomain[1]); // currently only show if start date visible, could change this
				note.startPos = bisect(data, note.start);
				note.endPos = bisect(data, note.end);
				if (note.startPos>=0 && note.startPos<data.length) {
					note.startY = data[note.startPos][1];
				} else {
					note.startY = 0;
				}
			});

			// decide which notes to show based on priority. The num showing must be less than maxNotes.
			// keep hiding higher and higher priority notes until we come in under the max.
			// if no notes have a priority field, better skip this step
			var minShowingPriority = _.min(notes, function(note) {if (note.show) { return note.priority || 0 } else { return 1e6 }}).priority;
			function hideLowPriority(note) { 
				if (note.priority===minShowingPriority) { 
					note.show = false;
				} 
			}
			function notePriority(note) {
				if (note.show) { 
					return note.priority || 0;
				} else { 
					return 1e6;
				}
			}
			while ( (_.filter(notes, function(note) { return note.show }).length > maxNotes) && (typeof minShowingPriority!=="undefined")) {
				// hide notes with the min showing priority
				_.each(notes, hideLowPriority);
				minShowingPriority = _.min(notes, notePriority).priority;
			}

			//console.log("time series chart "+margin.right);
			// Update the x-scale.
			xScale
				.domain(xDomain)
				.range([0, width - margin.left - margin.right]);

			// if you bind the full data, then it shows throught the margins (eg. overlapping the y-axis)
			var subdata = _.filter(data, function(d) { return (d[0]>=xDomain[0] && d[0]<=xDomain[1])});

			// Update the y-scale.
			yScale
				.domain([d3.min(data, function(d) { return d[1]; }), d3.max(data, function(d) { return d[1]; })])
				.range([heightWithoutRange - margin.top - margin.bottom -50	, 0]);

			// Select the svg element, if it exists.
			var svg = d3.select(elt).selectAll("svg."+svgClass).data([subdata]);

			// Otherwise, create the chart.
			var svgEnter = svg.enter().append("svg");
			var gEnter = svgEnter.attr("class",svgClass).append("g");

			// Set up the area fill gradient
			var gradient = gEnter.append("linearGradient")
				.attr("id", gradientId)
				.attr("x1", 0).attr("x2", 1).attr("y1", 0).attr("y2", 0); // horizontal
			gradient.append("stop")
				.attr("class", "stop-1")
				.attr("offset", "0%")
				.attr("stop-color", fillColor[0]);
			gradient.append("stop")
				.attr("class", "stop-2")
				.attr("offset", "100%")
				.attr("stop-color", fillColor[1]);

			gEnter.append("path")
				.attr("class", "area")
				.attr("fill", "url(#"+gradientId+")")
				.attr("d", d3.svg.area().x(xX).y1(function(){return yScale(0)}).y0(yScale(0)));

			gEnter.append("path")
				.attr("class", "line")
				.attr("stroke",strokeColor)
				.attr("stroke-width",strokeWidth)
				.attr("fill", "none")
				.attr("d", d3.svg.line().x(xX).y(function(){return yScale(0)}));

			gEnter.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + yScale(0) + ")");

			gEnter.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + xScale(0) + ",0)");

			gEnter.append("g")
				.attr("class", "notes");

			// Update the outer dimensions.
			svg .attr("width", width)
					.attr("height", heightWithoutRange);

			// Update the inner dimensions.
			var g = svg.select("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Update the area path.
			g.select(".area")
				.transition()
					.duration(duration)
				.attr("d", area.y0(yScale(0)));

			// Update the gradient (since the gradient id stays the same, no need to change the circles' fill)
			g.select("#"+gradientId+" stop.stop-1").transition().duration(duration).attr("stop-color", fillColor[0]);
			g.select("#"+gradientId+" stop.stop-2").transition().duration(duration).attr("stop-color", fillColor[1]);

			// Update the line path.
			g.select(".line")
				.transition()
				.duration(duration)
				.attr("stroke",strokeColor)
				.attr("stroke-width",strokeWidth)
				.attr("d", line);

			// Update the x-axis.
			g.select(".x.axis")
				.transition()
				.duration(duration)
				.attr("transform", "translate(0," + yScale.range()[0] + ")")
				.call(xAxis)
	 				.selectAll("text")
					.call(xAxisText);
			g.select(".x.axis")
					.selectAll("text")
					.call(xAxisText);

			// Update the y-axis
			if (smartYFormat) {
				var absMax = Math.max( Math.abs(yScale.domain()[0]), Math.abs(yScale.domain()[1]) );
				if (absMax>2) {
					yAxis.tickFormat(d3.format("g"));
				} else if (absMax>=0.04) {
					yAxis.tickFormat(d3.format("%"));
				} else if (absMax>0.003) {
					yAxis.tickFormat(d3.format(".1%"));
				} else if (absMax>0.0003) {
					yAxis.tickFormat(d3.format(".2%"));
				} else {
					yAxis.tickFormat(d3.format("g"));
				}
			}
			g.select(".y.axis")
				.transition()
				.duration(duration)
				.attr("transform", "translate(" + xScale.range()[0] + ", 0)")
				.call(yAxis);

			// Update highlighted parts of the domain
			var highlightData = highlightRange ? data.slice(highlightRange[0],highlightRange[1]+1) : [];
			var gHighlight = g.selectAll("."+highlightedAreaClass).data([highlightData]);
			gHighlight.enter().append("path")
				.attr("class", highlightedAreaClass);
			gHighlight
				.attr("fill", "#000000")
				.style("opacity", 0.2)  // TODO: generalise?
				.attr("d", area.y0(yScale(0)));

			// Update the notes. Since duration can be set to zero when the range slider is in use, uses a separate "notesMarkerDuration"

			var gNotes = g.select(".notes").selectAll(".note").data(
					_.filter(notes, function(d) { return d.show && (d.priority||0)>=(minShowingPriority||0) }),
					notesUniqueId
				); 
			gNotes.enter()
				.append("circle")
				.attr("class", "note")
				.attr("r", 0)
				.style("opacity", 1e-6)
				.attr("fill", strokeColor)
				.attr("cy", function(d) {return yScale(d.startY)})
				.style("cursor", "pointer");

			if (duration===0) { gNotes.attr("cx", function(d) {return xScale(d.start)}); } // make note markers move promptly if slider moved
			gNotes
				.on("click", function(d) { 
					notesMarkerClick(this, d, noteCloseHandler);
					highlightRange = [d.startPos, d.endPos];
					update(elt, data);
				})
				.transition()
					.duration(duration)
					.attr("fill", strokeColor)
					.attr("cx", function(d) {return xScale(d.start)})  // or slower if the notes themselves have moved (eg with new data)
					.attr("cy", function(d) {return yScale(d.startY)})
				.transition()
					.duration(duration)
						.attr(notesMarkerAttr)
						.style(notesMarkerStyle);
			gNotes.exit()//.transition()
				//.duration(notesMarkerDuration)
					//.attr("r", 0)
					//.style("opacity", 1e-6)
					.remove();

			function noteCloseHandler() {
				highlightRange = [];
				update(elt, data);
			}

		}

		function chart(selection) {
			selection.each(function(rawData) {
				var elt = this;
				// Convert data to standard representation greedily;
				// this is needed for nondeterministic accessors.
				var data = _.map(rawData, function(d, i) {
					return [xValue.call(rawData, d, i), yValue.call(rawData, d, i)];
				});
				// whenever this is called with new data, remove the highlighted range
				highlightRange = [];
				notesMarkerClick();

				update(elt, data);
				if (xDomain) {
					onRangeChange(data, xDomain[0], xDomain[1]);
				} else {
					onRangeChange(data);
				}

				// Update the range widget, if present
				// don't put this in the update method or it becomes circular
				if (rangeWidget) {
					rangeWidget.width(width).margin({top:0, right:margin.right, bottom:0, left:margin.left});
					rangeWidget.onDrag(function(start, end) { 
						xDomain = [start, end]; 
						var oldDur = duration;
						duration = 0;
						update(elt, data);
						duration = oldDur;
						onRangeChange(data, start, end);
					});
					d3.select(elt).datum([{
							scale: xScale.copy().domain(fullXDomain),
							start: xDomain ? xDomain[0] : fullXDomain[0], 
							end: xDomain ? xDomain[1] : fullXDomain[1]
						}]).call(rangeWidget);
				}
			});
		}

		chart.margin = function(_) {
			if (!arguments.length) return margin;
			margin = _;
			return chart;
		};

		chart.width = function(_) {
			if (!arguments.length) return width;
			width = _;
			return chart;
		};

		chart.height = function(_) {
			if (!arguments.length) return height;
			height = _;
			return chart;
		};

		chart.duration = function(_) {
			if (!arguments.length) return duration;
			duration = _;
			return chart;
		};

		chart.x = function(_) {
			if (!arguments.length) return xValue;
			xValue = _;
			return chart;
		};

		chart.y = function(_) {
			if (!arguments.length) return yValue;
			yValue = _;
			return chart;
		};

		chart.xAxis = function(_) {
			if (!arguments.length) return xAxis;
			xAxis = _;
			return chart;
		};

		chart.yAxis = function(_) {
			if (!arguments.length) return yAxis;
			yAxis = _;
			return chart;
		};

		chart.xAxisText = function(_) {
			if (!arguments.length) return xAxisText;
			xAxisText = _;
			return chart;
		};

		chart.smartYFormat = function(_) {
			if (!arguments.length) return smartYFormat;
			smartYFormat = _;
			return chart;
		};

		chart.strokeWidth = function(_) {
			if (!arguments.length) return strokeWidth;
			strokeWidth = _;
			return chart;
		};

		chart.strokeColor = function(_) {
			if (!arguments.length) return strokeColor;
			strokeColor = _;
			return chart;
		};

		chart.fillColor = function(_) {
			if (!arguments.length) return fillColor;
			fillColor = _;
			return chart;
		};

		chart.xDomain = function(_) {
			if (!arguments.length) return xDomain;
			xDomain = _;
			return chart;
		};

		chart.maxNotes = function(_) {
			if (!arguments.length) return maxNotes;
			maxNotes = _;
			return chart;
		};

		chart.notes = function(_) {
			if (!arguments.length) return notes;
			notes = _;
			return chart;
		};

		chart.notesMarkerAttr = function(_) {
			if (!arguments.length) return notesMarkerAttr;
			notesMarkerAttr = _;
			return chart;
		};

		chart.notesMarkerStyle = function(_) {
			if (!arguments.length) return notesMarkerStyle;
			notesMarkerStyle = _;
			return chart;
		};

		chart.notesMarkerClick = function(_) {
			if (!arguments.length) return notesMarkerClick;
			notesMarkerClick = _;
			return chart;
		};

		chart.notesMarkerDuration = function(_) {
			if (!arguments.length) return notesMarkerDuration;
			notesMarkerDuration = _;
			return chart;
		};

		chart.notesUniqueId = function(_) {
			if (!arguments.length) return notesUniqueId;
			notesUniqueId = _;
			return chart;
		};

		chart.rangeWidget = function(_) {
			if (!arguments.length) return rangeWidget;
			rangeWidget = _;
			return chart;
		};

		chart.highlightRange = function(_) {
			if (!arguments.length) return highlightRange;
			highlightRange = _;
			return chart;
		};

		chart.onRangeChange = function(_) {
			if (!arguments.length) return onRangeChange;
			onRangeChange = _;
			return chart;
		};

		chart.svgClass = function(_) {
			if (!arguments.length) return svgClass;
			svgClass = _;
			return chart;
		};

		chart.highlightedAreaClass = function(_) {
			if (!arguments.length) return highlightedAreaClass;
			highlightedAreaClass = _;
			return chart;
		};

		chart.gradientId = function(_) {
			if (!arguments.length) return gradientId;
			gradientId = _;
			return chart;
		};

		return chart;
	}


	// attach timeSeriesChart to d3.elts
	if (typeof d3.elts==="undefined") {
		d3.elts = {};
	}
	d3.elts.timeSeriesChart = timeSeriesChart;
	return d3;

}(d3, _));

/*
 * d3 elements (https://bitbucket.org/artstr/d3elements.git)
 * Copyright 2014 Artana Pty Ltd
 * Licensed under MIT (https://bitbucket.org/artstr/d3elements/src/master/LICENSE)
 */
/* global d3: true, _ */

var d3 = (function (d3, _) {
	"use strict";
	// requires d3 & underscorejs
	// adds d3.elts.startEndSlider
	
	function startEndSlider() {
		// a reusable d3 element
		// approach based on http://bost.ocks.org/mike/chart/
		// call this as, eg.:
		//    var mySlider = d3.elts.startEndSlider(); 
		//    d3.select('body').datum([{start: new Date("2001-01-01"), end: new Date("2002-01-01")}]).call(mySlider);

		var margin = {top: 0, right: 0, bottom: 0, left: 0}, // but note horizontal sliders are centered vertically
			width = 500,
			height = 30,
			// this is a default scale; it is overridden by any scales provided in the data
			// the scale doesn't have to be a time scale, but does need the domain specified (but not the range)
			// you can't use it with an ordinal scale - instead, pass a linear scale which is based on position in the ordinal scale
			// (you'll need to apply Math.round() to the resulting start and end positions)
			scale = d3.time.scale().domain([new Date("2000-01-01"),new Date("2004-12-31")]),
			// same deal with minRange and maxRange
			minRange = 365*24*3600*1000,
			maxRange = null,
			strokeColor = "gray",  // constant or function
			strokeWidth = 1,
			betweenRectHeight = 20,
			knobFill = "#666",  // constant or function
			knobWidth = 12,
			fillColor = ["lightgray", "gray"],  // uses a gradient between these
			onDrag = function() { },          // function(start, end) { } - callback while dragging
			onDragStart = function() { },     // function(start, end) { } - callback on drag started
			onDragEnd = function() { },       // function(start, end) { } - callback on drag ended
			svgClass = "start-end-slider",
			gradientId = "gradient-startendslider";

		var innerHeight,
			innerWidth,
			localScales
			;

		function chart(selection) {
			// the data should be of the format:
			// { scale: d3.time.scale().domain([new Date("2000-01-01"),new Date("2004-12-31")]), // optional
			//   minRange: ???, // optional, defaults to zero
			//   maxRange: ???, // optional, defaults to full extent
			//   start: ,  // default start position
			//   end: ,    // default end position
			// }

			function thisMinRange(d) {
				if (typeof d.minRange==="undefined") {
					return minRange || 0;
				} else {
					return d.minRange;
				}
			}
			function thisMaxRange(d) {
				if (typeof d.maxRange==="undefined") {
					return maxRange;
				} else {
					return d.maxRange;
				}
			}

			var accumDx = 0;

			function dragBetweenSlider(d, i) {
				/*jshint validthis: true */
				var partialDx = 0;
				var elt = d3.select(this);
				var startKnob = d3.select(this.parentNode).select(".slider-start");
				var endKnob = d3.select(this.parentNode).select(".slider-end");
				var newx = +elt.attr("x") + accumDx + d3.event.dx - partialDx;
				if (newx<0 && accumDx===0) {
					partialDx = newx;
					newx = 0;
				}
				var endx = +endKnob.attr("x") + accumDx + d3.event.dx - partialDx; // note this is the left of the end knob, not the right
				if (endx+knobWidth>innerWidth && accumDx===0) {
					partialDx = endx+knobWidth-innerWidth;
					endx = innerWidth - knobWidth;
					newx -= partialDx;
				}
				if (newx>=0 && endx+knobWidth<=innerWidth) {
					elt.attr("x", newx);
					startKnob.attr("x", newx);
					endKnob.attr("x", endx);
					d.start = localScales[i].invert(newx);
					d.end = localScales[i].invert(endx+knobWidth);
					accumDx = partialDx;
				} else {
					accumDx += d3.event.dx;
				}
			}

			function dragStartKnob(d, i) {
				/*jshint validthis: true */
				var elt = d3.select(this);
				var between = d3.select(this.parentNode).select(".slider-between");
				var newx = d3.event.x;
				if (newx<0) { newx = 0; }
				var newWidth = (+between.attr("x")+(+between.attr("width"))-newx);
				if (newx>=0 && newx<=innerWidth && 
							(d.end-localScales[i].invert(newx))>=thisMinRange(d,i) &&
							(!thisMaxRange(d,i) || (d.end-localScales[i].invert(newx))<=thisMaxRange(d,i))) {
					elt.attr("x", newx);
					between.attr("x", newx);
					between.attr("width", newWidth);
					d.start = localScales[i].invert(newx);
				}
			}

			function dragEndKnob(d, i) {
				/* jshint validthis: true */
				var elt = d3.select(this);
				var between = d3.select(this.parentNode).select(".slider-between");
				var newx = d3.event.x;
				if (newx>innerWidth-knobWidth) { newx = innerWidth-knobWidth; }
				var newWidth = (newx-(+elt.attr("x"))+(+between.attr("width")));
				if (newx>=0 && newx<=innerWidth-knobWidth &&
							(localScales[i].invert(newx) - d.start)>=thisMinRange(d,i) &&
							(!thisMaxRange(d,i) || (localScales[i].invert(newx)-d.start)<=thisMaxRange(d,i))) {
					elt.attr("x", newx);
					between.attr("width", newWidth);
					d.end = localScales[i].invert(newx);
				}
			}

			selection.each(function(data) {

				var elt = d3.select(this);

				innerHeight = height - margin.top - margin.bottom;
				innerWidth = width - margin.left - margin.right;
				localScales = [];

				_.each(data, function(d) {
					if (typeof d.scale!=="undefined") {
						localScales.push(d.scale.range([0, innerWidth]));
					} else {
						localScales.push(scale.range([0, innerWidth]));
					}
				});

				// Select the svg element, if it exists.
				var svg = elt.selectAll("svg."+svgClass).data(data);

				// Otherwise, create it and the slider.
				var svgEnter = svg.enter().append("svg");
				var gEnter = svgEnter.attr("class",svgClass).append("g");

				// function setCursor(value) {
				// 	if (!value) {
				// 		elt.style("cursor","auto");
				// 		elt.select(".slider-between").style("cursor", "grab");
				// 		elt.select(".slider-start").style("cursor", "ew-resize");
				// 		elt.select(".slider-end").style("cursor", "ew-resize");
				// 	} else {
				// 		elt.style("cursor",value);
				// 		elt.select(".slider-between").style("cursor", value);
				// 		elt.select(".slider-start").style("cursor", value);
				// 		elt.select(".slider-end").style("cursor", value);
				// 	}
				// }

				// A function which returns a drag behaviour which calls ondrag
				function drag(doOnDrag, cursorVal) {
					return d3.behavior.drag()
						.on("drag", function(d,i) { doOnDrag.call(this, d,i); onDrag(d.start, d.end); })
						.on("dragstart", function(d) {
							onDragStart(d.start, d.end); 
							accumDx = 0; 
							if (cursorVal==="grabbing") { d3.select(this).style("cursor", "grabbing"); }
							//if (cursorVal) { setCursor(cursorVal); }
						})
						.on("dragend", function(d) {
							onDragEnd(d.start, d.end); 
							if (cursorVal==="grabbing") { d3.select(this).style("cursor", "grab"); }
							//if (cursorVal) { setCursor(null); }
						});
				}

				// Set up a gradient
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

				gEnter.append("line")
					.attr("class", "slider-full-line")
					.attr("stroke", d3.functor(strokeColor))
					.attr("stroke-width", strokeWidth)
					.attr("x1", 0)
					.attr("y1", innerHeight/2)
					.attr("x2", innerWidth)
					.attr("y2", innerHeight/2);
				gEnter.append("rect")
					.attr("class", "slider-between");
				gEnter.append("rect")
					.attr("class", "slider-start");
				gEnter.append("rect")
					.attr("class", "slider-end");

				var g = svg.select("g");
				g.select(".slider-between")
					.attr("fill","url(#"+gradientId+")")
					.attr("x", function(d,i) { return localScales[i](d.start)})
					.attr("y", (innerHeight-betweenRectHeight)/2)
					.attr("width", function(d,i) { return localScales[i](d.end)-localScales[i](d.start)})
					.attr("height", betweenRectHeight)
					.style("cursor", "grab")
					.call(drag(dragBetweenSlider, "grabbing"));
				g.select(".slider-start").attr("fill", d3.functor(knobFill))
					.attr("x", function(d,i) { return localScales[i](d.start)})
					.attr("y", (innerHeight-betweenRectHeight)/2)
					.attr("width", knobWidth)
					.attr("height", betweenRectHeight)
					.style("cursor", "ew-resize")
					.call(drag(dragStartKnob, "ew-resize"));
				g.select(".slider-end").attr("fill", d3.functor(knobFill))
					.attr("x", function(d,i) { return localScales[i](d.end)-knobWidth})
					.attr("y", (innerHeight-betweenRectHeight)/2)
					.attr("width", knobWidth)
					.attr("height", betweenRectHeight)
					.style("cursor", "ew-resize")
					.call(drag(dragEndKnob));
					// drag() should be called with 2nd arg "ew-resize" 
					// but this crashes on the second resize with Mac Firefox 32.0 at least
					// it makes no sense...  

				// Update the outer dimensions.
				svg .attr("width", width)
						.attr("height", height);

				// Update the inner dimensions.
				g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// Update the line path.
				g.select(".line")
					.attr("stroke",strokeColor)
					.attr("stroke-width",strokeWidth);

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

		chart.scale = function(_) {
			if (!arguments.length) return scale;
			scale = _;
			return chart;
		};

		chart.minRange = function(_) {
			if (!arguments.length) return minRange;
			minRange = _;
			return chart;
		};

		chart.maxRange = function(_) {
			if (!arguments.length) return maxRange;
			maxRange = _;
			return chart;
		};

		chart.strokeColor = function(_) {
			if (!arguments.length) return strokeColor;
			strokeColor = _;
			return chart;
		};

		chart.strokeWidth = function(_) {
			if (!arguments.length) return strokeWidth;
			strokeWidth = _;
			return chart;
		};

		chart.betweenRectHeight = function(_) {
			if (!arguments.length) return betweenRectHeight;
			betweenRectHeight = _;
			return chart;
		};

		chart.knobFill = function(_) {
			if (!arguments.length) return knobFill;
			knobFill = _;
			return chart;
		};

		chart.knobWidth = function(_) {
			if (!arguments.length) return knobWidth;
			knobWidth = _;
			return chart;
		};

		chart.fillColor = function(_) {
			if (!arguments.length) return fillColor;
			fillColor = _;
			return chart;
		};

		chart.onDrag = function(_) {
			if (!arguments.length) return onDrag;
			onDrag = _;
			return chart;
		};
		chart.onDragEnd = function(_) {
			if (!arguments.length) return onDragEnd;
			onDragEnd = _;
			return chart;
		};
		chart.onDragStart = function(_) {
			if (!arguments.length) return onDragStart;
			onDragStart = _;
			return chart;
		};

		chart.svgClass = function(_) {
			if (!arguments.length) return svgClass;
			svgClass = _;
			return chart;
		};

		chart.gradientId = function(_) {
			if (!arguments.length) return gradientId;
			gradientId = _;
			return chart;
		};

		return chart;
	}

	// attach startEndSlider to d3.elts
	if (typeof d3.elts==="undefined") {
		d3.elts = {};
	}
	d3.elts.startEndSlider = startEndSlider;
	return d3;

}(d3, _));

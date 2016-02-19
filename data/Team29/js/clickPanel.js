/*
 * d3 elements (https://bitbucket.org/artstr/d3elements.git)
 * Copyright 2014 Artana Pty Ltd
 * Licensed under MIT (https://bitbucket.org/artstr/d3elements/src/master/LICENSE)
 */

var d3 = (function (d3) {
	"use strict";
	// requires d3
	// adds d3.elts.makeClickPanel

	var makeClickPanel = function(selector) {
		// Make a panel if needed, in the supplied element selector (defaults to "body")
		// Returns a function which other widgets can use to show html in the click panel
		// And includes a dismiss button (x)
		// You can dismiss by calling clickPanel()
		//
		var clickDiv = null,
			offset = {top: 20, left: 11},
			opacity = 0.9,
			autoCloseDuration = 500;

		function clickPanel (elt, html, closeHandler) {
			// if this is called with no arguments, then it is a request to close the panel
			if (typeof elt==="undefined") {
				//console.log("closing");
				clickDiv.transition()
					.duration(autoCloseDuration)
						.style("opacity", 1e-6)
					.transition()
						.style("z-index", "-1")
						.style("visibility", "hidden");
			} else {
				clickDiv.select(".click-panel-body").html(html); // put this first so the width is known below

				clickDiv
					.style("top", function () { 
						return Math.min((d3.event.pageY - offset.top), Math.max(5,window.innerHeight-clickDiv[0][0].offsetHeight))+"px";
					})
					.style("left", function () { 
						return Math.max(offset.left, d3.event.pageX - offset.left - clickDiv[0][0].offsetWidth)+"px";
					}) 
					.style("visibility", "visible")
					.style("z-index", "5")
					.style("opacity", 1e-6)
					.transition()
						.style("opacity", opacity);

				clickDiv.select(".close").on("click", function() {
					clickDiv
						.transition()
							.style("opacity", 1e-6)
							.style("z-index", "-1")
							.style("visibility", "hidden");
					closeHandler();
				});
			}
		}

		// Make the click panel element if needed
		if (typeof selector === "undefined") { selector = "body"; }
		clickDiv = d3.select(selector).selectAll("div.click-panel").data(["dummy"]);
		var panel = clickDiv.enter().append("div").attr("class","click-panel");
		panel.append("div").attr("class","close").html("&times;");
		panel.append("div").attr("class","click-panel-body");

		clickPanel.offset = function(_) {
			if (!arguments.length) return offset;
			offset = _;
			return clickPanel;
		};

		clickPanel.opacity = function(_) {
			if (!arguments.length) return opacity;
			opacity = _;
			return clickPanel;
		};

		clickPanel.autoCloseDuration = function(_) {
			if (!arguments.length) return autoCloseDuration;
			autoCloseDuration = _;
			return clickPanel;
		};

		return clickPanel;

	};

	// attach to d3.elts
	if (typeof d3.elts==="undefined") {
		d3.elts = {};
	}
	d3.elts.makeClickPanel = makeClickPanel;
	return d3;

}(d3));

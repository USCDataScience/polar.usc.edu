function load_dashboard(){
	console.log("in collapsible tree search");
	// var url='http://localhost:8983/solr/collection2/select?q=Duration%3A*&rows=500&fl=Content-Type%2C+Duration&wt=json&indent=true';
 	// $.getJSON(url);
 	on_data();

}
function on_data(){

  d3.json("../../data/manalishahenv/durations.json", function(error, data) {
            if (error) throw error;
            var types = {};

        docs = data.response.docs;
    	var totaldocs = data.response.numFound;

			for(var i=0; i<docs.length; i++){
				var content_type = docs[i]["Content-Type"];
				var duration = docs[i]["Duration"];
				if(!types[content_type]){
					var array = [];
					array.push(seconds(duration));
					types[content_type] = array;
				}
				else{
					types[content_type].push(seconds(duration));
				}
			}
            freq0 = {};
            for( var z in types){
                freq0[z] = 0;
            }
			freq1 = {};
			for( var z in types){
				freq1[z] = 0;
			}
            freq2 = {};
            for( var z in types){
                freq2[z] = 0;
            }
            freq3 = {};
            for( var z in types){
                freq3[z] = 0;
            }
            freq4 = {};
            for( var z in types){
                freq4[z] = 0;
            }
            freq5 = {};
            for( var z in types){
                freq5[z] = 0;
            }
            freq6 = {};
            for( var z in types){
                freq6[z] = 0;
            }
            freq7 = {};
            for( var z in types){
                freq7[z] = 0;
            }
            freq8 = {};
            for( var z in types){
                freq8[z] = 0;
            }
            freq9 = {};
            for( var z in types){
                freq9[z] = 0;
            }
            freq10 = {};
            for( var z in types){
                freq10[z] = 0;
            }


			final_json = []
			range100 = {"Range":"<100", "freq":freq0};
			range200 = {"Range":"<200", "freq":freq1};
			range300 = {"Range":"<300", "freq":freq2};
			range400 = {"Range":"<400", "freq":freq3};
			range500 = {"Range":"<500", "freq":freq4};
			range600 = {"Range":"<600", "freq":freq5};
			range700 = {"Range":"<700", "freq":freq6};
			range800 = {"Range":"<800", "freq":freq7};
			range900 = {"Range":"<900", "freq":freq8};
			range1000 = {"Range":"<1000", "freq":freq9};
			range = {"Range":" >1000", "freq":freq10};
			for(var z in types){
				var media = types[z];
				for(var i=0; i<media.length; i++){
					var sec = media[i];
					if(media[i] < 100)
						range100["freq"][z] = range100["freq"][z] +1;
					else if(media[i] >= 100 && media[i] < 200)
						range200["freq"][z] = range200["freq"][z] +1;
					else if(media[i] >= 200 && media[i] < 300)
						range300["freq"][z] = range300["freq"][z] +1;
					else if(media[i] >= 300 && media[i] < 400)
						range400["freq"][z] = range400["freq"][z] +1;
					else if(media[i] >= 400 && media[i] < 500)
						range500["freq"][z] = range500["freq"][z] +1;
					else if(media[i] >= 500 && media[i] < 600)
						range600["freq"][z] = range600["freq"][z] +1;
					else if(media[i] >= 600 && media[i] < 700)
						range700["freq"][z] = range600["freq"][z] +1;
					else if(media[i] >= 700 && media[i] < 800)
						range800["freq"][z] = range800["freq"][z] +1;
					else if(media[i] >= 800 && media[i] < 900)
						range900["freq"][z] = range900["freq"][z] +1;
					else if(media[i] >= 900 && media[i] < 1000)
						range1000["freq"][z] = range1000["freq"][z] +1;
					else
						range["freq"][z] = range["freq"][z] +1;
				}
			}
			final_json.push(range100);
			final_json.push(range200);
			final_json.push(range300);
			final_json.push(range400);
			final_json.push(range500);
			final_json.push(range600);
			final_json.push(range700);
			final_json.push(range800);
			final_json.push(range900);
			final_json.push(range1000);
            final_json.push(range);
            function seconds(s){
            	var val = s.split(' ');
            	var time = val[0].split(':');
            	var total = 0
                
        		
            	if(time[2])
            		total = Math.round(3600*parseFloat(time[2])) + Math.round(parseFloat(time[0])) +Math.round(60*parseFloat(time[1]));
                else if(time[1])
                    total = Math.round(parseFloat(time[0])) + Math.round(60*parseFloat(time[1]));
                else if (time[0])
                    total =  Math.round(parseFloat(time[0]));
            	return total;
            }

            dashboard('#dashboard', final_json);
        });


	 function dashboard(id, data) {
            var barColor = '#9ecae1';
            function segColor(c) {
                return { "image/gif": "#bcbddc", "audio/mpeg": "#feb24c", "audio/x-aiff": "#2ca25f", "audio/x-wav": "#fa9fb5", "video/x-flv": "#ffeda0"}[c];
            }

            // var all_media = []
            // for(f in data){
            // 	var z = data[f];
            // 	for(val in z)
            // 		all_media.push(val);
            // 	break;
            // }

            // compute total for each content-type.
            data.forEach(function(d) {
                d.total = d.freq['audio/mpeg'] + d.freq['audio/x-aiff'] + d.freq['audio/x-wav'] + d.freq['image/gif'] + d.freq['video/x-flv'];
            });
            // function to handle histogram.
            function histoGram(fD) {
                var hG = {},
                    hGDim = {
                        t: 60,
                        r: 0,
                        b: 30,
                        l: 0
                    };
                hGDim.w = 500 - hGDim.l - hGDim.r,
                    hGDim.h = 300 - hGDim.t - hGDim.b;
                //create svg for histogram.
                var hGsvg = d3.select(id).append("svg")
                    .attr("width", hGDim.w + hGDim.l + hGDim.r)
                    .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
                    .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");
                // create function for x-axis mapping.
                var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                    .domain(fD.map(function(d) {
                        return d[0];
                    }));
                // Add x-axis to the histogram svg.
                hGsvg.append("g").attr("class", "x axis")
                    .attr("transform", "translate(0," + hGDim.h + ")")
                    .call(d3.svg.axis().scale(x).orient("bottom"));
                // Create function for y-axis map.
                var y = d3.scale.linear().range([hGDim.h, 0])
                    .domain([0, d3.max(fD, function(d) {
                        return d[1];
                    })]);
                // Create bars for histogram to contain rectangles and freq labels.
                var bars = hGsvg.selectAll(".bar").data(fD).enter()
                    .append("g").attr("class", "bar");
                //create the rectangles.
                bars.append("rect")
                    .attr("x", function(d) {
                        return x(d[0]);
                    })
                    .attr("y", function(d) {
                        return y(d[1]);
                    })
                    .attr("width", x.rangeBand())
                    .attr("height", function(d) {
                        return hGDim.h - y(d[1]);
                    })
                    .attr('fill', barColor)
                    .on("mouseover", mouseover) // mouseover is defined below.
                    .on("mouseout", mouseout); // mouseout is defined below.
                //Create the frequency labels above the rectangles.
                bars.append("text").text(function(d) {
                        return d3.format(",")(d[1])
                    })
                    .attr("x", function(d) {
                        return x(d[0]) + x.rangeBand() / 2;
                    })
                    .attr("y", function(d) {
                        return y(d[1]) - 5;
                    })
                    .attr("text-anchor", "middle");
                function mouseover(d) { // utility function to be called on mouseover.
                    // filter for selected Range.
                    var st = data.filter(function(s) {
                            return s.Range == d[0];
                        })[0],
                        nD = d3.keys(st.freq).map(function(s) {
                            return {
                                type: s,
                                freq: st.freq[s]
                            };
                        });
                        // call update functions of pie-chart and legend.    
                    pC.update(nD);
                    leg.update(nD);
                }
                function mouseout(d) { // utility function to be called on mouseout.
                    // reset the pie-chart and legend.    
                    pC.update(tF);
                    leg.update(tF);
                }
                // create function to update the bars. This will be used by pie-chart.
                hG.update = function(nD, color) {
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function(d) {
                        return d[1];
                    })]);
                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);
                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500)
                        .attr("y", function(d) {
                            return y(d[1]);
                        })
                        .attr("height", function(d) {
                            return hGDim.h - y(d[1]);
                        })
                        .attr("fill", color);
                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500)
                        .text(function(d) {
                            return d3.format(",")(d[1])
                        })
                        .attr("y", function(d) {
                            return y(d[1]) - 5;
                        });
                }
                return hG;
            }
            // function to handle pieChart.
            function pieChart(pD) {
                var pC = {},
                    pieDim = {
                        w: 250,
                        h: 250
                    };
                pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                // create svg for pie chart.
                var piesvg = d3.select(id).append("svg")
                    .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                    .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");
                // create function to draw the arcs of the pie slices.
                var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);
                // create a function to compute the pie slice angles.
                var pie = d3.layout.pie().sort(null).value(function(d) {
                    return d.freq;
                });
                // Draw the pie slices.
                piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
                    .each(function(d) {
                        this._current = d;
                    })
                    .style("fill", function(d) {
                        return segColor(d.data.type);
                    })
                    .on("mouseover", mouseover).on("mouseout", mouseout);
                // create function to update pie-chart. This will be used by histogram.
                pC.update = function(nD) {
                        piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                            .attrTween("d", arcTween);
                    }
                    // Utility function to be called on mouseover a pie slice.
                function mouseover(d) {
                    // call the update function of histogram with new data.
                    hG.update(data.map(function(v) {
                        return [v.Range, v.freq[d.data.type]];
                    }), segColor(d.data.type));
                }
                //Utility function to be called on mouseout a pie slice.
                function mouseout(d) {
                    // call the update function of histogram with all data.
                    hG.update(data.map(function(v) {
                        return [v.Range, v.total];
                    }), barColor);
                }
                // Animating the pie-slice requiring a custom function which specifies
                // how the intermediate paths should be drawn.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function(t) {
                        return arc(i(t));
                    };
                }
                return pC;
            }
            // function to handle legend.
            function legend(lD) {
                var leg = {};
                // create table for legend.
                var legend = d3.select(id).append("table").attr('class', 'legend');
                // create one row per segment.
                var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
                // create the first column for each segment.
                tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
                    .attr("width", '16').attr("height", '16')
                    .attr("fill", function(d) {
                        return segColor(d.type);
                    });
                // create the second column for each segment.
                tr.append("td").attr("class", 'legendText').text(function(d) {
                    return d.type;
                });
                // create the third column for each segment.
                tr.append("td").attr("class", 'legendFreq')
                    .text(function(d) { return d3.format(",")(d.freq); });
                // create the fourth column for each segment.
                tr.append("td").attr("class", 'legendPerc')
                    .text(function(d) {
                        return getLegend(d, lD);
                    });
                // Utility function to be used to update the legend.
                leg.update = function(nD) {
                    // update the data attached to the row elements.
                    var l = legend.select("tbody").selectAll("tr").data(nD);
                    l.select(".legendText").text(function(d) {
                        return d.type;
                    });
                    // update the frequencies.
                    l.select(".legendFreq").text(function(d) {
                        return d3.format(",")(d.freq);
                    });
                    // update the percentage column.
                    l.select(".legendPerc").text(function(d) {
                        return getLegend(d, nD);
                    });
                }
                function getLegend(d, aD) { // Utility function to compute percentage.
                    return d3.format("%")(d.freq / d3.sum(aD.map(function(v) {
                        return v.freq;
                    })));
                }
                return leg;
            }
            // calculate total frequency by segment for all Range.
            var tF = ['image/gif', 'audio/mpeg', 'audio/x-aiff', 'audio/x-wav', 'video/x-flv'].map(function(d) { return {type: d, freq: d3.sum(data.map(function(t) { return t.freq[d];})) }; });
            // calculate total frequency by Range for all segment.
            var sF = data.map(function(d) { return [d.Range, d.total]; });
            var hG = histoGram(sF), // create the histogram.
                pC = pieChart(tF), // create the pie-chart.
                leg = legend(tF); // create the legend.
        }




}
;( function() {
  var data = {
    lineChart: [ ],
       /* {
            "date": "1994-01-01", 
            "label": "Carbon Dioxide", 
            "value": 6
        }, 
        {
            "date": "1994-01-01", 
            "label": "Methane", 
            "value": 1
        }, 
        {
            "date": "1994-01-01", 
            "label": "Ozone", 
            "value": 2
        }, 
        {
            "date": "1995-01-01", 
            "label": "Carbon Dioxide", 
            "value": 1
        }, 
        {
            "date": "1995-01-01", 
            "label": "Ozone", 
            "value": 1
        }, 
        {
            "date": "1998-01-01", 
            "label": "Carbon Dioxide", 
            "value": 11
        }, 
        {
            "date": "1999-01-01", 
            "label": "Carbon Dioxide", 
            "value": 22
        }, 
        {
            "date": "1999-01-01", 
            "label": "Methane", 
            "value": 3
        }, 
        {
            "date": "1999-01-01", 
            "label": "Ozone", 
            "value": 26
        }, 
        {
            "date": "2000-01-01", 
            "label": "Carbon Dioxide", 
            "value": 25
        }, 
        {
            "date": "2000-01-01", 
            "label": "Methane", 
            "value": 15
        }, 
        {
            "date": "2000-01-01", 
            "label": "Ozone", 
            "value": 18
        }, 
        {
            "date": "2001-01-01", 
            "label": "Carbon Dioxide", 
            "value": 33
        }, 
        {
            "date": "2001-01-01", 
            "label": "Methane", 
            "value": 28
        }, 
        {
            "date": "2001-01-01", 
            "label": "Ozone", 
            "value": 36
        }, 
        {
            "date": "2002-01-01", 
            "label": "Carbon Dioxide", 
            "value": 32
        }, 
        {
            "date": "2002-01-01", 
            "label": "Methane", 
            "value": 10
        }, 
        {
            "date": "2002-01-01", 
            "label": "Ozone", 
            "value": 16
        }, 
        {
            "date": "2003-01-01", 
            "label": "Carbon Dioxide", 
            "value": 46
        }, 
        {
            "date": "2003-01-01", 
            "label": "Methane", 
            "value": 26
        }, 
        {
            "date": "2003-01-01", 
            "label": "Ozone", 
            "value": 37
        }, 
        {
            "date": "2004-01-01", 
            "label": "Carbon Dioxide", 
            "value": 17
        }, 
        {
            "date": "2004-01-01", 
            "label": "Methane", 
            "value": 8
        }, 
        {
            "date": "2004-01-01", 
            "label": "Ozone", 
            "value": 29
        }, 
        {
            "date": "2005-01-01", 
            "label": "Carbon Dioxide", 
            "value": 22
        }, 
        {
            "date": "2005-01-01", 
            "label": "Methane", 
            "value": 15
        }, 
        {
            "date": "2005-01-01", 
            "label": "Ozone", 
            "value": 32
        }, 
        {
            "date": "2006-01-01", 
            "label": "Carbon Dioxide", 
            "value": 24
        }, 
        {
            "date": "2006-01-01", 
            "label": "Methane", 
            "value": 35
        }, 
        {
            "date": "2006-01-01", 
            "label": "Ozone", 
            "value": 88
        }, 
        {
            "date": "2007-01-01", 
            "label": "Carbon Dioxide", 
            "value": 12
        }, 
        {
            "date": "2007-01-01", 
            "label": "Methane", 
            "value": 58
        }, 
        {
            "date": "2007-01-01", 
            "label": "Ozone", 
            "value": 131
        }, 
        {
            "date": "2008-01-01", 
            "label": "Carbon Dioxide", 
            "value": 19
        }, 
        {
            "date": "2008-01-01", 
            "label": "Methane", 
            "value": 4
        }, 
        {
            "date": "2008-01-01", 
            "label": "Ozone", 
            "value": 47
        }, 
        {
            "date": "2009-01-01", 
            "label": "Carbon Dioxide", 
            "value": 16
        }, 
        {
            "date": "2009-01-01", 
            "label": "Methane", 
            "value": 16
        }, 
        {
            "date": "2009-01-01", 
            "label": "Ozone", 
            "value": 132
        }, 
        {
            "date": "2010-01-01", 
            "label": "Carbon Dioxide", 
            "value": 20
        }, 
        {
            "date": "2010-01-01", 
            "label": "Methane", 
            "value": 2
        }, 
        {
            "date": "2010-01-01", 
            "label": "Ozone", 
            "value": 12
        }, 
        {
            "date": "2011-01-01", 
            "label": "Carbon Dioxide", 
            "value": 15
        }, 
        {
            "date": "2011-01-01", 
            "label": "Methane", 
            "value": 10
        }, 
        {
            "date": "2011-01-01", 
            "label": "Ozone", 
            "value": 36
        }, 
        {
            "date": "2012-01-01", 
            "label": "Carbon Dioxide", 
            "value": 35
        }, 
        {
            "date": "2012-01-01", 
            "label": "Methane", 
            "value": 1
        }, 
        {
            "date": "2012-01-01", 
            "label": "Ozone", 
            "value": 70
        }, 
        {
            "date": "2013-01-01", 
            "label": "Carbon Dioxide", 
            "value": 39
        }, 
        {
            "date": "2013-01-01", 
            "label": "Methane", 
            "value": 55
        }, 
        {
            "date": "2013-01-01", 
            "label": "Ozone", 
            "value": 98
        }, 
        {
            "date": "2014-01-01", 
            "label": "Carbon Dioxide", 
            "value": 88
        }, 
        {
            "date": "2014-01-01", 
            "label": "Methane", 
            "value": 4
        }, 
        {
            "date": "2014-01-01", 
            "label": "Ozone", 
            "value": 136
        }
    ], */
    pieChart: [
        {
            "color": "red", 
            "description": "Carbon Dioxide", 
            "title": "Carbon Dioxide", 
            "value": 0.28065078442765834
        }, 
        {
            "color": "blue", 
            "description": "Methane", 
            "title": "Methane", 
            "value": 0.16908773968622895
        }, 
        {
            "color": "black", 
            "description": "Ozone", 
            "title": "Ozone", 
            "value": 0.5502614758861127
        }
    ]
};
  
  var DURATION = 1500;
  var DELAY = 500;
  
  var promises = [];
  
  for (year = 1994; year < 2016; year++) {
	promises.push(getMethaneData(year));
	promises.push(getCO2Data(year));
	promises.push(getOzoneData(year));
  }
  
  
  function getMethaneData(year) {
	  var dfd = $.Deferred();
	  var url = "http://polar.usc.edu/solr/temporal/select?q=Methane&fq=extracted_dates%3A%22" + year + "-01-01T00%3A00%3A00Z%22&wt=json&json.wrf=?&indent=true";
	 $.getJSON(url, function(response) {
		var temp =
		{
			"date": year + "-01-01",
			"label": "Methane",
			"value": response['response']['numFound']
		}
		data.lineChart.push(temp);
		dfd.resolve();
	});
	return dfd.promise();
  }
  
  
  function getCO2Data(year) {
	  var dfd = $.Deferred();
	  var url = 'http://polar.usc.edu/solr/temporal/select?q=%22Carbon+Dioxide%22&fq=extracted_dates%3A%22' + year + '-01-01T00%3A00%3A00Z%22&wt=json&json.wrf=?&indent=true';
	  $.getJSON(url, function(response) {
		var temp =
		{
			"date": year + "-01-01",
			"label": "Carbon Dioxide",
			"value": response['response']['numFound']
		}
		data.lineChart.push(temp);
		dfd.resolve();
	});
	return dfd.promise();
  }
  
  function getOzoneData(year) {
	  var dfd = $.Deferred();
	  var url = "http://polar.usc.edu/solr/temporal/select?q=Ozone&fq=extracted_dates%3A%22" + year + "-01-01T00%3A00%3A00Z%22&wt=json&json.wrf=?&indent=true";
	  $.getJSON(url, function(response) {
		var temp =
		{
			"date": year + "-01-01",
			"label": "Ozone",
			"value": response['response']['numFound']
		}
		data.lineChart.push(temp);
		dfd.resolve();
	});
	return dfd.promise();
  }
  
  
  /**
   * draw the fancy line chart
   *
   * @param {String} elementId elementId
   * @param {Array}  data      data
   */
  function drawLineChart( elementId, data ) {
    // parse helper functions on top
    var parse = d3.time.format( '%Y-%m-%d' ).parse;
    // data manipulation first
	
	/*var copy = data.extend();
    data = data.map( function( datum ) {
      datum.date = parse( datum.date );
      
      return datum;
    } );
	alert(JSON.stringify(data));
	alert(JSON.stringify(copy));
    */
    // TODO code duplication check how you can avoid that
    var containerEl = document.getElementById( elementId ),
        width       = containerEl.clientWidth,
        height      = width *0.2,
        margin      = {
          top    : 30,
          right  : 10,
          left   : 10 
        },
        
        detailWidth  = 98,
        detailHeight = 55,
        detailMargin = 10,

        container   = d3.select( containerEl ),
        svg         = container.select( 'svg' )
                                .attr( 'width', width )
                                .attr( 'height', height + margin.top ),

        x          = d3.time.scale().range( [ 0, width - detailWidth ] ),
        xAxis      = d3.svg.axis().scale( x )
                                  .ticks ( 8 )
                                  .tickSize( -height ),
        xAxisTicks = d3.svg.axis().scale( x )
                                  .ticks( 16 )
                                  .tickSize( -height )
                                  .tickFormat( '' ),
        y          = d3.scale.linear().range( [ height, 0 ] ),
        yAxisTicks = d3.svg.axis().scale( y )
                                  .ticks( 5 )
                                  .tickSize( width )
                                  .tickFormat( '' )
                                  .orient( 'right' ),
        area = d3.svg.area()
                      .interpolate( 'linear' )
                      .x( function( d )  { return x( d.date ) + detailWidth / 2; } )
                      .y0( height )
                      .y1( function( d ) { return y( d.value ); } ),

        line = d3.svg.line()
                  .interpolate( 'linear' )
                  .x( function( d ) { return x( d.date ) + detailWidth / 2; } )
                  .y( function( d ) { return y( d.value ); } ),
        
        startData = data.map( function( datum ) {
                      return {
                        date  : datum.date,
                        value : 0
                      };
                    } ),
        
        circleContainer;

    // Compute the minimum and maximum date, and the maximum price.
	var currTime = new Date();
	var min = currTime.getFullYear() + "-01-01";
	var max = "1000-01-01";
	var minDate = Date.parse(min);
	var maxDate = Date.parse(max);
	for (i=0; i < data.length; i++) {
		var date = Date.parse(data[i].date);
		//alert("date: " + date + "\nmin: " + minDate + "\nmax: " + maxDate);
		if (date < minDate) {
			minDate = date;
			min = data[i].date;
		}
		if (date > maxDate) {
			maxDate = date;
			max = data[i].date;
		}
	}
	alert(min + "," + max);
    x.domain( [ parse(min), parse(max)] );
	data = data.map( function( datum ) {
      datum.date = parse( datum.date );
      
      return datum;
    } );
    // hacky hacky hacky :(
    y.domain( [ 0, d3.max( data, function( d ) { return d.value; } ) + 10] );

    svg.append( 'g' )
        .attr( 'class', 'lineChart--xAxisTicks' )
        .attr( 'transform', 'translate(' + detailWidth / 2 + ',' + height + ')' )
        .call( xAxisTicks );

    svg.append( 'g' )
        .attr( 'class', 'lineChart--xAxis' )
        .attr( 'transform', 'translate(' + detailWidth / 2 + ',' + ( height + 7 ) + ')' )
        .call( xAxis );
    
    svg.append( 'g' )
      .attr( 'class', 'lineChart--yAxisTicks' )
      .call( yAxisTicks );
    
    // Add the line path.
    svg.append( 'path' )
        .datum( startData )
        .attr( 'class', 'lineChart--areaLine' )
        .attr( 'd', line )
        .transition()
        .duration( DURATION )
        .delay( DURATION / 2 )
        .attrTween( 'd', tween( data, line ) )
        .each( 'end', function() {
          drawCircles( data );
        } );
    
    
    // Add the area path.
    svg.append( 'path' )
        .datum( startData )
        .attr( 'class', 'lineChart--area' )
        .attr( 'd', area )
        .transition()
        .duration( DURATION )
        .attrTween( 'd', tween( data, area ) );
    
    // Helper functions!!!
    function drawCircle( datum, index ) {
      circleContainer.datum( datum )
                    .append( 'circle' )
                    .attr( 'class', 'lineChart--circle' )
                    .attr( 'r', 0 )
                    .attr(
                      'cx',
                      function( d ) {
                        return x( d.date ) + detailWidth / 2;
                      }
                    )
                    .attr(
                      'cy',
                      function( d ) {
                        return y( d.value );
                      }
                    )
                    .on( 'mouseenter', function( d ) {
                      d3.select( this )
                        .attr(
                          'class',
                          'lineChart--circle lineChart--circle__highlighted' 
                        )
                        .attr( 'r', 7 );
                      
                        d.active = true;
                        
                        showCircleDetail( d );
                    } )
                    .on( 'mouseout', function( d ) {
                      d3.select( this )
                        .attr(
                          'class',
                          'lineChart--circle' 
                        )
                        .attr( 'r', 6 );
                      
                      if ( d.active ) {
                        hideCircleDetails();
                        
                        d.active = false;
                      }
                    } )
                    .on( 'click touch', function( d ) {
                      if ( d.active ) {
                        showCircleDetail( d )
                      } else {
                        hideCircleDetails();
                      }
                    } )
                    .transition()
                    .delay( DURATION / 10 * index )
                    .attr( 'r', 6 );
    }
    
    function drawCircles( data ) {
      circleContainer = svg.append( 'g' );

      data.forEach( function( datum, index ) {
        drawCircle( datum, index );
      } );
    }
    
    function hideCircleDetails() {
      circleContainer.selectAll( '.lineChart--bubble' )
                      .remove();
    }
    
    function showCircleDetail( data ) {
      var details = circleContainer.append( 'g' )
                        .attr( 'class', 'lineChart--bubble' )
                        .attr(
                          'transform',
                          function() {
                            var result = 'translate(';
                            
                            result += x( data.date );
                            result += ', ';
                            result += y( data.value ) - detailHeight - detailMargin;
                            result += ')';
                            
                            return result;
                          }
                        );
      
      details.append( 'path' )
              .attr( 'd', 'M2.99990186,0 C1.34310181,0 0,1.34216977 0,2.99898218 L0,47.6680579 C0,49.32435 1.34136094,50.6670401 3.00074875,50.6670401 L44.4095996,50.6670401 C48.9775098,54.3898926 44.4672607,50.6057129 49,54.46875 C53.4190918,50.6962891 49.0050244,54.4362793 53.501875,50.6670401 L94.9943116,50.6670401 C96.6543075,50.6670401 98,49.3248703 98,47.6680579 L98,2.99898218 C98,1.34269006 96.651936,0 95.0000981,0 L2.99990186,0 Z M2.99990186,0' )
              .attr( 'width', detailWidth )
              .attr( 'height', detailHeight );
      
      var text = details.append( 'text' )
                        .attr( 'class', 'lineChart--bubble--text' );
      
      text.append( 'tspan' )
          .attr( 'class', 'lineChart--bubble--label' )
          .attr( 'x', detailWidth / 2 )
          .attr( 'y', detailHeight / 3 )
          .attr( 'text-anchor', 'middle' )
          .text( data.label );
      
      text.append( 'tspan' )
          .attr( 'class', 'lineChart--bubble--value' )
          .attr( 'x', detailWidth / 2 )
          .attr( 'y', detailHeight / 4 * 3 )
          .attr( 'text-anchor', 'middle' )
          .text( data.value );
    }
    
    function tween( b, callback ) {
      return function( a ) {
        var i = d3.interpolateArray( a, b );

        return function( t ) {
          return callback( i ( t ) );
        };
      };
    }
  }
  
  /**
   * draw the fancy pie chart
   *
   * @param {String} elementId elementId
   * @param {Array}  data      data
   */
  function drawPieChart( elementId, data ) {
    // TODO code duplication check how you can avoid that
    var containerEl = document.getElementById( elementId ),
        width       = containerEl.clientWidth,
        height      = width * 0.4,
        radius      = Math.min( width, height ) / 2,
        container   = d3.select( containerEl ),
        svg         = container.select( 'svg' )
                              .attr( 'width', width )
                              .attr( 'height', height );
    var pie = svg.append( 'g' )
                .attr(
                  'transform',
                  'translate(' + width / 2 + ',' + height / 2 + ')'
                );
    
    var detailedInfo = svg.append( 'g' )
                          .attr( 'class', 'pieChart--detailedInformation' );

    var twoPi   = 2 * Math.PI;
    var pieData = d3.layout.pie()
                    .value( function( d ) { return d.value; } );

    var arc = d3.svg.arc()
                    .outerRadius( radius - 20)
                    .innerRadius( 0 );
    
    var pieChartPieces = pie.datum( data )
                            .selectAll( 'path' )
                            .data( pieData )
                            .enter()
                            .append( 'path' )
                            .attr( 'class', function( d ) {
                              return 'pieChart__' + d.data.color;
                            } )
                            .attr( 'filter', 'url(#pieChartInsetShadow)' )
                            .attr( 'd', arc )
                            .each( function() {
                              this._current = { startAngle: 0, endAngle: 0 }; 
                            } )
                            .transition()
                            .duration( DURATION )
                            .attrTween( 'd', function( d ) {
                              var interpolate = d3.interpolate( this._current, d );
                              this._current = interpolate( 0 );
                    
                              return function( t ) {
                                return arc( interpolate( t ) );
                              };
                            } )
                            .each( 'end', function handleAnimationEnd( d ) {
                              drawDetailedInformation( d.data, this ); 
                            } );

    drawChartCenter(); 
    
    function drawChartCenter() {
      var centerContainer = pie.append( 'g' )
                                .attr( 'class', 'pieChart--center' );
      
      centerContainer.append( 'circle' )
                      .attr( 'class', 'pieChart--center--outerCircle' )
                      .attr( 'r', 0 )
                      .attr( 'filter', 'url(#pieChartDropShadow)' )
                      .transition()
                      .duration( DURATION )
                      .delay( DELAY )
                      .attr( 'r', radius - 50 );
      
      centerContainer.append( 'circle' )
                      .attr( 'id', 'pieChart-clippy' )
                      .attr( 'class', 'pieChart--center--innerCircle' )
                      .attr( 'r', 0 )
                      .transition()
                      .delay( DELAY )
                      .duration( DURATION )
                      .attr( 'r', radius - 55 )
                      .attr( 'fill', '#fff' );
    }
    
    function drawDetailedInformation ( data, element ) {
      var bBox      = element.getBBox(),
          infoWidth = width * 0.3,
          anchor,
          infoContainer,
          position;
      
      if ( ( bBox.x + bBox.width / 2 ) > 0 ) {
        infoContainer = detailedInfo.append( 'g' )
                                    .attr( 'width', infoWidth )
                                    .attr(
                                      'transform',
                                      'translate(' + ( width - infoWidth ) + ',' + ( bBox.height + bBox.y ) + ')'
                                    );
        anchor   = 'end';
        position = 'right';
      } else {
        infoContainer = detailedInfo.append( 'g' )
                                    .attr( 'width', infoWidth )
                                    .attr(
                                      'transform',
                                      'translate(' + 0 + ',' + (( bBox.height + bBox.y) == 0 ? 100: ( bBox.height + bBox.y)) + ')'
                                    );
        anchor   = 'start';
        position = 'left';
      }

      infoContainer.data( [ data.value * 100 ] )
                    .append( 'text' )
                    .text ( '0 %' )
                    .attr( 'class', 'pieChart--detail--percentage' )
                    .attr( 'x', ( position === 'left' ? 0 : infoWidth ) )
                    .attr( 'y', -10 )
                    .attr( 'text-anchor', anchor )
                    .transition()
                    .duration( DURATION )
                    .tween( 'text', function( d ) {
                      var i = d3.interpolateRound(
                        +this.textContent.replace( /\s%/ig, '' ),
                        d
                      );

                      return function( t ) {
                        this.textContent = i( t ) + ' %';
                      };
                    } );
      
      infoContainer.append( 'line' )
                    .attr( 'class', 'pieChart--detail--divider' )
                    .attr( 'x1', 0 )
                    .attr( 'x2', 0 )
                    .attr( 'y1', 0 )
                    .attr( 'y2', 0 )
                    .transition()
                    .duration( DURATION )
                    .attr( 'x2', infoWidth );
      
      infoContainer.data( [ data.description ] ) 
                    .append( 'foreignObject' )
                    .attr( 'width', infoWidth ) 
                    .attr( 'height', 100 )
                    .append( 'xhtml:body' )
                    .attr(
                      'class',
                      'pieChart--detail--textContainer ' + 'pieChart--detail__' + position
                    )
                    .html( data.description );
    }
  }
  
  function ಠ_ಠ() {
    drawLineChart(    'lineChart',    data.lineChart );
  }
  
  // yeah, let's kick things off!!!
   $.when(
    $.getJSON("http://polar.usc.edu/solr/geo/select?q=ozone&wt=json&json.wrf=?&indent=true", function(response) {
	   data['pieChart'][2]['numResults'] = response['response']['numFound'];
	 }),
	 
	$.getJSON("http://polar.usc.edu/solr/geo/select?q=CO2&wt=json&json.wrf=?&indent=true", function(response) {
		data['pieChart'][0]['numResults'] = response['response']['numFound'];
	}),
	$.getJSON("http://polar.usc.edu/solr/geo/select?q=methane&wt=json&json.wrf=?&indent=true", function(response) {
		data['pieChart'][1]['numResults'] = response['response']['numFound'];
	})
	).then(function() {
		var total = 0;
		
		for (i = 0; i < 3; i++) {
			total += data['pieChart'][i]['numResults'];
		}
		for (i = 0; i < 3; i++) {
			data['pieChart'][i]['value'] = data['pieChart'][i]['numResults']/total;
		}
		drawPieChart(     'pieChart',     data.pieChart );
	});
	
	$.when.apply($, promises).then(function() {
		//alert(JSON.stringify(data.lineChart));
		drawLineChart( 'lineChart', data.lineChart);
	});
  //ಠ_ಠ();
  
})();
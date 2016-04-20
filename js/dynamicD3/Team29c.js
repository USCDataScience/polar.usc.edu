function drawTimeSeries(dataFile, anchorText) {
      $('#dropdownMenu').text(anchorText);
      jQuery('#chart').html('');
      var elt = d3.select("#chart");
      var width = 720, 
        height = 400;
      var tsData = null;

      var rangeWidget = d3.elts.startEndSlider().minRange(1*365*24*3600*1000); 
      var clickPanel = d3.elts.makeClickPanel();
      var tsChart = d3.elts.timeSeriesChart()
                  .width(width)
                  .height(height)
                  .x(function(d) { return d3.time.format("%Y%m%d").parse(d[0]); })
                  .xAxisText(function(textSel) {  // rotates x labels 90 degrees
                    textSel.attr("x", -29)
                      .attr("y", 0)
                      .attr("dy", ".35em")
                      .attr("transform", "rotate(-90)")
                      .style("text-anchor", "end");
                  })
                  .fillColor(["#F2F2F6", "#A8A8E0"])
                  .strokeColor("#602080")
                  .rangeWidget(rangeWidget)
                  .notesMarkerClick(function(elt, note, closeHandler) {
                    clickPanel(elt, note && ("<h3>"+note.title+"</h3><p>"+note.desc+"</p>"+(note.link&&"<a href='"+note.link+"' target='_blank'>Read more&hellip;</a>")), closeHandler);
                  })
                  .margin({top: 40, right: 25, bottom: 80, left: 70});
      tsChart.yAxis(tsChart.yAxis().tickFormat(d3.format(".0f")));

      d3.csv(dataFile, function(data) {
        alert(data.length); 
        var map = {}; 
        for(var i=0; i<data.length; i++)
        {
          if(data[i].extracted_dates == null)
          {
            continue;
          }
          var str = data[i].extracted_dates;
          var split = str.split(",");
          for(var j=0; j<split.length; j++)
          {
            var date = split[j].substring(0,10);
            var date2 = date.split("-");
            var date3 = date2[0]*100 + date2[1]*10 + date2[2];
            if(isNaN(date3) ) continue; 
            if(date3 in map)
            {
                var freq = map[date3];
                freq++;
                map[date3] = freq; 
            }
            else
            {
              map[date3] = 0; 
            }
          }
        }
        var msg = "";
        var map2 = [];
        for( var key in map)
        {
          var temp = new Object();

          msg+= key +" "+ map[key] +"\n";

           temp["date"] = key;
          temp["price"] = map[key];
          map2.push(temp); 
        }
        //alert(msg);
        d3.csv('../../data/team29-wheat-notes.csv', function(notes) {
          tsChart.notes(notes);
          tsData = _.map(map2, function(d) { return [d.date, d.price] });
          elt.datum(tsData).call(tsChart);
        });
      });
}

 var outerWidth = 1200,
   outerHeight = 600,
   xColumn = "longitude",
   yColumn = "latitude",
   rColumn = "population",
   peoplePerPixel = 1000000,
   margin = {
     left: -50,
     top: 0,
     right: -50,
     bottom: 0
   },
   innerWidth = outerWidth - margin.left - margin.right,
   innerHeight = outerHeight - margin.top - margin.bottom;
 var svg = d3.select("#container")
   .append("svg")
   .attr("width", outerWidth)
   .attr("height", outerHeight);

 var g = svg.append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 var xScale = d3.scale.linear().range([0, innerWidth]),
   yScale = d3.scale.linear().range([innerHeight, 0]),
   rScale = d3.scale.sqrt();

 function render(data) {
   xScale.domain(d3.extent(data, function(d) {
     return d[xColumn];
   }));
   yScale.domain(d3.extent(data, function(d) {
     return d[yColumn];
   }));
   rScale.domain([0, d3.max(data, function(d) {
     return d[rColumn];
   })]);
   // Compute the size of the biggest circle as a function of peoplePerPixel.
   var peopleMax = rScale.domain()[1],
     rMin = 0,
     rMax = Math.sqrt(peopleMax / (peoplePerPixel * Math.PI));
   rScale.range([rMin, rMax]);
   var circles = g.selectAll("circle").data(data);
   circles.enter().append("circle");
   circles
     .attr("cx", function(d) {
       return xScale(d[xColumn]);
     })
     .attr("cy", function(d) {
       return yScale(d[yColumn]);
     })
     .attr("r", function(d) {
       return rScale(d[rColumn]);
     });
   circles.exit().remove();
 }

 function type(d) {
   d.latitude = +d.latitude;
   d.longitude = +d.longitude;
   d.population = +d.population;

   return d;
 }

 d3.csv("cities15000.csv", type, render);
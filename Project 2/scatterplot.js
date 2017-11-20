function scree_plot(filename) {
    scree.attr("height",h);
    svg.selectAll("*").remove();
    svg.attr("height",0);
    lsvg.attr("height",0);
    d3.csv(filename, function(error, data) {
        var counter = 1
        data.forEach(function(d) {
            d.eigs = +d.eigs;
            d.index = +counter;
            counter = counter + 1;

        });

        var xValue = function(d) { return d.index;};

        var yValue = function(d) { return d.eigs;};

        xScale.domain([d3.min(data, xValue),
                       d3.max(data, xValue)]);
        yScale.domain([d3.min(data, yValue),
                       d3.max(data, yValue)]);
        var valueline = d3.svg.line()
            .x(function(d) { return xScale(d.index); })
            .y(function(d) { return yScale(d.eigs); });

        var horline = d3.svg.line()
            .x(function(d) { return xScale(d.index); })
            .y(function(d) { return yScale(900); });
            // Add the valueline path.
        scree.append("path")
            .attr("class", "line")
            .attr("d", valueline(data))
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("fill", "none");
        scree.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0, "+(h-2*pad +5)+")")
          .call(xAxis);

        scree.append("g")
          .attr("class", "axis")
          .attr("transform", "translate("+(left_pad-pad)+", 0)")
          .call(yAxis);

        scree.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", left_pad-130)
        .attr("x",h-650)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Attribute Loading");

        scree.append("text")
        .attr("y", 420)
        .attr("x",500)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Attribute Number");

    });
}


function plot2d(filename) {

    svg.attr("height",h);
    svg.selectAll("*").remove();
    scree.selectAll("*").remove();
    scree.attr("height",0);
    lsvg.attr("height",0);

    d3.csv(filename, function(error, data) {
        data.forEach(function(d) {
            d.r1 = +d.r1;
            d.r2 = +d.r2;
            d.a1 = +d.a1;
            d.a2 = +d.a2;
            d.type = +d.type;
        });

        var xValueR = function(d) { return d.r1;};
        var xValueA = function(d) { return d.a1;};
        var yValueR = function(d) { return d.r2;};
        var yValueA = function(d) { return d.a2;};

        xScale.domain([Math.min(d3.min(data, xValueR),d3.min(data, xValueA)),
                       Math.max(d3.max(data, xValueR),d3.max(data, xValueA))]);
        yScale.domain([Math.min(d3.min(data, yValueR),d3.min(data, yValueA)),
                       Math.max(d3.max(data, yValueR),d3.max(data, yValueA))]);


        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0, "+(h-2*pad +5)+")")
          .call(xAxis);

        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate("+(left_pad-pad)+", 0)")
          .call(yAxis);

        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", left_pad-130)
        .attr("x",h-650)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Component A");

        svg.append("text")
        .attr("y", 420)
        .attr("x",500)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Component B");


        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("rect")
            .attr("width", 8)
            .attr("height", 8)
            .attr("x", function(d){
                return xScale(d.r1);
            })
            .attr("y", function(d){
                return yScale(d.r2);
            })
            .attr("fill", "red")
            .attr("stroke", "black");
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 4.5)
            .attr("cx", function(d){
                return xScale(d.a1);
            })
            .attr("cy", function(d){
                return yScale(d.a2);
            })
            .attr("fill", "green")
            .attr("stroke", "black");

    });

}


function scattermatrix() {

    svg.selectAll("*").remove();
    scree.selectAll("*").remove();
    lsvg.selectAll("*").remove();

    svg.attr("height",0);
    scree.attr("height",0);

var width = 1000,
    size = 250,
    padding = 20;

var x = d3.scale.linear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scale.linear()
    .range([size - padding / 2, padding / 2]);

var xsAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(6);

var ysAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(6);

var color = d3.scale.category10();

d3.csv("scattermatrix.csv", function(error, data) {
  if (error) throw error;

  var domainByTrait = {},
      traits = d3.keys(data[0]),
      n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
  });

  xsAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  lsvg.attr("width", size * n + padding)
      .attr("height", size * n + padding)
      .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

  lsvg.selectAll(".x.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xsAxis); });

  lsvg.selectAll(".y.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(ysAxis); });

  var cell = lsvg.selectAll(".cell")
      .data(cross(traits, traits))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 4)
        .style("fill", "orange");
  }
});

}
function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}

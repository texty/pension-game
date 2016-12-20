function singlechart() {

    
    var historical = []
        , future = []
        , minY
        , maxY
        ;

    function my(selection) {
        selection.each(function(d) {

            var svg = d3.select(this)
                , margin = {top: 20, right: 20, bottom: 30, left: 50}
                , width = +svg.attr("width") - margin.left - margin.right
                , height = +svg.attr("height") - margin.top - margin.bottom
                , g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                ;

            var parseTime = d3.timeParse("%d-%b-%y");

            var x = d3.scaleLinear()
                .range([0, width]);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var line = d3.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(d.value); });

            var all = historical.concat(future);

            var future_start = [historical[historical.length - 1]].concat(future);


            x.domain(d3.extent(all, function(d) {return d.year}));
            y.domain([minY || 0, maxY || d3.max(all, function(d) {return d.value})]);

            var xAxis = d3.axisBottom(x)
                .ticks(4)
                .tickSizeOuter(0)
                .tickSizeInner(-height)
                .tickPadding(15)
                .tickFormat(d3.format("d"));

            var yAxis = d3.axisLeft(y)
                .ticks(5)
                .tickSizeOuter(0)
                .tickSizeInner(-width)
                .tickPadding(15);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            g.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis)
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end")
                .text("Something");

            var historical_path = g.append("path")
                .datum(historical)
                .attr("class", "line historical")
                .attr("d", line);

            var future_path = g.append("path")
                .datum(future_start)
                .attr("class", "line future")
                .attr("d", line);

            g.selectAll("circle.handle.future")
                .data(future)
                .enter()
                .append('circle')
                .attr("class", 'handle future')
                .attr('cx', function(d) {return x(d.year)})
                .attr('cy', function(d) {return y(d.value)})
                .attr('r', 10.0)
                .call(d3.drag().on("drag", dragged));

            function dragged(d) {
                d3.select(this).attr("cy", d.y = d3.event.y);
                d.value = y.invert(d.y);
                update()
            }

            function update() {
                historical_path.attr("d", line);
                future_path.attr("d", line);
            }
        });
    }

    my.future = function(value) {
        if (!arguments.length) return future;
        future = value;
        return my;
    };

    my.historical = function(value) {
        if (!arguments.length) return historical;
        historical = value;
        return my;
    };
    
    my.minY = function(value) {
        if (!arguments.length) return minY;
        minY = value;
        return my;
    };

    my.maxY = function(value) {
        if (!arguments.length) return maxY;
        maxY = value;
        return my;
    };

    // my.width = function(value) {
    //     if (!arguments.length) return width;
    //     width = value;
    //     return my;
    // };
    //
    // my.height = function(value) {
    //     if (!arguments.length) return height;
    //     height = value;
    //     return my;
    // };

    return my;
}
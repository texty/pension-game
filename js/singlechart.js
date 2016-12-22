function singlechart() {

    
    var varName
        , historical = []
        , future = []
        , minY
        , maxY
        , maxStep
        , yFormat
        ;

    function my(selection) {
        selection.each(function(d) {

            var svg = d3.select(this)
                , margin = {top: 20, right: 20, bottom: 30, left: 50}
                , width = +svg.attr("width") - margin.left - margin.right
                , height = +svg.attr("height") - margin.top - margin.bottom
                , g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                ;

            var x = d3.scaleLinear()
                .range([0, width]);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var line = d3.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(d[varName]); });

            var all = historical.concat(future);

            var future_start = [historical[historical.length - 1]].concat(future);


            x.domain(d3.extent(all, function(d) {return d.year}));

            if (!minY) minY = 0;
            if (!maxY) maxY = d3.max(all, function(d) {return d[varName]});

            y.domain([minY, maxY]);

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

            if (yFormat) yAxis.tickFormat(yFormat);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            g.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);
                // .append("text")
                // .attr("fill", "#000")
                // .attr("transform", "rotate(-90)")
                // .attr("y", 6)
                // .attr("dy", "0.71em")
                // .style("text-anchor", "end")
                // .text("Something");

            var historical_path = g.append("path")
                .datum(historical)
                .attr("class", "line historical")
                .attr("d", line);

            var future_path = g.append("path")
                .datum(future_start)
                .attr("class", "line future")
                .attr("d", line);

            var circles = g.selectAll("circle.handle.future")
                .data(future)
                .enter()
                .append('circle')
                .attr("class", 'handle future')
                .attr('cx', function(d) {return x(d.year)})
                .attr('cy', function(d) {return y(d[varName])})
                .attr('r', 5.0)
                .call(d3.drag().on("drag", dragged));

            function dragged(d, i) {
                var v = y.invert(d3.event.y);
                v = Math.min(Math.max(v, minY), maxY);

                if (maxStep) {
                    var v0 = future_start[0][varName];
                    var diff = v - v0;

                    d[varName] = diff > 0 ? Math.min(v, v0 + maxStep*(i+1)) : Math.max(v, v0 - maxStep*(i+1));
                    d3.select(this).attr("cy", d.y = y(d[varName]));
                } else {
                    d[varName] = v;
                    d3.select(this).attr("cy", d.y = d3.event.y);
                }

                repair_data(i);
                update();
                svg.call(triggerEvent, 'change', {detail: future});
            }

            function update() {
                future_path.attr("d", line);
                circles.attr("cy", function(d){return y(d[varName])});
            }

            function repair_data(idx) {
                if (!maxStep) return;

                var idx_value = future[idx][varName];
                var previous_value, i, value;

                previous_value = idx_value;
                for (i = idx + 1; i < future.length; i++) {
                    value = future[i][varName];
                    if (Math.abs(value - previous_value) <= maxStep) break;

                    future[i][varName] = value - previous_value > 0 ? previous_value + maxStep : previous_value - maxStep;
                    future[i].y = y(future[i][varName]);
                    previous_value = future[i][varName];
                }

                previous_value = idx_value;
                for (i = idx - 1; i >=0 ; i--) {
                    value = future[i][varName];
                    if (Math.abs(value - previous_value) <= maxStep) break;

                    future[i][varName] = value - previous_value > 0 ? previous_value + maxStep : previous_value - maxStep;
                    future[i].y = y(future[i][varName]);
                    previous_value = future[i][varName];
                }
            }

            function triggerEvent(selection, name, e) {
                selection.each(function (d) {
                    d3.select(this).node().dispatchEvent(new CustomEvent(name, e));
                });
            }
        });
    }

    my.varName = function(value) {
        if (!arguments.length) return varName;
        varName = value;
        return my;
    };

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

    my.maxStep = function(value) {
        if (!arguments.length) return maxStep;
        maxStep = value;
        return my;
    };




    return my;
}
function singlechart() {

    
    var varName
        , historical = []
        , future = []
        , minY
        , maxY
        , maxStep
        , yFormat = function(v) {return v}
        , yTickValues
        , snapFunction
        , sticky
        , showTips
        , minCurve
        , pension_year
        , pension_year_line
        , x

        // , handlePoints = [2020, 2025, 2030, 2035, 2040, 2045, 2050]
        ;

    function my(selection) {
        selection.each(function(d) {

            var svg = d3.select(this)
                , margin = {top: 5, right: 15, bottom: 15, left: 40}
                , width = +svg.attr("width") - margin.left - margin.right
                , height = +svg.attr("height") - margin.top - margin.bottom
                , g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                ;

            x = d3.scaleLinear()
                .range([0, width]);

            var y = d3.scaleLinear()
                .range([height, 0]);

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
                .tickPadding(5)
                .tickFormat(d3.format("d"));

            var yAxis = d3.axisLeft(y)
                .ticks(3)
                .tickSizeOuter(0)
                .tickSizeInner(-width)
                .tickPadding(5);

            if (yFormat) yAxis.tickFormat(yFormat);
            if (yTickValues) yAxis.tickValues(yTickValues);

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

            var tip_g = g.append("g")
                .attr("class", "tip");
            
            var tip_rect = tip_g.append("rect")
                .attr("x", -22)
                .attr("y", -15)
                .attr("ry", 3)
                .attr("rx", 3)
                .attr("width", 25)
                .attr("height", 20);

            var tipText = tip_g.append("text").attr('text-anchor', "end");


            var x12 = x(pension_year);
            pension_year_line = g.append("line")
                .attr("class", "line pension_year")
                .attr("y1", 0 - margin.top)
                .attr("y2", height + margin.bottom)
                .attr("x1", x12)
                .attr("x2", x12);


            // var handle_points_set = handlePoints.reduce(function(o,v) {o[v] = true; return o}, {});
            var circles = g.selectAll("circle.handle")
                .data(future)
                .enter()
                .append('circle')
                .attr("class", 'handle')
                .attr('cx', function(d) {return x(d.year)})
                .attr('cy', function(d) {return y(d[varName])})
                .attr('r', 5.0)
                .call(d3.drag()
                    .on("drag", dragged)
                    .on("end", dragend)
                );

            function dragged(d, i) {
                var v = y.invert(d3.event.y);
                v = minmax(v, minY, maxY);

                if (snapFunction) {
                    v = snapFunction(v);
                    d3.event.y = y(v);
                }

                if (maxStep) {
                    var v0 = future_start[0][varName];
                    var diff = v - v0;

                    v = diff > 0 ? Math.min(v, v0 + maxStep*(i+1)) : Math.max(v, v0 - maxStep*(i+1));
                    // d3.event.y = y(v);
                } else {
                    // d3.select(this).attr("cy", d3.event.y);
                }

                d3.event.y = y(v);
                d3.select(this).attr("cy", d3.event.y);

                if (sticky) {
                    var prev_val = d[varName];
                    var eps = v - prev_val;

                    for (var j=i+1; j < future.length; j++) {
                        var f_new = future[j][varName] + eps;
                        future[j][varName] = minmax(f_new, minY, maxY);
                    }
                }

                d[varName] = v;

                if (showTips) {
                    tip_g
                        .style("opacity", 1)
                        .translate([d3.select(this).attr('cx') - 10, d3.event.y]);

                    tipText.text(yFormat(v));
                        // .attr("x", )
                        // .attr("y", )
                        // .text(yFormat(v))
                }

                repair_data(i);
                update();
                svg.call(triggerEvent, 'change', {detail: future});
            }
            
            function dragend() {
                if (showTips) {
                    tip_g
                        .transition()
                        .duration(700)
                        .style("opacity", 0);
                }

                svg.call(triggerEvent, 'dragend');
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
                    previous_value = future[i][varName];
                }

                previous_value = idx_value;
                for (i = idx - 1; i >=0 ; i--) {
                    value = future[i][varName];
                    if (Math.abs(value - previous_value) <= maxStep) break;

                    future[i][varName] = value - previous_value > 0 ? previous_value + maxStep : previous_value - maxStep;
                    previous_value = future[i][varName];
                }
            }

            function triggerEvent(selection, name, e) {
                selection.each(function (d) {
                    d3.select(this).node().dispatchEvent(new CustomEvent(name, e));
                });
            }

            function minmax(v, min, max) {
                return Math.min(Math.max(v, min), max);
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

    my.yFormat = function(value) {
        if (!arguments.length) return yFormat;
        yFormat = value;
        return my;
    };

    my.yTickValues = function(value) {
        if (!arguments.length) return yTickValues;
        yTickValues = value;
        return my;
    };
    
    my.snapFunction = function(value) {
        if (!arguments.length) return snapFunction;
        snapFunction = value;
        return my;
    };

    my.sticky = function(value) {
        if (!arguments.length) return sticky;
        sticky = value;
        return my;
    };

    my.showTips = function(value) {
        if (!arguments.length) return showTips;
        showTips = value;
        return my;
    };

    my.minCurve = function(value) {
        if (!arguments.length) return minCurve;
        minCurve = value;
        
        //todo recalculate minimals
        return my;
    };

    my.pension_year = function(value) {
        if (!arguments.length) return pension_year;
        pension_year = value;
        return my;        
    };

    my.update_pension_year = function(value) {
        if (arguments.length) {
            pension_year = value;
        }

        var x12 = x(pension_year);
        pension_year_line.attr("x1", x12).attr("x2", x12);
        return my;
    };

    
    //
    // my.handlePoints = function(value) {
    //     if (!arguments.length) return handlePoints;
    //     handlePoints = value;
    //     return my;
    // };


    return my;
}

function bigchart() {
    var varName
        , minY
        , maxY
        , yFormat = function(v) {return v}
        , yTickValues
        , yText = ''
        , showPrevious

        , width
        , height
        , previous_future_path
        , future_path
        , future_area
        , area

        , line

        , x
        , y

        , yAxis

        , minYear = 2005
        , maxYear = 2050
        , history
        , first_update = true
        , __data__
        , __prev_data__
        , message
        , pension_year
        , pension_year_line_g
        , clip
        , showTips
        , tip_g
        , tipText
        
        , target
        , tipG
        , tipGx = 150
        , target_data
        , target_area

        , minYscales
        , svg
        ;
    
    function my(selection) {
        selection.each(function(d){
            
            svg = d3.select(this);

            var margin = {top: 20, right: 80, bottom: 30, left: 50}
                , width = svg.attr("width") - margin.left - margin.right
                , height = svg.attr("height") - margin.top - margin.bottom
                , g = svg.append("g").translate([margin.left, margin.top])
                ;

            if (clip) {
                svg.append('clipPath')
                    .attr('id', varName + "-chart-clip")
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', width)
                    .attr('height', height);
            }

            x = d3.scaleLinear().range([0, width]);
            y = d3.scaleLinear().range([height, 0]);

            x.domain([minYear, maxYear]);
            y.domain([minY, maxY]);

            line = d3.line()
            // .curve(d3.curveMonotoneX)
                .x(function(d) { return x(d.year)})
                .y(function(d) { return y(d[varName])});

            area = d3.area()
                .x(function(d) { return x(d.year)})
                .y0(function() {return y(0)})
                .y1(function(d) { return y(d[varName])});

            var historical_area = g.append("path")
                .attr("class", "area historical")
                .attr("d", area(history));

            var historical_path = g.append("path")
                .attr("class", "line historical")
                .attr("d", line(history));

            future_area = g
                .append("path")
                .attr("class", "area future");
            
            target_area = g
                .append("path")
                .attr("class", "area target");

            pension_year_line_g = g
                .append("g")
                .attr("class", "pension_year");

            //line
            pension_year_line_g
                .append("line")
                .attr("class", "line")
                .attr("y1", 0 - margin.top)
                .attr("y2", height + margin.bottom - 5);

            if (showPrevious) {
                previous_future_path = g
                    .append("path")
                    .attr("class", "line previous");

                if (clip) previous_future_path.attr("clip-path", "url(#" + varName + "-chart-clip)");
            }

            future_path = g
                .append("path")
                .attr("class", "line future");
                // .attr("clip-path", "url(#ballance-chart-clip)");

            if (clip) {
                future_area.attr("clip-path", "url(#" + varName + "-chart-clip)");
                future_path.attr("clip-path", "url(#" + varName + "-chart-clip)");
                historical_area.attr("clip-path", "url(#" + varName + "-chart-clip)");
                historical_path.attr("clip-path", "url(#" + varName + "-chart-clip)");
            }

            tip_g = g.append("g")
                .attr("class", "tip");

            var tip_rect = tip_g.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("ry", 3)
                .attr("rx", 3)
                .attr("width", 25)
                .attr("height", 20);

            tipText = tip_g.append("text").attr('text-anchor', "start").attr("dy", 14).attr("dx", 2);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickFormat(d3.format("d")));

            yAxis = d3.axisLeft(y)
                .ticks(4);

            if (yFormat) yAxis.tickFormat(yFormat);
            if (yTickValues) yAxis.tickValues(yTickValues);

            g.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text(yText);

            message = g.append("text")
                .attr("class", "message")
                .attr("y", 20)
                .attr("x", 180);

            var swoopy = swoopyArrow()
                .angle(Math.PI/2)
                .clockwise(false)
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; });

            pension_year_line_g
                .append("path")
                .attr('marker-end', 'url(#arrowhead)')
                .attr('class', 'swoopy-arrow-line')
                .datum([[-40, height + 70], [0, height + 30]])
                .attr("d", swoopy);

            pension_year_line_g
                .append("text")
                .attr('y', height + 70)
                .attr('x', -50)
                .attr('text-anchor', "end")
                .text('рік виходу на пенсію');

            if (target) {
                target_data = [{year: last(history).year}, {year: maxYear}];
                target_data[0][varName] = target;
                target_data[1][varName] = target;
                g.call(addTargetTip);
            }
        });
    }

    function rescaleY() {
        var future_extent = d3.extent(__data__, function(d) {return d[varName]});
        var history_extent = d3.extent(history, function(d) {return d[varName]});

        var dmin = Math.min(future_extent[0], history_extent[0]);
        var dmax = Math.max(future_extent[1], history_extent[1]);

        var s = [minY, maxY];

        var min, max;

        for (var i = 0; i < minYscales.length - 1; i++) {
            min = minYscales[i];
            max = minYscales[i+1];

            if (dmin >= min && dmin <= max) break;
        }

        if (dmin < minYscales[0]) s[0] = minYscales[0];
        else s[0] = min;

        y.domain(s);

        var t = svg.transition()
            .duration(700);

        t.select("g.axis--y").call(yAxis);
        t.select('.area.future').attr("d", area(__data__));
        t.select('.line.future').attr("d", line(__data__));
        t.select('.area.historical').attr("d", area(history));
        t.select('.line.historical').attr("d", line(history));
        t.select('.area.target').attr("d", area(target_data));
        t.select('.line.previous').attr("d", line(__data__));

        if (target) t.select('g.swoopy-tooltip').translate([tipGx,  y(0) - 15]);
    }

    my.update = function(data, point_index, including_previous) {
        __data__ = data;

        var line_d = line(data);

        if (first_update && showPrevious) {
            __prev_data__ = data;
            previous_future_path.attr("d", line_d);
            first_update = false;
        }

        future_path.attr("d", line_d);
        future_area.attr("d", area(data));

        if (including_previous) previous_future_path.attr("d", line_d);

        pension_year_line_g.translate([x(pension_year), 0]);

        if (showTips && point_index && point_index >= 0) {
            var v = data[point_index][varName];
            var px = x(data[point_index].year);
            var py = y(v);

            tip_g
                .style("opacity", 1)
                .translate([px - 25 - 4, py - 10]); // tip offset here

            tipText.text(yFormat(v));
        }

        if (target) target_area.attr("d", area(target_data));

        return my;
    };

    my.dragend = function() {
        if (showPrevious) {
            var diff = __data__.map(function(d, i){
                return d[varName] - __prev_data__[i][varName];
            }).reduce(function(o,v) {return o + v});

            __prev_data__ = __data__;

            previous_future_path
                .transition()
                .duration(700)
                .attr("d", future_path.attr("d"));

            message
                .classed("red", diff < 0)
                .classed("green", diff > 0)
                .transition()
                .duration(0)
                .style("opacity", 1)
                .text(d3.format("+.1f")(diff))
                .transition()
                .duration(1500)
                .ease(d3.easeExpIn)
                .style("opacity", 0);
        }

        if (minYscales) rescaleY();

        if (showTips) {
            tip_g
                .transition()
                .duration(700)
                .style("opacity", 0);
        }

        return my;
    };
    
    my.varName = function(value) {
        if (!arguments.length) return varName;
        varName = value;
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

    my.yFormat = function(value) {
        if (!arguments.length) return yFormat;
        yFormat = value;
        return my;
    };

    my.yText = function(value) {
        if (!arguments.length) return yText;
        yText = value;
        return my;
    };
    
    my.history = function(value) {
        if (!arguments.length) return history;
        history = value;
        return my;
    };

    my.pension_year = function(value) {
        if (!arguments.length) return pension_year;
        pension_year = value;
        return my;
    };

    my.showPrevious = function(value) {
        if (!arguments.length) return showPrevious;
        showPrevious = value;
        return my;
    };

    my.yTickValues = function(value) {
        if (!arguments.length) return yTickValues;
        yTickValues = value;
        return my;
    };

    my.clip = function(value) {
        if (!arguments.length) return clip;
        clip = value;
        return my;
    };

    my.showTips = function(value) {
        if (!arguments.length) return showTips;
        showTips = value;
        return my;
    };

    my.target = function(value) {
        if (!arguments.length) return target;
        target = value;
        return my;
    };

    my.minYscales = function(value) {
        if (!arguments.length) return minYscales;
        minYscales = value;
        return my;
    };

    function addTargetTip(selection) {
        selection.each(function(d) {
            var swoopyTip = swoopyArrow()
                .angle(Math.PI/1.5)
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; });

            tipG = d3.select(this)
                .append("g")
                .attr("class" ,"swoopy-tooltip")
                .translate([tipGx, y(0) - 15]);

            tipG
                .append("text")
                .attr('y', 4)
                .attr('x', -5)
                .attr('text-anchor', "end")
                .text('Ваша ціль');

            tipG
                .append("path")
                .attr('marker-end', 'url(#arrowhead)')
                .attr('class', 'swoopy-arrow-line')
                .datum([[0, 0], [30, 15]])
                .attr("d", swoopyTip);
        });
    }

    function last(arr) {
        return arr[arr.length - 1];
    }

    return my;
}

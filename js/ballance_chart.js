var ballance_chart = (function(d3) {
    var module = {}
        , container



        , svg
        , margin
        , width
        , height
        , g
        , line

        , x
        , y

        , moving_line
        , timer
        , time = 0
        , timeScale

        , previous_data

        // , z


        ;

    module.init = function(_) {
        container = _;

        svg = d3.select(container);
        margin = {top: 20, right: 80, bottom: 30, left: 50};
        width = svg.attr("width") - margin.left - margin.right;
        height = svg.attr("height") - margin.top - margin.bottom;
        g = svg.append("g").translate([margin.left, margin.top]);

        x = d3.scaleTime().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);
        // z = d3.scaleOrdinal(d3.schemeCategory10);

        x.domain([new Date(2016,1,1), new Date(2035,1,1)]);
        y.domain([-500, 0]);

        line = d3.line()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.ballance); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Баланс, млрд. грн");

        moving_line = g.append('line')
            .attr('class', 'moving-line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', "orange");

        timeScale = d3.scaleTime().domain([new Date(2016,1,1), new Date(2035,1,1)]).range([0, 30000]);

    };

    module.draw = function(data) {
        console.log("data");
        console.log(data);

        if (time != 0) {
            var elapsed_date = timeScale.invert(time);

            var prev_part = previous_data.filter(function(d) {return d.year <= elapsed_date});
            var future_part = data.filter(function(d) {return d.year > elapsed_date});

            data = prev_part.concat(future_part);
        }

        d3.selectAll("g.chart")
            .classed("old", true);

        var chart = g
            .append('g')
            .attr("class", "chart");

        chart.append("path")
            .attr("class", "line")
            .attr("d", line(data));

        previous_data = data;
    };

    module.move_line = function(time) {
        var x_ = x(time);
        moving_line
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('x1', x_)
            .attr('x2', x_);
    };

    module.reset_line = function() {
        moving_line
            .attr('x1', 0)
            .attr('x2', 0);
    };

    module.start_timer = function() {
        if (timer) timer.stop();
        module.reset_line();

        timer = d3.interval(function(elapsed) {
            if (elapsed > 30000) timer.stop();

            time = elapsed;
            ballance_chart.move_line(timeScale.invert(elapsed));
        }, 500);
    };


    return module;
})(d3);
var ballance_chart = (function(d3) {
    var module = {}
        , container

        , svg
        , margin
        , width
        , height
        , g
        , prediction_g
        , actual_g
        , prediction_path
        , actual_path
        , current_clip_path
        , line

        , x
        , y

        , moving_line
        , timer
        , time = 0
        , timeScale

        , previous_data

        , minYear = 2016
        , maxYear = 2050
        , playDuration = 100000
        , transitionTime = 500
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

        x.domain([new Date(minYear,1,1), new Date(maxYear,1,1)]);
        y.domain([-150, 50]);

        line = d3.line()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.ballance); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height/4 + ")")
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
            .attr('y2', height);

        prediction_g = g
            .append('g')
            .attr("class", "prediction");

        actual_g = g
            .append('g')
            .attr("class", "actual")
            .attr("clip-path", "url(#current-clip-path)");

        actual_path = actual_g
            .append("path")
            .attr("class", "line");

        prediction_path = prediction_g
            .append("path")
            .attr("class", "line");

        current_clip_path = svg.append("defs")
            .append("clipPath")
            .attr("id", "current-clip-path")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", 0);

        timeScale = d3.scaleTime().domain([new Date(minYear,1,1), new Date(maxYear,1,1)]).range([0, playDuration]);
    };

    module.draw = function(data) {
        if (time != 0) {
            var elapsed_date = timeScale.invert(time);

            var prev_part = previous_data.filter(function(d) {return d.year <= elapsed_date});
            var future_part = data.filter(function(d) {return d.year > elapsed_date});

            data = prev_part.concat(future_part);
        }

        var line_d = line(data);

        prediction_path
            .transition()
            .duration(200)
            .attr("d", line_d);

        actual_path
            .transition()
            .duration(200)
            .attr("d", line_d);

        previous_data = data;
    };

    module.move_line = function(time) {
        var x_ = x(time);
        moving_line
            .transition()
            .duration(transitionTime)
            .ease(d3.easeLinear)
            .attr('x1', x_)
            .attr('x2', x_);

        current_clip_path
            .transition()
            .duration(transitionTime)
            .ease(d3.easeLinear)
            .attr("width", x_);
    };

    module.reset_line = function() {
        moving_line
            .attr('x1', 0)
            .attr('x2', 0);
        
        time = 0;
    };
    
    module.start_timer = function() {
        if (timer) timer.stop();

        timer = d3.interval(function(elapsed) {
            if (elapsed > playDuration) timer.stop();

            time = elapsed;
            ballance_chart.move_line(timeScale.invert(elapsed));
        }, transitionTime);
    };


    return module;
})(d3);
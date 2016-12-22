function ballance_chart() {
        var width
        , height
        , g
        // , prediction_g
        // , actual_g
        , prediction_path
        , actual_path
        , area
        // , current_clip_path
        , line

        , x
        , y

        // , moving_line
        // , timer
        // , ms_time = 0
        // , year

        // , timeScale
        // , _onTimer = function() {console.log('_onTimer stub')}
        // , _onYear = function() {console.log('_onYear stub')}

        // , previous_data
        // , background_year

        , minYear = 2016
        , maxYear = 2050
        // , playDuration = 100000
        // , transitionTime = 500
        ;
    
    function my(selection) {
        selection.each(function(d){
            
            var svg = d3.select(this)
                , margin = {top: 20, right: 80, bottom: 30, left: 50}
                , width = svg.attr("width") - margin.left - margin.right
                , height = svg.attr("height") - margin.top - margin.bottom
                , g = svg.append("g").translate([margin.left, margin.top])
                ;

            x = d3.scaleLinear().range([0, width]);
            y = d3.scaleLinear().range([height, 0]);

            x.domain([minYear, maxYear]);
            y.domain([-150, 50]);

            line = d3.line()
            // .curve(d3.curveMonotoneX)
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(d.ballance); });

            // g.append("rect")
            //     .attr("class", "green-zone")
            //     .attr("x", 0)
            //     .attr("y", 0)
            //     .attr("width", width)
            //     .attr("height", height/4);
            //
            // g.append("rect")
            //     .attr("class", "yellow-zone")
            //     .attr("x", 0)
            //     .attr("y", height/4)
            //     .attr("width", width)
            //     .attr("height", height/4);
            //
            // g.append("rect")
            //     .attr("class", "red-zone")
            //     .attr("x", 0)
            //     .attr("y", height/2)
            //     .attr("width", width)
            //     .attr("height", height/2);
            //
            // moving_line = g.append('line')
            //     .attr('class', 'moving-line')
            //     .attr('x1', 0)
            //     .attr('x2', 0)
            //     .attr('y1', 0)
            //     .attr('y2', height);

            var prediction_g = g
                .append('g')
                .attr("class", "prediction");

            var actual_g = g
                .append('g')
                .attr("class", "actual");
            // .attr("clip-path", "url(#current-clip-path)");

            actual_path = actual_g
                .append("path")
                .attr("class", "line");

            area = prediction_g
                .append("path")
                .attr("class", "area");

            prediction_path = prediction_g
                .append("path")
                .attr("class", "line");

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickFormat(d3.format("d")));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(3))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Баланс, млрд. грн");

            // current_clip_path = svg.append("defs")
            //     .append("clipPath")
            //     .attr("id", "current-clip-path")
            //     .append("rect")
            //     .attr("x", 0)
            //     .attr("y", 0)
            //     .attr("height", height)
            //     .attr("width", 0);

            // background_year = g.append('text')
            //     .attr("class", "background-year")
            //     .attr("x", 260)
            //     .attr("y", 200)
            //     .attr("textLength", 130)
            //     .attr("lengthAdjust", "spacingAndGlyphs");

            // timeScale = d3.scaleTime().domain([new Date(minYear,1,1), new Date(maxYear,1,1)]).range([0, playDuration]);
            // year = timeScale.invert(0).getFullYear() - 1;
        });
    }
    
    my.update = function(data) {
        // if (ms_time != 0) {
        //     var elapsed_date = timeScale.invert(ms_time);
        //
        //     var prev_part = previous_data.filter(function(d) {return d.year <= elapsed_date});
        //     var future_part = data.filter(function(d) {return d.year > elapsed_date});
        //
        //     data = prev_part.concat(future_part);
        // }

        var line_d = line(data);

        var area_gen = d3.area()
            .x(function(d) { return x(d.year) })
            .y0(y(0))
            .y1(function(d) { return y(d.ballance) });

        prediction_path.attr("d", line_d);
        actual_path.attr("d", line_d);
        area.attr("d", area_gen(data));
    };

    // module.move_line = function(time) {
    //     var x_ = x(time);
    //     moving_line
    //         .transition()
    //         .duration(transitionTime)
    //         .ease(d3.easeLinear)
    //         .attr('x1', x_)
    //         .attr('x2', x_);
    //
    //     current_clip_path
    //         .transition()
    //         .duration(transitionTime)
    //         .ease(d3.easeLinear)
    //         .attr("width", x_);
    //
    //     background_year.text(time.getFullYear());
    // };
    //
    // module.reset_line = function() {
    //     moving_line
    //         .attr('x1', 0)
    //         .attr('x2', 0);
    //
    //     ms_time = 0;
    // };
    //
    // module.start_timer = function() {
    //     if (timer) timer.stop();
    //
    //     timer = d3.interval(function(elapsed) {
    //         if (elapsed > playDuration) timer.stop();
    //
    //         ms_time = elapsed;
    //         var dateTime = timeScale.invert(elapsed);
    //
    //         ballance_chart.move_line(dateTime);
    //
    //         onTimer(dateTime);
    //
    //         // var pension_val = controls.controls.pension_avg.value();
    //         // controls.controls.pension_avg.value(pension_val + 10);
    //
    //     }, transitionTime);
    // };
    //
    // function onTimer(dateTime) {
    //     var new_year = dateTime.getFullYear();
    //
    //     if (new_year != year) _onYear(new_year);
    //     year = new_year;
    // }
    //
    // module.onYear = function(_) {
    //     _onYear = _;
    //     return module;
    // };

    return my;
}

function ballance_chart() {
    var width
        , height
        , previous_path
        , prediction_path
        , historical_path
        , area
        , area_gen

        , line

        , x
        , y

        , minYear = 2005
        , maxYear = 2050
        , history
        , first_update = true
        , __data__
        , __prev_data__
        , message
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
            y.domain([-150/10, 100/10]);

            line = d3.line()
            // .curve(d3.curveMonotoneX)
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(d.ballance); });

            area_gen = d3.area()
                .x(function(d) { return x(d.year) })
                .y0(y(0))
                .y1(function(d) { return y(d.ballance) });
            
            // g layers
            //
            // var previous_g = g
            //     .append("g")
            //     .attr("class", "previous");

            var prediction_g = g
                .append('g')
                .attr("class", "prediction");

            var historical_g = g
                .append('g')
                .attr("class", "historical");
            //
            //
            historical_g
                .append("path")
                .attr("class", "area")
                .attr("d", area_gen(history));

            historical_path = historical_g
                .append("path")
                .attr("class", "line")
                .attr("d", line(history));

            area = prediction_g
                .append("path")
                .attr("class", "area");

            previous_path = prediction_g
                .append("path")
                .attr("class", "line previous");

            prediction_path = prediction_g
                .append("path")
                .attr("class", "line");

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickFormat(d3.format("d")));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(4))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("млрд. $");

            message = g.append("text")
                .attr("class", "message")
                .attr("y", 40)
                .attr("x", 150);
        });
    }
    
    my.update = function(data) {
        __data__ = data;

        var line_d = line(data);

        if (first_update) {
            __prev_data__ = data;
            previous_path.attr("d", line_d);
            first_update = false;
        }

        prediction_path.attr("d", line_d);
        area.attr("d", area_gen(data));
        return my;
    };

    my.dragend = function() {
        var diff = __data__.map(function(d, i){
            return d.ballance - __prev_data__[i].ballance;
        }).reduce(function(o,v) {return o + v});

        console.log(diff);

        __prev_data__ = __data__;

        previous_path
            .transition()
            .duration(700)
            .attr("d", prediction_path.attr("d"));

        message
            .style("opacity", 1)
            .text(d3.format("+.2f")(diff))
            .transition()
            .duration(1500)
            .ease(d3.easeExpIn)
            .style("opacity", 0);


        return my;
    };
    
    my.history = function(value) {
        if (!arguments.length) return history;
        history = value;
        return my;
    };

    return my;
}

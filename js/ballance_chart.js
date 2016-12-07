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
        // , z


        ;

    module.init = function(_) {
        container = _;

        svg = d3.select(container);
        margin = {top: 20, right: 80, bottom: 30, left: 50};
        width = svg.attr("width") - margin.left - margin.right;
        height = svg.attr("height") - margin.top - margin.bottom;
        g = svg.append("g").translate([margin.left, margin.top]);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);
        // z = d3.scaleOrdinal(d3.schemeCategory10);

        x.domain([2016, 2035]);
        y.domain([-500, 0]);

        line = d3.line()
            .curve(d3.curveBasis)
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

    };

    module.draw = function(data) {
        d3.selectAll("g.chart")
            .classed("old", true);
        
        var chart = g
            .append('g')
            .attr("class", "chart");

        chart.append("path")
            .attr("class", "line")
            .attr("d", line(data));
    };


    return module;
})(d3);
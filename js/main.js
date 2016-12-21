(function () {
    var years = [];
    for (var y = 2016; y <= 2050; y++) years.push(y);

    var history = window.__demographics__.history;

    var future_years = years.slice(1);
    var future = {
        pension_age: future_years.map(function(y){return {year: y, value: last(history.pension_age).value}}),
        pension_avg: future_years.map(function(y){return {year: y, value: last(history.pension_avg).value}}),
        esv_rate: future_years.map(function(y){return {year: y, value: last(history.esv_rate).value}}),
        payers_rate: future_years.map(function(y){return {year: y, value: last(history.payers_rate).value}})
    };

    var pension_age = singlechart()
        .historical(history.pension_age)
        .future(future.pension_age)
        .minY(50)
        .maxY(70)
        .maxStep(0.5);

    var esv_rate = singlechart()
        .historical(history.esv_rate)
        .future(future.esv_rate)
        .maxStep(0.05);
    
    var payers_rate = singlechart()
        .historical(history.payers_rate)
        .future(future.payers_rate)
        .minY(0.2)
        .maxY(0.6);

    var pension_avg = singlechart()
        .historical(history.pension_avg)
        .future(future.pension_avg)
        .maxY(5000);

    d3.select('#pension_age')
        .call(pension_age)
        .on("change", function(d) {console.log(d3.event)});
    
    d3.select('#esv_rate').call(esv_rate);
    d3.select('#payers_rate').call(payers_rate);
    d3.select('#pension_avg').call(pension_avg);

    ballance_chart
        .init('#ballance_chart')
        .onYear(function(year) {
            console.log(year);

            if (year < 2020) {
                controls.controls.pension_age.allowed_interval(null, 60);
            } else {
                controls.controls.pension_age.allowed_interval(null, Math.floor(60 + (year - 2020) / 2));
            }

            // var pension = controls.controls.pension_avg.value();
            // controls.controls.pension_avg.allowed_interval(1700 * Math.pow(1.05, year - 2016), null)
        });
    
    var ballance = ballance_data(currentValues());
    ballance_chart.draw(ballance);

    controls.onChange(function() {
        var values = controls.currentValues();

        parameters.esv_rate.value(values.esv_rate);
        parameters.pension_age.value(values.pension_age);
        parameters.pension_avg.value(values.pension_avg);
        parameters.payers_rate.value(values.payers_rate);
        parameters.salary_avg.value(values.salary_avg);
    });

    parameters.onChange(function(){
        var values = currentValues();

        var ballance = ballance_data(currentValues());
        ballance_chart.draw(ballance);

        $("#pension-age-label").text(values.pension_age);
    });

    $("#start").on("click", function() {
        ballance_chart.reset_line();

        var ballance = ballance_data(currentValues());
        ballance_chart.draw(ballance);

        ballance_chart.start_timer();
    });

    function ballance_data(params) {
        return years.map(function(y) {return {
            year: new Date(y, 1, 1),
            ballance: model.calcBalance(params.pension_age, params.payers_rate, params.esv_rate, params.pension_avg, params.salary_avg, y)
        }});
    }

    function currentValues() {
        return {
            pension_age: parameters.pension_age.value(),
               esv_rate: parameters.esv_rate.value(),
            pension_avg: parameters.pension_avg.value(),
            salary_avg: parameters.salary_avg.value(),
            payers_rate: parameters.payers_rate.value()
        }
    }

    function last(arr) {
        return arr[arr.length-1];
    }
})();

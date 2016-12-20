(function () {
    var years = [];
    for (var y = 2016; y <= 2050; y++) years.push(y);

    var history = window.__demographics__.history;
    var future = {
        pension_age: years.slice(1).map(function(y){return {year: y, value: history.pension_age[0].value}})
    };

    var pension_age = singlechart()
        .historical(history.pension_age)
        .future(future.pension_age)
        .minY(50)
        .maxY(70);

    var chart = singlechart()
        .historical([{year: new Date(2013, 0, 1), value: 3.0}, {year: new Date(2014, 0,1), value: 3.14159}, {year: new Date(2015, 0,1), value: 2.71}, {year: new Date(2016, 0,1), value: 3.0}])
        .future([{year: new Date(2017, 0,1), value: 4.2}, {year: new Date(2018, 0,1), value: 4.2}, {year: new Date(2019, 0,1), value: 4.2}])
        ;

    d3.select('#pension_age').call(pension_age);


    d3.selectAll('#test').call(chart);



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
})();

(function () {
    var years = [];
    for (var y = 2016; y <= 2050; y++) years.push(y);

    ballance_chart
        .init('#ballance_chart');
    
    var ballance = ballance_data(controls.currentValues());
    ballance_chart.draw(ballance);

    controls.onChange(function(){
        var ballance = ballance_data(controls.currentValues());
        ballance_chart.draw(ballance);
    });

    $("#start").on("click", function() {
        ballance_chart.reset_line();

        var ballance = ballance_data(controls.currentValues());
        ballance_chart.draw(ballance);

        ballance_chart.start_timer();
    });
    
    function ballance_data(params) {
        return years.map(function(y) {return {
            year: new Date(y, 1, 1),
            ballance: model.calcBalance(params.pension_age, params.payers_rate, params.esv_rate, params.pension_avg, y)
        }});
    }
})();

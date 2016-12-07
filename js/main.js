(function () {
    console.log(model.calcWorkForce('both', 61, 2016));
    console.log(model.calcPensioners('both', 61, 2016));

    //
    // sliders.onChange(function(){
    //     console.log('YYYYYYOOOObaaa!');
    // })
    
    var years = [];
    for (var y = 2016; y<=2035; y++) years.push(y);

    ballance_chart
        .init('#ballance_chart');

    var params = sliders.currentValues();
    console.log(params);

    // var ballance_data = years.map(function(y) {return {
    //     year: y,
    //     ballance: model.calcBalance(params.pension_age, params.payers_rate, params.esv_rate, params.pension_avg, y)
    // }});

    var ballance = ballance_data(params);
    console.log(params);
    console.log(ballance);


    ballance_chart.draw(ballance_data(params));


    sliders.onChange(function(){
        var ballance = ballance_data(sliders.currentValues());
        
        
        
        
        ballance_chart.draw(ballance);
    });
    
    
    
    
    
    function ballance_data(params) {
        return years.map(function(y) {return {
            year: y,
            ballance: model.calcBalance(params.pension_age, params.payers_rate, params.esv_rate, params.pension_avg, y)
        }});
    }
    
})();

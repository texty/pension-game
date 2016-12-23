(function () {
    var years = [];
    for (var y = 2016; y <= 2050; y++) years.push(y);

    var history = window.__demographics__.history;

    // var future_years = years.slice(1);
    var future_years = [2020, 2025, 2030, 2035, 2040, 2045, 2050];

    var future_start_years = [2016].concat(future_years);

    var last_in_history = last(history);
    var future = future_years.map(function(y){
       return {
           year: y,
           pension_age: last_in_history.pension_age,
           pension_avg: last_in_history.pension_avg,
           esv_rate: last_in_history.esv_rate,
           payers_rate: last_in_history.payers_rate
       } 
    });

    var future_start = [last(history)].concat(future);

    var pension_age = singlechart()
        .historical(history)
        .future(future)
        .varName('pension_age')
        .minY(55)
        .maxY(65)
        .maxStep(0.5*5);

    var esv_rate = singlechart()
        .varName('esv_rate')
        .historical(history)
        .future(future)
        .minY(0.1)
        .maxStep(0.1)
        .yFormat(d3.format('.0%'));

    var payers_rate = singlechart()
        .varName('payers_rate')
        .historical(history)
        .future(future)
        .minY(0.2)
        .maxY(0.6)
        .yFormat(d3.format('.0%'));

    var pension_avg = singlechart()
        .varName('pension_avg')
        .historical(history)
        .future(future)
        .maxY(5000)
        .maxStep(1000 * 2);

    d3.select('#pension_age').call(pension_age).on("change", update);
    d3.select('#esv_rate').call(esv_rate).on("change", update);
    d3.select('#payers_rate').call(payers_rate).on("change", update);
    d3.select('#pension_avg').call(pension_avg).on("change", update);

    var main_chart = ballance_chart()
        .history(history);

    d3.select("#ballance_chart").call(main_chart);
    main_chart.update(ballance_data());

    function last(arr) {
        return arr[arr.length-1];
    }

    function update() {
        main_chart.update(ballance_data());
    }

    function ballance_data() {
        return future_start_years.map(function(y, i) {
            return {
                year: y,
                ballance: model.calcBalanceFixedSalary(Math.round(future_start[i].pension_age), future_start[i].payers_rate, future_start[i].esv_rate, future_start[i].pension_avg, y)
            }
        });
    }
})();

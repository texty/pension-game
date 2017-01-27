//todo wrap in closure

d3.select("#submit").on("click", function() {
    d3.select(".main-content").classed("hidden", false);
    d3.select(".start-question").classed("hidden", true);
    window.deficit_top = $("#deficit").offset().top - 80;

    $('html,body').animate({
        scrollTop: $(".main-content").offset().top
    }, 1000);


    var pension_target_size = +d3.select('#input-pension').node().value;
    var user_age = +d3.select('#input-age').node().value;

    d3.select("#user_age").text(user_age);
    d3.select("#pension_target").text(pension_target_size);


    var years = [];
    for (var y = 2016; y <= 2050; y++) years.push(y);

    var history = window.__demographics__.history;

    // var future_years = years.slice(1);
    var future_years = [2020, 2025, 2030, 2035, 2040, 2045, 2050];

    var future_start_years = [2016].concat(future_years);

    var last_in_history = last(history);

    var future = future_years.map(function(y, i) {
       return {
           year: y,
           pension_age: last_in_history.pension_age,
           // pension_avg will be filled later
           salary_avg: last_in_history.salary_avg,
           esv_rate: last_in_history.esv_rate,
           payers_rate: last_in_history.payers_rate,
           dreg: last_in_history.dreg
       }
    });

    window.future = future;

    var current_year = new Date().getFullYear();
    var pension_year = calc_pension_year(current_year, user_age, future);

    var pension_size_scale = d3.scaleLinear()
        .domain([last_in_history.year, pension_year])
        .range([last_in_history.pension_avg, pension_target_size]);

    future.forEach(function(d) { d.pension_avg = pension_size_scale(d.year) });

    var future_start = [last(history)].concat(future);

    var pension_age = smallchart()
        .historical(history)
        .future(future)
        .varName('pension_age')
        .minY(55)
        .maxY(65)
        .maxStep(0.5*5)
        .yTickValues([55, 60, 65])
        .snapFunction(Math.round)
        // .sticky(true)
        .showTips(true)
        .drawMode(true)
        .pension_year(pension_year);

    var esv_rate = smallchart()
        .varName('esv_rate')
        .historical(history)
        .future(future)
        .minY(0.1)
        .maxY(0.4)
        .maxStep(0.1)
        .yFormat(d3.format('.0%'))
        .yTickValues([.1, .2, .3, .4])
        // .sticky(true)
        .showTips(true)
        .drawMode(true)
        .pension_year(pension_year);
    //
    // var payers_rate = smallchart()
    //     .varName('payers_rate')
    //     .historical(history)
    //     .future(future)
    //     .minY(0.3)
    //     .maxY(0.6)
    //     .yTickValues([.3, .4, .5, .6])
    //     .yFormat(d3.format('.0%'))
    //     .sticky(true)
    //     .showTips(true)
    //     .pension_year(pension_year);

    var pension_avg = smallchart()
        .varName('pension_avg')
        .historical(history)
        .future(future)
        .minY(50)
        // .maxY(200)
        .maxStep(50)
        // .yTickValues([50, 100, 150, 200])
        .yFormat(d3.format(".0f"))
        // .sticky(true)
        .showTips(true)
        .drawMode(true)
        .pension_year(pension_year);

    var salary_avg = smallchart()
        .varName('salary_avg')
        .historical(history)
        .future(future)
        .minY(0)
        .maxY(600)
        .maxStep(109)
        .yTickValues([0, 200, 400, 600])
        .yFormat(d3.format(".0f"))
        // .sticky(true)
        .showTips(true)
        .drawMode(true)
        .pension_year(pension_year);

    var dreg = smallchart()
        .varName('dreg')
        .historical(history)
        .future(future)
        .minY(1)
        .maxY(5)
        .maxStep(1.25)
        .yTickValues([1, 2, 3, 4, 5])
        .yFormat(d3.format(".0f"))
        // .sticky(true)
        .showTips(true)
        .drawMode(true)
        .pension_year(pension_year);

    var ballance_chart = bigchart()
        .varName("ballance")
        .history(history)
        .minY(-35)
        .maxY(10)
        .yText("млрд. $")
        .showPrevious(true)
        // .yFormat()
        .pension_year(pension_year);

    var payers_rate = bigchart()
        .varName("payers_rate")
        .history(history)
        .minY(0)
        .maxY(1)
        .yFormat(d3.format('.0%'))
        .pension_year(pension_year);

    d3.select("#ballance").call(ballance_chart);
    d3.select('#payers_rate').call(payers_rate); //.on("change", update);
    ballance_chart.update(ballance_data());
    payers_rate.update(payers_rate_data());

    d3.select('#pension_age').call(pension_age).on("change", update_pension_age_changed).on("dragend", ballance_chart.dragend);
    d3.select('#esv_rate').call(esv_rate).on("change", update_payers_rate).on("dragend", ballance_chart.dragend);
    d3.select('#pension_avg').call(pension_avg).on("change", update).on("dragend", ballance_chart.dragend);
    d3.select('#salary_avg').call(salary_avg).on("change", update).on("dragend", ballance_chart.dragend);
    d3.select('#dreg').call(dreg).on("change", update_payers_rate).on("dragend", ballance_chart.dragend);


    function last(arr) {
        return arr[arr.length-1];
    }

    function update_pension_age_changed() {
        var pension_year = calc_pension_year(current_year, user_age, future);

        ballance_chart.pension_year(pension_year);
        payers_rate.pension_year(pension_year);

        pension_age.update_pension_year(pension_year);
        esv_rate.update_pension_year(pension_year);
        // payers_rate.update_pension_year(pension_year);
        pension_avg.update_pension_year(pension_year);
        salary_avg.update_pension_year(pension_year);
        dreg.update_pension_year(pension_year);
        update();
    }

    function update_payers_rate() {
        var p_data = payers_rate_data();
        payers_rate.update(p_data);
        future_start.forEach(function(d, i) {d.payers_rate = p_data[i].payers_rate});

        update();
    }

    function update() {
        ballance_chart.update(ballance_data());
    }

    function payers_rate_data() {
        return future_start_years.map(function(y, i) {
            return {
                year: y,
                payers_rate: model.calcPayersRate(future_start[i].esv_rate, future_start[i].dreg)
            }
        });
    }

    function ballance_data() {
        return future_start_years.map(function(y, i) {
            return {
                year: y,
                ballance: model.calcBalance(Math.round(future_start[i].pension_age), future_start[i].payers_rate, future_start[i].esv_rate, future_start[i].pension_avg, future_start[i].salary_avg,  y)
            }
        });
    }

    function calc_pension_year(current_year, user_age, future) {
        var f1, f2, age_y1, age_y2;

        for (var i = 0; i < future.length - 1; i++) {
            f1 = future[i];
            f2 = future[i+1];

            age_y1 = user_age + f1.year - current_year;
            age_y2 = user_age + f2.year - current_year;

            if (f1.pension_age >= age_y1 && f2.pension_age <= age_y2) break;
        }

        for (var y = f1.year; y <= f2.year; y++) {
            var age_y = user_age + y - current_year;
            var pension_age = f1.pension_age + (y - f1.year) / (f2.year - f1.year) * (f2.pension_age - f1.pension_age);

            if (age_y >= pension_age) return y;
        }
        return y;
    }
});


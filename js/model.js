var model = (function(){

    var module = {}
        , demographics = window.__demographics__
        , minYear = window.__minYear__
        , maxYear = window.__maxYear__
        ;

    module.demographics = function() {
        return demographics;
    };

    module.minYear = function() {
        return minYear;
    };

    module.maxYear = function() {
        return maxYear;
    };

    module.getPopulation = function(sex, age, year) {
        return demographics[sex][age][year - minYear];
    };

    module.calcWorkForce = function(sex, pension_age, year) {
        return d3.sum(demographics[sex]
            .slice(15, pension_age)
            .map(function(arr){return arr[year - minYear]})
        ) / 1000;
    };

    module.calcPensioners = function(sex, pension_age, year) {
        return d3.sum(demographics[sex]
            .slice(pension_age)
            .map(function(arr){return arr[year - minYear]})
        ) / 1000;
    };

    module.calcBalance = function(pension_age, payers_rate, esv_rate, pension_avg, salary_avg, year) {
        var workForce = module.calcWorkForce('both', pension_age, year); //millions
        var pensioners = module.calcPensioners('both', pension_age, year); //millions
        var payers = payers_rate * workForce; //millions
        
        var income = salary_avg * payers * esv_rate * 12 / 1000; //billions UAH 
        var outcome = pensioners * pension_avg * 12 / 1000; //billions UAH

        return income - outcome;
    };

    module.calcBalanceFixedSalary = function(pension_age, payers_rate, esv_rate, pension_avg, year) {
        return module.calcBalance(pension_age, payers_rate, esv_rate, pension_avg, pension_avg * 3, year);
    };
    
    module.calcPayersRate = function(esv_rate, dreg) {
        var dreg_0 = 1
            , esv_0 = 0.175
            , pr_0 = 0.407

            , k_esv = -1.5
            , k_dreg = 0.08
            ;

        return minmax(pr_0 + k_esv * (esv_rate - esv_0) + k_dreg * (dreg - dreg_0), 0, 1);
    };

    function minmax(v, min, max) {
        return Math.min(Math.max(v, min), max);
    }

    return module;
})();
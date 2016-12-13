var controls = (function() {
    var module = {}
        , _onChange = function(){}
        ;
    
    module.onChange = function(_) {
        if (!arguments.length) return _onChange;
        
        _onChange = _;
        return module;
    };
    
    module.controls  = {
        pension_age: init_slider('#age', 55, 65, 1, 60, _onChange),
        payers_rate: init_slider('#payers', .35, .45, .01, .4, _onChange),
        esv_rate: init_slider('#esv', .1, .5, .005, .175, _onChange),
        pension_avg: init_slider('#pension', 1700, 5000, 100, 1700, _onChange)
    };
    
    module.currentValues = function() {
        return {
            pension_age: +$('#age').val(),
            payers_rate: +$('#payers').val(),
            esv_rate: +$('#esv').val(),
            pension_avg: +$('#pension').val()
        };
    };

    function init_slider(slider, min, max, step, value) {
        var control = $(slider);

        control.knob({
            min: min,
            max: max,
            step: step,
            change: function(value){console.log("change"); return _onChange(value)},
            release: function(value){console.log('release'); return _onChange(value)},
            skin: "tron",
            // cursor: true,
            height: 100,
            width: 100
        });

        control
            .val(value)
            .trigger('change');
        
        return control;
    }

    return module;

})();

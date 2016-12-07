var sliders = (function() {
    var module = {}
        , _onChange = function(){}
        ;
    
    module.onChange = function(_) {
        if (!arguments.length) return _onChange;
        
        _onChange = _;
        return module;
    };
    
    module.sliders  = {
        pension_age: init_slider('#age-handle','#age', 55, 65, 1, 60, _onChange),
        payers_rate: init_slider('#payers-handle','#payers', .35, .45, .01, .4, _onChange),
        esv_rate: init_slider('#esv-handle','#esv', .1, .5, .005, .175, _onChange),
        pension_avg: init_slider('#pension-handle','#pension', 1000, 10000, 100, 1700, _onChange)
    };
    
    module.currentValues = function() {
        return {
            pension_age: $('#age').slider('option', 'value'),
            payers_rate: $('#payers').slider('option', 'value'),
            esv_rate: $('#esv').slider('option', 'value'),
            pension_avg: $('#pension').slider('option', 'value')
        };
        //todo
        // return {
        //     pension_age: 55,
        //     payers_rate: .5,
        //     esv_rate: .1,
        //     pension_avg: 1000
        // }
    };

    function init_slider(handle, slider, min, max, step, value) {
        var obj = {};
        obj.handle = $(handle);
        obj.slider = $(slider).slider({
            orientation: "vertical",
            create: function () {
                obj.handle.text($(this).slider("value"));
            },
            slide: function (event, ui) {
                obj.handle.text(ui.value);
            },
            change: function(args){return _onChange(args)},
            min: min,
            max: max,
            step: step,
            value: value
        });
        
        return obj;
    }

    return module;

})();

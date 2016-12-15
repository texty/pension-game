var controls = (function() {
    var module = {}
        , _onChange = function(){console.log("c stub")};
    
    module.onChange = function(_) {
        if (!arguments.length) return _onChange;
        
        _onChange = _;
        return module;
    };
    
    module.controls  = {
        pension_age: init_slider('#age', 55, 70, 1, 60),
        payers_rate: init_slider('#payers', .35, .45, .01, .4),
        esv_rate: init_slider('#esv', .1, .35, .005, .175),
        pension_avg: init_slider('#pension', 1700, 5000, 100, 1700),
        salary_avg: init_slider('#salary', 1700 * 2, 5000 * 3, 100, 1700 * 3)
    };
    
    module.currentValues = function() {
        return {
            pension_age: module.controls.pension_age.value(),
            payers_rate: module.controls.payers_rate.value(),
            esv_rate: module.controls.esv_rate.value(),
            pension_avg: module.controls.pension_avg.value(),
            salary_avg: module.controls.salary_avg.value()
        }
    };

    function init_slider(container, min, max, step, value) {
        var control = $(container);

        control.ionRangeSlider({
            min: min,
            max: max,
            from: value,
            step: step,
            type: "single",
            // grid: true
            onChange: function(val) {return _onChange(val)},

            from_shadow: true
        });

        control.value = function(_) {
            if (!arguments.length) return +control.val();

            control.data('ionRangeSlider').update('from', _);
            return control;
        };

        var _interval = [min, max];
        onIntervalChanged();

        control.allowed_interval = function(min_i, max_i) {
            if (min_i == _interval[0] && max_i == _interval[1]) return control;
            
            if (!min_i) min_i = min;
            if (!max_i) max_i = max;
            
            _interval = [Math.max(min_i, min), Math.min(max_i, max)];
            onIntervalChanged();
            return control;
        };

        function onIntervalChanged() {
            control.data("ionRangeSlider").update({from_min: _interval[0], from_max: _interval[1]});
            _onChange();
        }

        return control;
    }

    function Control(_container, _min, _max, _step, _value) {
        this._container = _container;
        this._value = _value;
        this._min = _min;
        this._max = _max;
        this._step = _step;
        this._onChange = function(val) {that._onChange(val)};
        // this._onNewYear = function() {return this};

        this.onChange = function(_) {
            if (!arguments.length) return this._onChange;

            this._onChange = _;
            return this;
        };

        this.value = function(_) {
            if (!arguments.length) return this._value;

            if (_ === this._value) return this;

            _ = Math.max(this._min, _);
            _ = Math.min(this._max, _);
            this._value = _;

            this._onChange(this._value);
            return this;
        };
    }

    return module;
})();

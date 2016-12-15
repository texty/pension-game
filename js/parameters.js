var parameters = (function() {
    var module = {}
        ;
    
    var _onChange = function() {console.log("stub")};

    module.onChange = function(_) {
        if (!arguments.length) return _onChange;

        _onChange = _;
        return module;
    };

    function Parameter(_name, _value, _min, _max) {
        this._value = _value;
        this._name = _name;
        this._min = _min;
        this._max = _max;

        this.value = function(_) {
            if (!arguments.length) return this._value;

            if (_ === this._value) return this;

            _ = Math.max(this._min, _);
            _ = Math.min(this._max, _);
            this._value = _;

            _onChange(this._value);
            return this;
        };
    }

    module.pension_age = new Parameter('age', 60, 55, 65);
    module.payers_rate = new Parameter('payers_rate', .4, .35, .45);
    module.esv_rate = new Parameter('esv', .175, .1, .5);
    module.pension_avg = new Parameter('pension', 1700,  1700, 5000);
    
    return module;

})();

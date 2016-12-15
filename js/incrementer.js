(function () {
    $(function () {
        $('.minus,.plus').click(function (e) {
            var inc_dec, qty;
            inc_dec = $(this).hasClass('minus') ? -1 : 1;
            qty = $(this).find('input');
            return qty.val(parseInt(qty.val()) + inc_dec);
        });
    });
})();

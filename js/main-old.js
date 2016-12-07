/**
 * Created by oksymets on 25.11.16.
 */

// початковий код слайдера звідси: http://jqueryui.com/slider/#custom-handle

/*
 ПЕРЕЛІК ЗМІННИХ:

 ageVal - пенсійний вік
 employmentVal - зайнятість (ВИДАЛИЛИ)
 payersVal - частка платників
 esvVal - ставка внеску
 pensionVal - пенсія
 salaryVal - зарплата (ВИДАЛИЛИ)

 workForceCalcVal - працездатних
 employedCalcVal - зайнятих (ВИДАЛИЛИ)
 payCalcVal - платників
 pensionersCalcVal - пенсіонерів

 load1 - працездатні до пенсіонерів
 load2 - платники до пенсіонерів
 */



$(function () {

    // Вік
    var ageHandle = $("#age-handle");
    window.ageSlider = $("#age").slider({
        orientation: "vertical",
        create: function () {
            ageHandle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            ageHandle.text(ui.value);
        },
        change: calculate,
        min: 55,
        max: 65,
        step: 1,
        value: 60
    });


    // Частка платників
    var payersHandle = $("#payers-handle");
    window.payersSlider = $("#payers").slider({
        orientation: "vertical",
        create: function () {
            payersHandle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            payersHandle.text(ui.value);
        },
        change: calculate,
        min: 0.5,
        max: 0.9,
        step: 0.05,
        value: 0.65
    });


    // Ставка ЄСВ
    var esvHandle = $("#esv-handle");
    window.esvSlider = $("#esv").slider({
        orientation: "vertical",
        create: function () {
            esvHandle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            esvHandle.text(ui.value);
        },
        change: calculate,
        min: 0.1,
        max: 0.5,
        step: 0.005,
        value: 0.175
    });


    // Середня пенсія
    var pensionHandle = $("#pension-handle");
    window.pensionSlider = $("#pension").slider({
        orientation: "vertical",
        create: function () {
            pensionHandle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            pensionHandle.text(ui.value);
        },
        change: calculate,
        min: 1000,
        max: 10000,
        step: 100,
        value: 1700
    });


    calculate();

    function calculate() {

        var obj = {
//          "age": ["працездатні", "пенсіонерів"],
            50: [21592, 16393],
            51: [22179, 15806],
            52: [22790, 15195],
            53: [23441, 14545],
            54: [24105, 13880],
            55: [24791, 13194],
            56: [25498, 12487],
            57: [26170, 11815],
            58: [26833, 11153],
            59: [27464, 10521],
            60: [28089, 9896],
            61: [28669, 9317],
            62: [29259, 8726],
            63: [29794, 8192],
            64: [30347, 7639],
            65: [30890, 7095],
            66: [31422, 6564],
            67: [31964, 6022],
            68: [32409, 5576],
            69: [32799, 5186],
            70: [33169, 4816]
        };

        var ageVal = ageSlider.slider('value');
        var payersVal = payersSlider.slider('value');
        var pensionVal = pensionSlider.slider('value');
        var esvVal = esvSlider.slider('value');

        var workForceCalcVal = obj[ageVal][0] / 1000; // ЧИСЛО працездатних
        $("#result1")[0].innerHTML = "Працездатні: " + workForceCalcVal + " млн осіб";


        var payCalcVal = Math.round(payersVal * 1000) / 1000; // ЧИСЛО платників
        $("#result3")[0].innerHTML = "Платять: " + Math.round(payCalcVal * 1000) / 1000 + " млн осіб";


        var pensionersCalcVal = obj[ageVal][1] / 1000; // ЧИСЛО пенсіонерів
        $("#result4")[0].innerHTML = "Пенсіонерів: " + pensionersCalcVal + " млн осіб";

        // // Рахуємо кількість працездатних на 1 пенсіонера (працездатні / пенсіонери)
        // var load1 = workForceCalcVal / pensionersCalcVal; // НАВАНТАЖЕННЯ1: працездатні до пенсіонерів
        // $("#result5")[0].innerHTML = "Працездатні до пенсіонерів: " + Math.round(load1 * 100) / 100;
        //
        // var load2 = payCalcVal / pensionersCalcVal; // НАВАНТАЖЕННЯ2: платники до пенсіонерів
        // $("#result6")[0].innerHTML = "Платники до пенсіонерів: " + Math.round(load2 * 100) / 100;


        // Надходження (платників * ставка внеску * зарплата * 12) = (payCalcVal * esvVal * (pensionVal * 3) * 12)
        var inVal = Math.round(payCalcVal * esvVal * (pensionVal * 3) * 12) / 1000; // надходження
        $("#result7")[0].innerHTML = "Надходження: " + inVal + " млрд грн";

        // Видатки (пенсіонерів * пенсія * 12) = (pensionersCalcVal * pensionVal * 12)
        var outVal = Math.round(pensionersCalcVal * pensionVal * 12) / 1000; // видатки
        $("#result8")[0].innerHTML = "Видатки: " + outVal + " млрд грн";

        // Баланс (Надходження - видатки) = (inVal - outVal)
        var balance = Math.round((inVal - outVal) * 1000) / 1000;
        $("#result9")[0].innerHTML = "Баланс Пенс. фонду: " + balance + " млрд грн";



    }

});
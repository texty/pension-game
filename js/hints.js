var hints = {
    pension_age: "Зараз чоловіки йдуть на пенсію у 60 років. Для жінок пенсійний вік зростає щороку на 6 місяців і у 2021-му буде таким же, як у чоловіків. Пенсійний вік не можна так взяти і підняти. Проти виступають популісти з опозиції і більшість населення. На нашій моделі ви можете підняти пенсійний вік на 2,5 роки протягом п’яти років. У більшості країн Європейського Союзу пенсійний вік становить 65 років. Тривалість життя в Україні і ЄС тих, хто доживає до 60, відрізняється не критично.",
    esv_rate: 'Кожен роботодавець платить «зверху» 22% від суми вашої заплати у соціальні фонди. Це так званий Єдиний соціальний внесок (ЄСВ). По факту 18,15% із цієї доплати йде у Пенсійний фонд, решта — в інші соціальні фонди. Наймані працівники не здогадуються про цей платіж, але для роботодавця це теж витрати на вашу працю. На нашій моделі ви не можете підняти податки більш ніж на 10% протягом 5 років, в іншому випадку вас чекає Податковий майдан. У моделі збільшення податків на 1% призводить до збільшення тіньової економіки і зменшення частки платників на 1,4% Це закономірність для США, але досліджень для України немає, тому ми взяли саме цей показник. У нас на 1% податку вихід у тінь може бути ще більшим, бо держава набагато слабша, ніж у США',
    dreg: "У моделі ми використали Індекс ефективності регуляторної політики, де 1 — найгірший показник, а 5 — найкращий. За п’ять років ви можете збільшити індекс максимум на 2 пункти. Це мають бути неймовірно карколомні реформи. Наприклад, Грузія, прогрес якої в плані дерегуляції був один із найшвидших у світі, піднялася приблизно на 2,5—3 пункти за 8 років.",
    salary_avg: "У теорії зростання зарплати має дорівнювати зростанню економіки. Минулого року економіка України виросла на 1,6% ВВП, десь так повинні зростати і зарплати. Та можуть бути несподіванки: наприклад, інвестиційний бум, або ж уряд вирішить позичити $10 млрд і спрямувати їх на зарплати бюджетникам. У моделі ви можете збільшити зарплати українців на 12% в рік. Щоб цього досягти, ви маєте бути Бальцеровичем і у вас буде багато ворогів серед депутатів, олігархів та чиновників. 12% в рік — це д-у-у-у-у-же оптимістичний прогноз.",
    payers_rate: ""
};

d3.selectAll(".step-hint")
    .attr("title", function(){
        return hints[d3.select(this).attr("data-varname")];
    });

$('.step-hint').tooltip(null);
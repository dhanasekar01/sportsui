'use strict';

app.recharge = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('recharge');

(function (parent) {
    var
        rechargeModel = kendo.observable({
            id:"sport-qr",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            scan: function(){
                app.stopQRwithHtml(rechargeModel.id, rechargeModel.htmlCnt);

                var result= app.scan(rechargeModel.id);
                
                if(result){
                    app.stopQRwithHtml(rechargeModel.id, rechargeModel.htmlCnt);
                }

            },
            recharge: function(){

                var result= app.scan("sport-qr");

                if(result){
                    app.stopQRwithHtml(rechargeModel.id, rechargeModel.htmlCnt);
                }
            }
        });

    parent.set('rechargeModel', rechargeModel);    

    parent.set('onShow', function (e) {

       
        var $full_page = $('.full-page');

        $full_page.fadeOut('fast', function () {
            $full_page.css('background-image', 'url("' + $full_page.attr('data-image') + '")');
            $full_page.css('min-height', '100vh');
            $full_page.css('background-size', 'contain');
            $full_page.fadeIn('fast');
        });

        setTimeout(function () {
            $('.card').removeClass('card-hidden');
        }, 700)

    });

    parent.set('afterShow', function (e) {

    });
})(app.recharge);

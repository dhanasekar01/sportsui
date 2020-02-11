'use strict';

app.redeem = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('redeem');

(function (parent) {
    var
        redeemModel = kendo.observable({
            id:"sport-qr",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            play: function(){
                app.stopQRwithHtml(redeemModel.id, redeemModel.htmlCnt);

                var result= app.scan(redeemModel.id);
                
                if(result){
                    app.stopQRwithHtml(redeemModel.id, redeemModel.htmlCnt);
                }

            },
            winner: function(){

                var result= app.scan("sport-qr");

                if(result){
                    app.stopQRwithHtml(redeemModel.id, redeemModel.htmlCnt);
                }
            }
        });

    parent.set('redeemModel', redeemModel);    

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
})(app.redeem);

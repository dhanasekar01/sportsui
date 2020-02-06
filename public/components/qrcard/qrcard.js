'use strict';

app.qrcard = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('qrcard');

(function (parent) {
    var
        qrcardModel = kendo.observable({
            id:"sport-qr",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            qrId:"",
            status:false,
            read: function(){
                
            },
            block: function(){

            }
        });

    parent.set('qrcardModel', qrcardModel);    

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
})(app.qrcard);

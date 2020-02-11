'use strict';

app.champion = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('champion');

(function (parent) {
    var
        championModel = kendo.observable({
            id:"sport-qr",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            play: function(){
                app.stopQRwithHtml(championModel.id, championModel.htmlCnt);

                var result= app.scan(championModel.id);
                
                if(result){
                    app.stopQRwithHtml(championModel.id, championModel.htmlCnt);
                }

            },
            winner: function(){

                var result= app.scan("sport-qr");

                if(result){
                    app.stopQRwithHtml(championModel.id, championModel.htmlCnt);
                }
            }
        });

    parent.set('championModel', championModel);    

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
        }, 700);

        var template = kendo.template($("#championTemplate").html());
                
        var tempData = {
            data: [
                {},{},{},{},{},{},{},{},{},{},{},{}
            ]
        }

        var result = template(tempData);
        $("#champions").html(result);

    });

    parent.set('afterShow', function (e) {

    });
})(app.champion);

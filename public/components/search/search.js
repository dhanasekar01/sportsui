'use strict';

app.search = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('search');

(function (parent) {
    var
        searchModel = kendo.observable({
            id:"sport-qr",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            search: function(){
                var phoneNo = $("#parentNumber").val();
                var response = app.getData(app.api.getPoints+phoneNo);

                var template = kendo.template($("#searchTemplate").html());
                
                var tempData = {
                    data: response
                }

                var result = template(tempData);
                $("#searchHtml").html(result);
            }
        });

    parent.set('searchModel', searchModel);    

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
})(app.search);

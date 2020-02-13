'use strict';

app.vendor = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('vendor');

(function (parent) {
    var
        vendorModel = kendo.observable({
            id:"vendor-qr",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            pay: function(){

                app.scan(vendorModel.id, function (content) {
                    var request = {
                        customerId: content,
                        vendorId:localStorage.getItem("username"),
                        yeskPoints:0,
                        amount:0,
                        rewardPoints:0,
                        transType:"M",
                        userType:localStorage.getItem("type")
                    }
                    var response = app.postData(app.api.noteTransaction, request);
                    if(response != null &&  response.isSuccess){
                       app.showNotification("Success");
                    }
                    app.stopQRwithHtml(vendorModel.id,app.htmlCnt);
                });

            }
        });

    parent.set('vendorModel', vendorModel);    

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
})(app.vendor);

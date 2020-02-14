'use strict';

app.sports = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('sports');

(function (parent) {
    var
        sportsModel = kendo.observable({
            id:"sport-qr",
            sport:"",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            play: function(){
                var pts = 40;

                app.scan(sportsModel.id, function (content) {
                    var request = {
                        customerId: content,
                        vendorId:localStorage.getItem("username"),
                        yeskPoints:pts,
                        amount:0,
                        rewardPoints:0,
                        transType:"D",
                        userType:localStorage.getItem("type")
                    }
                    var response = app.postData(app.api.debitPts, request);
                    if(response != null){
                       app.showNotification("Success");
                    }
                    app.stopQRwithHtml(sportsModel.id,app.htmlCnt);
                });

            },
            winner: function(){
                var pts = 40;
                var sportResponse = app.getData(app.api.getGamesWithPts+sportsModel.sport);

                if(sportResponse != null){
                    pts =  sportResponse.response.ptsValue;
                    console.log(pts);
                }
                app.scan(sportsModel.id, function (content) {
                    var request = {
                        customerId: content,
                        vendorId:localStorage.getItem("username"),
                        yeskPoints:0,
                        amount:0,
                        rewardPoints:pts,
                        transType:"C",
                        userType:localStorage.getItem("type")
                    }
                    var response = app.postData(app.api.creditReward, request);
                    if(response != null){
                        app.showNotification("Success");
                     }
                    app.stopQRwithHtml(sportsModel.id,app.htmlCnt);
                });
            }
        });

    parent.set('sportsModel', sportsModel);    

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


        var vendorResponse = app.getData(app.api.findVendor+localStorage.getItem("username"));

        if(vendorResponse != null ){
            sportsModel.set("sport",vendorResponse.sport);
        }

    });

    parent.set('afterShow', function (e) {

    });
})(app.sports);

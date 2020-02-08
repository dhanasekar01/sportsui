'use strict';

app.dash = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('dash');

(function (parent) {
    var
        dashModel = kendo.observable({
            id:"dashboard-qr",
            usertypes: [],
            accessType:"",
            qrid:"",
            vndname:"",
            owner:"",
            vendorType:"",
            address:"",
            city:"",
            zipcode:"",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            register:function(){

            },
            reset:function(){

            },
            getStatus:function(){

            },
            grant: function(){
                

            },
            revoke: function(){
               
            }
        });

    parent.set('dashModel', dashModel);    

    parent.set('onShow', function (e) {
        //$(".adminclass").hide();
       
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

        var data = [
            {"id":100,"text":"ADMIN"},
            {"id":101,"text":"VENDOR"},
            {"id":102,"text":"MEMBER"},
            {"id":103,"text":"RECHARGE"},
            {"id":104,"text":"SPORTS"},
            {"id":105,"text":"STUDENT"},
            {"id":106,"text":"FAMILY"},
            {"id":107,"text":"REGISTRAR"},
            {"id":108,"text":"ORGANIZER"},
            {"id":109,"text":"MEDIA"}
        ];
        dashModel.set("usertypes",data);

        if(localStorage.getItem("accessType") == "100"){
            $(".adminclass").show();
        }
        

    });

    parent.set('afterShow', function (e) {

    });
})(app.dash);

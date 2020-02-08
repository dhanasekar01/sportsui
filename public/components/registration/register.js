'use strict';

app.register = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('register');

(function (parent) {
    var
        registerModel = kendo.observable({
            id:"register-qr",
            qrId:"",
            mobilenumber:"",
            mname:"",
            clubname:"",
            region:"",
            membercount:0,
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            scan: function(){
                app.scan(registerModel.id, function (content) {
                    $(':focus').val(content);
                });

            },
            findUser: function(){
                var IndNum = /^\d{10}$/;
                var model = registerModel;
                if(registerModel.mobilenumber != ""){
                    if(IndNum.test(registerModel.mobilenumber)){
                        var response = app.findbyno(registerModel.mobilenumber)
                        if(response){
                            if(response.response == null){
                                app.showNotification(response.message);
                                return false;
                            }
                            if(response.response.result.length> 0){
                                var r = response.response.result[0];
                                
                                model.set("qrId",r.qrId);
                                model.set("mobilenumber",r.mobileNo);
                                model.set("mname",r.memberName);
                                model.set("clubname",r.clubName);
                                model.set("region",r.region);
                                model.set("membercount",r.family);

                                if(family >0 ){
                                    model.populateFamily(r.mobileNo);
                                }
                            }
                        }
                    }else{
                        app.showNotification("Invalid Mobile Number");
                    }
                }
            },
            validateData: function () {
                var model = registerModel;

                var message ="";

                if(model.qrId == ""){
                    message += "QR is required <br/>";
                }
                var IndNum = /^\d{10}$/;
                if(registerModel.get("mobilenumber") == ""){
                    message += "Mobile Number is required <br/>";
                } else if(!IndNum.test(registerModel.get("mobilenumber"))){
                    message += "Mobile Number is Invalid <br/>";
                }

                if(model.mname == ""){
                    message += "Name is required <br/>";
                }

                if(message != ""){
                    app.showNotification(message);
                    return false;
                }
                
                return true;
            },
            register: function(){

                var model = registerModel;

                if(model.validateData()){
                    var request = {
                        qrId:model.qrId,
                        mobileNo:model.mobilenumber,
                        memberName:model.mname,
                        clubName:model.clubname,
                        region:model.region,
                        family:model.membercount,
                        createdId: localStorage.getItem("username"),
                        type:localStorage.getItem("type")
                    }
                    
                    app.registerMember(request);
                }
                
            }
        });

    parent.set('registerModel', registerModel);    

    parent.set('onShow', function (e) {

       
        var $full_page = $('.full-page');

        $full_page.fadeOut('fast', function () {
            $full_page.css('background-image', 'url("' + $full_page.attr('data-image') + '")');
            $full_page.css('min-height', '100vh');
            $full_page.css('background-size', 'contain');
            $full_page.fadeIn('fast');
        });

        $("#membercount").on("change",function(){
            var count = $("#membercount").val();
            var template = kendo.template($("#familyTemplate").html());

            var tempData = {
                data: count
            }
            var result = template(tempData);
            $("#familydetails").html(result);

            

        });

        setTimeout(function () {
            $('.card').removeClass('card-hidden');
        }, 700)

        //registerModel.scan();

        
        
    });

    parent.set('afterShow', function (e) {

    });
})(app.register);

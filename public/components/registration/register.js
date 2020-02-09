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
            isVisibile:true,
            mobilenumber:"",
            genderValue:"",
            carno:"",
            mname:"",
            clubname:"",
            region:"",
            membercount:0,
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            users: [],
            userchange:function(){
                var searchKey = $("#autocomplete").val()
                var response = app.findUser(searchKey);
                if(response.response == null){
                }
                if(response.response.result.length> 0){
                    registerModel.set("users",response.response.result);
                }

                var autocomplete = $("#autocomplete").data("kendoAutoComplete");
                    var dataSource = new kendo.data.DataSource({
                        data: registerModel.users
                      });
                    autocomplete.setDataSource(dataSource);
                    autocomplete.search(searchKey);
            },
            scan: function(){
                app.scan(registerModel.id, function (content) {
                    $(':focus').val(content);
                });

            },
            select: function(e){
                var model = registerModel;
                var r = e.dataItem;
                $("#autocomplete").val("");
                model.set("qrId",r.qrId);
                model.set("mobilenumber",r.mobileNo);
                model.set("mname",r.memberName);
                model.set("clubname",r.clubName);
                model.set("region",r.region);
                model.set("membercount",r.family);
                model.set("carno",r.carNo);
                model.set("genderValue",r.gender);

            },
            findUser: function(){
                var IndNum = /^\d{10}$/;
                var model = registerModel;
                if(registerModel.mobilenumber != ""){
                    if(IndNum.test(registerModel.mobilenumber)){
                        var response = app.findbyno(registerModel.mobilenumber)
                        if(response.response != null){
                            if(response.response.result!=null && response.response.result.length == 0){
                                var mobileNo = registerModel.mobilenumber;
                               model.registerReset();
                               model.set("mobilenumber",mobileNo);
                            }
                            if(response.response.result!=null && response.response.result.length> 0){
                                var r = response.response.result[0];
                                
                                model.set("qrId",r.qrId);
                                model.set("mobilenumber",r.mobileNo);
                                model.set("mname",r.memberName);
                                model.set("clubname",r.clubName);
                                model.set("region",r.region);
                                model.set("membercount",r.family);
                                model.set("genderValue",r.gender);
                                model.set("carno",r.carNo);

                                if(r.family >0 ){
                                    model.populateFamily(r.mobileNo);
                                }
                            }
                        }
                    }else{
                        app.showNotification("Invalid Mobile Number");
                    }
                }
            },
            populateFamily: function(){

            },
            registerReset:function(){
                var model = registerModel;
                model.set("qrId","");
                model.set("mobilenumber","");
                model.set("mname","");
                model.set("clubname","");
                model.set("region","");
                model.set("membercount",0);
                model.set("genderValue","");
                model.set("carno","");

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

        $("#autocomplete").on("keyup",function(){
            if($(this).val() != "" && $(this).val().length >= 3){
                registerModel.userchange();
            }
        });

       

        $("#membercount").on("change",function(){
            var count = $("#membercount").val();
            count = count != "" ? parseInt(count):  count;
            var template = kendo.template($("#familyTemplate").html());
            $("#registerBtn, #resetbtn").show()
            if(count > 0){
                $("#registerBtn, #resetbtn").hide()
                var tempData = {
                    data: count
                }
                var result = template(tempData);
                $("#familydetails").html(result);

                $("#registerFamily").on("click",function(){
                    registerModel.register();
                    var request = [];
                    for(var i = 0 ; i< count ; i++){
                        var qrId = $("#qrId"+i).val();
                        var age = $("#age"+i).val();
                        var gender = $("input[name=optionsRadios"+i+"]:checked").val();
                        var name = $("#name"+i).val();
                        var pts = 0;
                        age = age != "" ? parseInt(age): 0;
console.log($("input[name=optionsRadios"+i+"]:checked").val());
                        if(age > 0 && age < 19){
                            pts = 500;
                        }

                        var family = {
                            phoneNo:registerModel.mobilenumber,
                            name :name,
                            qrId:qrId,
                            age:age,
                            gender:gender,
                            memberId:registerModel.qrId,
                            status:"A",
                            createdId:localStorage.getItem("username"),
                            pts:pts
                        }

                        request.push(family);


                    }

                    var response = app.registerFamily(request);
                    app.showNotification(response.response.responseMessage);

                });
            }

        });

        setTimeout(function () {
            $('.card').removeClass('card-hidden');
        }, 700)

        //registerModel.scan();

        
        
    });

    parent.set('afterShow', function (e) {

    });
})(app.register);

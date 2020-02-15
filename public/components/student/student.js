'use strict';

app.student = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('student');

(function (parent) {
    var
        studentModel = kendo.observable({
            id:"student-qr",
            qrId:"",
            isVisibile:true,
            mobilenumber:"",
            genderValue:"",
            mname:"",
            teacher:"",
            school:"",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            users: [],
            gotohome:function(){
                location.reload(true);
            },
            scan: function(){
                app.scan(studentModel.id, function (content) {
                    $('#stud-qrId').val(content);
                });

            },
            studentReset:function(){
                var model = studentModel;
                model.set("qrId","");
                model.set("mobilenumber","");
                model.set("mname","");
                model.set("school","");
                model.set("teacher","");
                model.set("genderValue","");

            },
            validateData: function () {
                var model = studentModel;

                var message ="";

                if(model.qrId == "" && $("#qrId").val()){
                    message += "QR is required <br/>";
                }
                var IndNum = /^\d{10}$/;
                if(studentModel.get("mobilenumber") == ""){
                    message += "Mobile Number is required <br/>";
                } else if(!IndNum.test(studentModel.get("mobilenumber"))){
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
            student: function(){

                var model = studentModel;

                if(model.validateData()){
                    var request = {
                        id:{
                            studentName:model.mname,
                            parentNumber:model.mobilenumber,
                        },
                        qrId:model.qrId,
                        schoolName:model.school,
                        teacherName:model.teacher,
                        age:model.age,
                        gender:model.genderValue,
                        createdId: localStorage.getItem("username"),
                        type:localStorage.getItem("type")
                    }
                    
                    var response = app.postData(app.api.registerStudent,request);
                    if(response != null && response.qrId != ""){
                        app.showNotification("Student Registered");
                        studentModel.studentReset();
                    }
                }
                
            }
        });

    parent.set('studentModel', studentModel);   


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

        studentModel.scan();
        
    });

    parent.set('afterShow', function (e) {

    });
})(app.student);

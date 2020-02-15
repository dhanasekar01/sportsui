'use strict';

app.searchStudent = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('searchStudent');

(function (parent) {
    var
        searchStudentModel = kendo.observable({
            id:"sport-qr",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            searchStudent: function(){
                var phoneNo = $("#studentId").val();
                var response = app.getData(app.api.getStudent+phoneNo);

                var template = kendo.template($("#searchStudentTemplate").html());
                
                var tempData = {
                    data: response
                }

                var result = template(tempData);
                $("#searchStudentHtml").html(result);
            }
        });

    parent.set('searchStudentModel', searchStudentModel);    

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

        app.scan("studentscanner", function (content) {
            $("#studentId").val(content);
            setTimeout(function(){
                searchStudentModel.searchStudent();
            },3000 )
        });

    });

    parent.set('afterShow', function (e) {

    });
})(app.searchStudent);

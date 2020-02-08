'use strict';

app.home = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('home');

(function (parent) {
    var
        homeModel = kendo.observable({
            id:"scanner",
            username: "",
            password: "",
            cameras: [],
            scanme: function(){
                app.scan(homeModel.id, function (content) {
                    homeModel.set("username",content);
                    app.stopQRwithHtml(homeModel.id,app.htmlCnt)
                });

            },
            switchCam : function(e){
                var cam = e.data;
                var cams = homeModel.get("cameras");
                var index = cams.indexOf(cam);
                localStorage.setItem("selectedCams",index);
                app.scanner.start(index);
            },
            eng:function(){
                localStorage.setItem("culture","en");
                location.reload(true); 
            },
            tam:function(){
                localStorage.setItem("culture","ta");
                location.reload(true);
            },
            validateData: function () {
                var model = homeModel;

                if (homeModel.username == '' && homeModel.password == '') {
                    app.showNotification(app.gl().error.E07);
                    return false;
                }

                if (homeModel.username == '') {
                    app.showNotification(app.gl().error.E02);
                    return false;
                }

                if (homeModel.password == '') {
                    app.showNotification(app.gl().error.E03);
                    return false;
                }
                return true;
            },
            signin: function () {
                if(homeModel.validateData()){
                    var response = app.login(homeModel.username,homeModel.password);
                    if(response.isSuccess){
                        localStorage.setItem("type",response.userType);
                        localStorage.setItem("validUser",response.validUser);
                        app.redirect(response.userType);
                    }else{
                        localStorage.setItem("validUser",false);
                        app.showNotification(response.message);
                    }
                }
            }
        });

    parent.set('homeModel', homeModel);

    function enterToLogin(){
        var input = document.getElementById("login-password");
        input.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                homeModel.signin();
            }
        });

        
    }

    
    

    parent.set('onShow', function (e) {

        enterToLogin();

        Instascan.Camera.getCameras().then(function (cameras) {
            
            if (cameras.length > 0) {
                $.each(cameras,function(k,v){
                    if(v.name.includes("back")){
                        localStorage.setItem("selectedCams",k);
                    }
                });

                homeModel.set("cameras",cameras);
            } 
            else {
                alert('No cameras found.');
            }

        }).catch(function (e) {
            alert(e);
        });

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
})(app.home);

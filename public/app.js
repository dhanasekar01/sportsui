'use strict';

(function() {
    var app = {
        data: {},
        user:{},
        test:false,
        prod:"back.yeskindia.org",
        localhost:"localhost",
        baseUrl: "",
        api:{
            login:"/login/",
            debitPts:"/pts/debitPts/",
            creditPts:"/pts/creditPts/",
            creditReward:"/pts/creditReward/",
            cancelPts:"/pts/cancelPts/",
            editPts:"/pts/editPts/",
            cancelReward:"/cancelRewards/",
            editReward:"/pts/editRewards",
            issueCard:"/user/issueCard/",
            registerMember:"/user/registerMember",
            transactions:"/user/transactions/",
            gameChanger:"/",
            blockUser:"/user/blockUser/",
            blockCard:"/card/blockCard/",
            leadingVendorByTime:"/",
            leadingVendorByPopular:"/",
            leadingPlayerChamp:"/",
            leadingPlayerAllrounder:"/",
            leadingBuyer:"/",
            leadingSchool:"/",
            leadingStudent:"/",
            leadingGame:"/",
            getGamesWithPts:"/",
            userSearch:"/user/userSearch",
            findVendor:"/user/vendor/",
            registerFamily:"/user/registerFamily",
            getAllCard:"/card/getAllCard",
            getCardStatus:"/card/getCardStatus",
            special:"/pts/special/",
            getFamily:"/user/getFamily/"
        },
        
        data:"data",
        htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
        scanner:null,
        localization: {
            defaultCulture: localStorage.getItem("culture") ? localStorage.getItem("culture"):"ta",
            cultures: [{
                name: "English",
                code: "en"
            },
            {
                name: "Tamil",
                code: "ta"
            }]
        },
        navigation: {
            viewModel: kendo.observable()
        },
        showMore: {
            viewModel: kendo.observable()
        }
    };
    
    var bootstrap = function() {
        localStorage.setItem("culture","en")
        $(function() {
            app.baseUrl = "https://"+app.prod+":8100/yeskindia/api";
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'slide',
                skin: 'nova',
                initial: 'components/home/view.html'
            });

            kendo.bind($('.navigation-link-text'), app.navigation.viewModel);
        });
    };

    $(document).ready(function() {

        var navigationShowMoreView = $('#navigation-show-more-view').find('ul'),
            allItems = $('#navigation-container-more').find('a'),
            navigationShowMoreContent = '';

        allItems.each(function(index) {
            navigationShowMoreContent += '<li>' + allItems[index].outerHTML + '</li>';
        });

        navigationShowMoreView.html(navigationShowMoreContent);
        kendo.bind($('#navigation-show-more-view'), app.showMore.viewModel);

        app.notification = $("#notify");
    });

    app.listViewClick = function _listViewClick(item) {
        var tabstrip = app.mobileApp.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip');
        tabstrip.clear();
    };

    app.stopQR = function(){
        if(app.scanner)
            app.scanner.stop();
    }

    app.stopQRwithHtml = function (id, htmlCnt){
        if(app.scanner)
            app.scanner.stop();
        
        $("#"+id).html(htmlCnt);
    }

    app.showNotification = function (message, time) {
        var autoHideAfter = time ? time : 2000;
        swal({
            title: "Message!",
            text: message,
            timer: autoHideAfter,
            showConfirmButton: false
        }).catch(swal.noop);
    };

    
    app.postData = function (url, data) {
        var result = {};
        $.ajax({
            async: false,
            type: "POST",
            url: this.baseUrl+url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            complete: function (jqxhr, txt_status) {
                if(result != null && result != "" && result != undefined){
                    try{
                        result = jqxhr.responseText;
                        console.log(result);
                        result = typeof result != "object" ? JSON.parse(result) : result;
                    }catch(e){
                        result = { "message":app.gl().error.E01 }
                    }
                }
            }
        });
        return result;
    }

    app.getData = function (url) {
        var result = {};
        $.ajax({
            async: false,
            type: "GET",
            url: this.baseUrl+url,
            complete: function (jqxhr, txt_status) {
                if(jqxhr != null && jqxhr != "" && jqxhr != undefined){
                    try{
                        result = jqxhr.responseText;
                        console.log(result);
                        result = typeof result != "object" ? JSON.parse(result) : result;
                    }catch(e){
                        console.log(e);
                        result = { "message":app.gl().error.E01 }
                    }
                }
            }
        });
        return result;
    }

    app.registerMember = function(req){
        return app.postData(this.api.registerMember, req);
    }

    app.registerFamily = function(req){
        return app.postData(this.api.registerFamily, req);
    }

    app.login = function(username, pwd){
        localStorage.setItem("username",username);
        var response = {} ;
        if(app.test){
            response = {
                id:"123",
                name:"Guest",
                type:101
            }
        }else{
            response = app.getData(this.api.login+username+"/"+pwd);
        }
        return response;
    }

    app.findUser = function(name){
        var url = this.api.userSearch;
        var data ={
            "qrId":"",
            "name" : name
        }
    return this.postData(url,data);
}

    app.findbyno = function(mobileno){
            var url = this.api.userSearch;
            var data ={
                "qrId":"",
                "mobileNbr" : mobileno
            }
        return this.postData(url,data);
    }

    app.redirect = function(type){

        switch(type){
            case 101: app.mobileApp.navigate("components/vendor/vendor.html"); break;
            case 100: app.mobileApp.navigate("components/dashboard/dashboard.html"); break;
            case 103: app.mobileApp.navigate("components/recharge/recharge.html");break;
            case 104: app.mobileApp.navigate("components/sports/sports.html");break;
            case 107: app.mobileApp.navigate("components/registration/register.html");break;
            case 110: app.mobileApp.navigate("components/special/special.html");break;
            case "": break;

        }
    }

    app.debitPts = function(id, pts){
        var request = {
            qrId: id,
            points: pts,
            type: "D",
            requestUser: localStorage.getItem("username")
        }
        var response = {};
        if(this.test){
            response = {
                message:app.gl().vndr.debit.success,
                totalSale: 30.00
            
            }
        } else{
            response = this.postData(url,request);
        }
    }
  
    app.scan = function(id, callback){
        var scanResult = "";
        localStorage.setItem(id,$("#"+id).html());
        $("#"+id).html("<video id='preview' style='width:100%;height:320px;'></video>");
        
        app.scanner = new Instascan.Scanner({ video: document.getElementById("preview") });
        app.scanner.addListener('scan', callback);

        Instascan.Camera.getCameras().then(function (cameras) {
            var selectedCamera = 0;

            if(localStorage.getItem("selectedCams") != undefined && localStorage.getItem("selectedCams") != null){
                selectedCamera = parseInt(localStorage.getItem("selectedCams"));
            }
            
            if (cameras.length > 0) {
                app.scanner.start(cameras[selectedCamera]);
            } 
            else {
                alert('No cameras found.');
            }
        }).catch(function (e) {
            alert(e);
        });

        return scanResult;
    }

    app.logout = function () {
        if (localStorage) {
            localStorage.clear();
            app.mobileApp.navigate("components/home/view.html?value=logout");
        }
    };

    app.gl = function(){
        return app.localization.get('strings')[localStorage.getItem("culture")];
    }

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }



    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function(url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function(itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function(event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function(formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function(key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };




    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function(widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function() {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
}());

/// start app modules
(function localization(app) {
    var localization = app.localization = kendo.observable({
            cultures: app.localization.cultures,
            defaultCulture: app.localization.defaultCulture,
            currentCulture: '',
            strings: {},
            viewsNames: [],
            registerView: function (viewName) {
                app[viewName].set('strings', getStrings() || {});

                this.viewsNames.push(viewName);
            }
        }),
        i, 
        culture, 
        cultures = localization.cultures,
        getStrings = function() {
            var code = localization.get('currentCulture'),
                strings = localization.get('strings')[code];

            return strings;
        },
        updateStrings = function() {
            var i, viewName, viewsNames,
                strings = getStrings();

            if (strings) {
                viewsNames = localization.get('viewsNames');

                for (i = 0; i < viewsNames.length; i++) {
                    viewName = viewsNames[i];

                    app[viewName].set('strings', strings);
                }

                app.navigation.viewModel.set('strings', strings);
                app.showMore.viewModel.set('strings', strings);
            }
        },
        loadCulture = function(code) {
            $.getJSON('cultures/' + code + '/app.json',
                function onLoadCultureStrings(data) {
                    localization.strings.set(code, data);
                });
        };

    localization.bind('change', function onLanguageChange(e) {
        if (e.field === 'currentCulture') {
            var code = e.sender.get('currentCulture');

            updateStrings();
        } else if (e.field.indexOf('strings') === 0) {
            updateStrings();
        } else if (e.field === 'cultures' && e.action === 'add') {
            loadCulture(e.items[0].code);
        }
    });

    for (i = 0; i < cultures.length; i++) {
        loadCulture(cultures[i].code);
    }

    localization.set('currentCulture', localization.defaultCulture);
})(window.app);

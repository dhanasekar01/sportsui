'use strict';

(function() {
    var app = {
        data: {},
        user:{},
        data:"data",
        scanner:null,
        localization: {
            defaultCulture: localStorage.getItem("culture") ? localStorage.getItem("culture"):"en",
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
        $(function() {
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
            url: url,
            data: data,
            dataType: "application/json",
            complete: function (jqxhr, txt_status) {
                result = jqxhr;
            }
        });
        return result;
    }

    app.getData = function (url) {
        var result = {};
        $.ajax({
            async: false,
            type: "GET",
            url: url,
            complete: function (jqxhr, txt_status) {
                result = jqxhr;
            }
        });
        return result;
    }
  
    app.scan = function(id){
        var scanResult = "";
        localStorage.setItem(id,$("#"+id).html());
        $("#"+id).html("<video id='preview' style='width:100%'></video>");
        
        app.scanner = new Instascan.Scanner({ video: document.getElementById("preview") });
        app.scanner.addListener('scan', function (content) {
            scanResult = content;
            alert(content);
        });

        Instascan.Camera.getCameras().then(function (cameras) {
          console.log(cameras);
          if (cameras.length > 0) {
            app.scanner.start(cameras[0]);
          } else {
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

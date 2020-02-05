'use strict';

app.register = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('register');

(function (parent) {
    var
        registerModel = kendo.observable({
            id:"sport-qr",
            htmlCnt :'<br /><img src="/img/scanner.png" style="width:50%">',
            play: function(){
                app.stopQRwithHtml(registerModel.id, registerModel.htmlCnt);

                var result= app.scan(registerModel.id);
                
                if(result){
                    app.stopQRwithHtml(registerModel.id, registerModel.htmlCnt);
                }

            },
            winner: function(){

                var result= app.scan("sport-qr");

                if(result){
                    app.stopQRwithHtml(registerModel.id, registerModel.htmlCnt);
                }
            },
            initMaterialWizard: function(){
                // Code for the Validator
                var $validator = $('.wizard-card form').validate({
                      rules: {
                        firstname: {
                          required: true,
                          minlength: 3
                        },
                        lastname: {
                          required: true,
                          minlength: 3
                        },
                        email: {
                          required: true,
                          minlength: 3,
                        }
                    },
        
                    errorPlacement: function(error, element) {
                        $(element).parent('div').addClass('has-error');
                     }
                });
        
                $('.wizard-card').bootstrapWizard({
                    'tabClass': 'nav nav-pills',
                    'nextSelector': '.btn-next',
                    'previousSelector': '.btn-previous',

                    onNext: function (tab, navigation, index) {
                        var $valid = $('.wizard-card form').valid();
                        if (!$valid) {
                            $validator.focusInvalid();
                            return false;
                        }
                    },

                    onInit: function (tab, navigation, index) {
                        //check number of tabs and fill the entire row
                        var $total = navigation.find('li').length;
                        var $wizard = navigation.closest('.wizard-card');

                        var $first_li = navigation.find('li:first-child a').html();
                        var $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
                        $('.wizard-card .wizard-navigation').append($moving_div);

                        refreshAnimation($wizard, index);

                        $('.moving-tab').css('transition', 'transform 0s');
                    },

                    onTabClick: function (tab, navigation, index) {
                        var $valid = $('.wizard-card form').valid();

                        if (!$valid) {
                            return false;
                        } else {
                            return true;
                        }
                    },

                    onTabShow: function (tab, navigation, index) {
                        var $total = navigation.find('li').length;
                        var $current = index + 1;

                        var $wizard = navigation.closest('.wizard-card');

                        // If it's the last tab then hide the last button and show the finish instead
                        if ($current >= $total) {
                            $($wizard).find('.btn-next').hide();
                            $($wizard).find('.btn-finish').show();
                        } else {
                            $($wizard).find('.btn-next').show();
                            $($wizard).find('.btn-finish').hide();
                        }

                        var button_text = navigation.find('li:nth-child(' + $current + ') a').html();

                        setTimeout(function () {
                            $('.moving-tab').text(button_text);
                        }, 150);

                        var checkbox = $('.footer-checkbox');

                        if (!index == 0) {
                            $(checkbox).css({
                                'opacity': '0',
                                'visibility': 'hidden',
                                'position': 'absolute'
                            });
                        } else {
                            $(checkbox).css({
                                'opacity': '1',
                                'visibility': 'visible'
                            });
                        }

                        refreshAnimation($wizard, index);
                    }
                });


                // Prepare the preview for profile picture
                $("#wizard-picture").change(function () {
                    readURL(this);
                });

                $('[data-toggle="wizard-radio"]').click(function () {
                    var wizard = $(this).closest('.wizard-card');
                    wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
                    $(this).addClass('active');
                    $(wizard).find('[type="radio"]').removeAttr('checked');
                    $(this).find('[type="radio"]').attr('checked', 'true');
                    var category = $(this).find('[type="radio"]').val();
                    spendModel.set("category",category);

                    var selectedCategory = spendModel.category;

                    spendModel.set("item",selectedCategory); 
                    var model = "sport",color="default";
                    $.each(spendModel.data,function(k,v){
                        if(v.barcode == selectedCategory){
                            model = v.model;
                            color = v.color;

                        }
                    });

                    spendModel.set("color",color);
                    spendModel.set("model",model);

                });

                $('[data-toggle="wizard-checkbox"]').click(function () {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        $(this).find('[type="checkbox"]').removeAttr('checked');
                    } else {
                        $(this).addClass('active');
                        $(this).find('[type="checkbox"]').attr('checked', 'true');
                    }
                });

                $('[name="transactiontype"]').click(function () {
                    var transactiontype = $(this).val();
                    spendModel.set("transactiontype",transactiontype);
                });

                $('.set-full-height').css('height', 'auto');

                //Function to show image before upload

                function readURL(input) {
                    if (input.files && input.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
                        }
                        reader.readAsDataURL(input.files[0]);
                    }
                }

                $(window).resize(function () {
                    $('.wizard-card').each(function () {
                        var $wizard = $(this);

                        var index = $wizard.bootstrapWizard('currentIndex');
                        refreshAnimation($wizard, index);

                        $('.moving-tab').css({
                            'transition': 'transform 0s'
                        });
                    });
                });

                function refreshAnimation($wizard, index) {
                    var $total = $wizard.find('.nav li').length;
                    var $li_width = 100 / $total;

                    var total_steps = $wizard.find('.nav li').length;
                    var move_distance = $wizard.width() / total_steps;
                    var index_temp = index;
                    var vertical_level = 0;

                    var mobile_device = $(document).width() < 600 && $total > 3;

                    if (mobile_device) {
                        move_distance = $wizard.width() / 2;
                        index_temp = index % 2;
                        $li_width = 50;
                    }

                    $wizard.find('.nav li').css('width', $li_width + '%');

                    var step_width = move_distance;
                    move_distance = move_distance * index_temp;

                    var $current = index + 1;

                    if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
                        move_distance -= 8;
                    } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
                        move_distance += 8;
                    }

                    if (mobile_device) {
                        vertical_level = parseInt(index / 2);
                        vertical_level = vertical_level * 38;
                    }

                    $wizard.find('.moving-tab').css('width', step_width);
                    $('.moving-tab').css({
                        'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
                        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

                    });
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

        registerModel.initMaterialWizard();

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

        
    });

    parent.set('afterShow', function (e) {

    });
})(app.register);

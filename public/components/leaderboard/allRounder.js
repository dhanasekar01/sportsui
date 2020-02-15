'use strict';

app.leader = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('leader');

(function (parent) {
    var
        leaderModel = kendo.observable({
            apiList : [],
            len:0,
            refreshBoard:function(){
                var template = kendo.template($("#leaderboardhtmlTemplate").html());
                var championTemplate = kendo.template($("#championTemplate").html());

                var data = app.getData(leaderModel.apiList[leaderModel.len]);

                if(data.length == 0)
                {
                    $("#leaders").show();
                    $("#champions").empty();
                    $("#leadercategory").html("LEADERBOARD IS REFRESHING. LOADING....");

                    leaderModel.set("len",leaderModel.len+1);
                    var tempData = {
                        data: data
                    }
            
                    var result = template(tempData);
                    $("#ageGroup").html(result);
                    return;
                }

                switch(leaderModel.len){
                    case 0 : $("#leadercategory").html("Junior Male - Overall Champion Rank");break;
                    case 1 : $("#leadercategory").html("Senior Male - Overall Champion Rank");break;
                    case 2 : $("#leadercategory").html("Super Senior Male - Overall Champion Rank");break;
                    case 3 : $("#leadercategory").html("Junior Feale - Overall Champion Rank");break;
                    case 4 : $("#leadercategory").html("Senior Female - Overall Champion Rank");break;
                    case 5 : $("#leadercategory").html("Super Senior Female - Overall Champion Rank");break;
                    case 6 : $("#championCategory").html("Junior Male - Game Champion");break;
                    case 7 : $("#championCategory").html("Senior Male - Game Champion");break;
                    case 8 : $("#championCategory").html("Super Senior Male -  Game Champion");break;
                    case 9 : $("#championCategory").html("Junior Female - Game Champion");break;
                    case 10: $("#championCategory").html("Senior Female - Game Champion");break;
                    case 11: $("#championCategory").html("Super Senior Female - Game Champion");break;
                    case 12: $("#leadercategory").html("Junior Male - Overall Champion Rank");break;
                    case 13: $("#leadercategory").html("Senior Male - Overall Champion Rank");break;
                    case 14: $("#leadercategory").html("Super Senior Male - Overall Champion Rank");break;
                    case 15: $("#leadercategory").html("Junior Feale - Overall Champion Rank");break;
                    case 16: $("#leadercategory").html("Senior Female - Overall Champion Rank");break;
                    case 17: $("#leadercategory").html("Super Senior Female - Overall Champion Rank");break;
                    case 18: $("#championCategory").html("Junior Male - Game Champion");break;
                    case 19: $("#championCategory").html("Senior Male - Game Champion");break;
                    case 20: $("#championCategory").html("Super Senior Male -  Game Champion");break;
                    case 21: $("#championCategory").html("Junior Female - Game Champion");break;
                    case 22: $("#championCategory").html("Senior Female - Game Champion");break;
                    case 23: $("#championCategory").html("Super Senior Female - Game Champion");break;
                }

                var tempData = {
                    data: data
                }
                if((leaderModel.len > 5 && leaderModel.len <12) || (leaderModel.len > 17 && leaderModel.len <24)){
                    $("#leaders").hide();
                    $("#champions").empty();
                    var result = championTemplate(tempData);
                    $("#champions").html(result);
                }else{
                    $("#champions").empty();
                    $("#leaders").show();
                    var result = template(tempData);
                    $("#ageGroup").html(result);
                }
            }
           
        });

    parent.set('leaderModel', leaderModel);    

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

        leaderModel.apiList = [
            //championsMale - to fetch top 10 over all performers school level 0 to 5
            app.api.getChampionMale+app.api.ageGroupJunior,
            app.api.getChampionMale+app.api.ageGroupMiddle,
            app.api.getChampionMale+app.api.ageGroupSenior,
            app.api.getChampionFemale+app.api.ageGroupJunior,
            app.api.getChampionFemale+app.api.ageGroupMiddle,
            app.api.getChampionFemale+app.api.ageGroupSenior,
            // memberChampions - winner by game - member level 6 to 11
            app.api.getMemberChampionsMale+app.api.ageGroupJunior,
            app.api.getMemberChampionsMale+app.api.ageGroupMiddle,
            app.api.getMemberChampionsMale+app.api.ageGroupSenior,
            app.api.getMemberChampionsFemale+app.api.ageGroupJunior,
            app.api.getMemberChampionsFemale+app.api.ageGroupMiddle,
            app.api.getMemberChampionsFemale+app.api.ageGroupSenior,
            //memberChampionsAll - to fetch top 10 overall performers member level 12 - 17
            app.api.getChampAllMale+app.api.ageGroupJunior,
            app.api.getChampAllMale+app.api.ageGroupMiddle,
            app.api.getChampAllMale+app.api.ageGroupSenior,
            app.api.getChampAllFemale+app.api.ageGroupJunior,
            app.api.getChampAllFemale+app.api.ageGroupMiddle,
            app.api.getChampAllFemale+app.api.ageGroupSenior,
            //schoolChampions - Winner by games - school level 18 - 23
            app.api.getSchoolChampMale+app.api.ageGroupJunior,
            app.api.getSchoolChampMale+app.api.ageGroupMiddle,
            app.api.getSchoolChampMale+app.api.ageGroupSenior,
            app.api.getSchoolChampFemale+app.api.ageGroupJunior,
            app.api.getSchoolChampFemale+app.api.ageGroupMiddle,
            app.api.getSchoolChampFemale+app.api.ageGroupSenior

        ];
        
        leaderModel.refreshBoard(leaderModel.len);
        
        setInterval(function(){
            if(leaderModel.len > 23)
                leaderModel.set("len",0) ;
            
            leaderModel.refreshBoard(leaderModel.len);
            leaderModel.set("len",leaderModel.len+1);
            
        }, 3000)
    });

    parent.set('afterShow', function (e) {

    });
})(app.leader);

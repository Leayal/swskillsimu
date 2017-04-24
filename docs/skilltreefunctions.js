var c_maxlevel = 55;

class SkillTreeCore {
    constructor() {
        this._totalsp = 0;
        this._currentlevel = 0;
        this._investedsp = 0;
        this._spleft = 0;
    };
    get TotalSP() { return this._totalsp; }
    get CurrentLevel() { return this._currentlevel; }
    get InvestedSP() { return this._investedsp; }
    get SPLeft() { return this._spleft; }
    GetCurrentLevel() { return this._currentlevel; }

    SetLevelFromElement() {
        this.SetLevel(parseInt($("#selectLevelBox").val()));
    }

    SetLevel(_level) {
        this._currentlevel = Math.min(_level, window.c_maxlevel);
        this._totalsp = this.inner_gettotalsp(this._currentlevel);
        this.UpdateAllSPs();
    }

    UpdateSP() {
        this._spleft = this._totalsp - this._investedsp;
        if (this._spleft < 5)
            $("#e_remainingSP").addClass("alertlow");
        else
            $("#e_remainingSP").removeClass("alertlow");
        $("#e_investedSP").text("Invested SP: " + this._investedsp);
        $("#e_remainingSP").text("Remaining SP: " + this._spleft);
    }

    UpdateAllSPs() {
        $("#e_totalSP").text("Total SP: " + this._totalsp);
        $("#e_investedSP").text("Invested SP: " + this._investedsp);
        if (this.CheckAllSkills()) {
            this._spleft = this._totalsp - this._investedsp;
            $("#e_remainingSP").text("Remaining SP: " + this._spleft);
            this.CheckAllSkills();
            if (this._spleft < 5)
                $("#e_remainingSP").addClass("alertlow");
            else
                $("#e_remainingSP").removeClass("alertlow");
        }
    }

    UnlearnAllSkills() {
        for (var skillid in this.SkillList)
            this.SkillList[skillid].UnlearnSkill();
    }

    CheckAllSkills() {
        if (this._totalsp < this._investedsp) {
            for (var skillid in this.SkillList)
                this.SkillList[skillid].UnlearnSkill();
            return false;
        }
        if (!this.SkillList) return false;
        var sk, skinfo;
        for (var skillid in this.SkillList) {
            sk = this.SkillList[skillid];
            if (sk.GetAvailableLevel() > this._currentlevel) {
                sk.UnlearnSkill();
            } else {
                if ((get = sk.CurrentSkillLevel) < (get = sk.GetDefaultLevel))
                    sk.UnlearnSkill();
                skinfo = sk.CurrentLevelInfo();
                if ((get = skinfo.RequiredLevel) > this._currentlevel)
                    sk.UnlearnSkill();
            }
        }
        return true
    }

    inner_gettotalsp(_level) {
        var tsp = 0;
        for (var i = 1; i <= _level; i++) {
            tsp += this.inner_gettotalspex(i);
        }
        return tsp;
    }

    inner_gettotalspex(_level) {
        switch (_level) {
            case 0:
                return 0;
            case 1:
                return 0;
            case 2:
                return 0;
            case 3:
                return 0;
            case 4:
                return 1;
            case 5:
                return 3;
            case 6:
                return 1;
            case 7:
                return 1;
            case 8:
                return 1;
            case 9:
                return 1;
            case 10:
                return 5;
            case 15:
                return 5;
            case 20:
                return 10;
            case 25:
                return 5;
            case 30:
                return 5;
            case 35:
                return 5;
            case 40:
                return 10;
            case 45:
                return 5;
            case 50:
                return 5;
            case 55:
                return 5;
            default:
                return 2;
        }
    }

    GenerateLink(isShortLink) {
        var arrayString = [];
        if (this._currentlevel !== window.c_maxlevel)
            arrayString.push("lv=" + this._currentlevel);
        for (var skillid in this.SkillList) {
            var levelasd = (get = this.SkillList[skillid].CurrentSkillLevel);
            if (levelasd != (get = this.SkillList[skillid].GetDefaultLevel)) {
                if (isShortLink && this.SkillList[skillid].ShortID) {
                    arrayString.push(this.SkillList[skillid].ShortID + "=" + levelasd);
                } else {
                    arrayString.push(skillid + "=" + levelasd);
                }
            }
        }
        var link = location.protocol + '//' + location.host + location.pathname;
        var param = "";
        if (arrayString.length > 0)
            param = arrayString.join("&");
        if (param)
            link = link + "?" + param;
        return link;
    }
}

var SkillCore = new SkillTreeCore();
var mouseX;
var mouseY;

$(document).mousemove(function(e) {
    window.mouseX = e.pageX;
    window.mouseY = e.pageY;
});

function SetToolTip(obj) {
    obj.mouseover(function() {
        var key = $(this).attr("insight");
        if (key) {
            var skillinfoooo = window.SkillCore.GetSkill(key);
            var ddddddd = skillinfoooo.CurrentLevelInfo();
            if (ddddddd) {
                var desc = get = ddddddd.SkillDescription;
                var eff = get = ddddddd.SkillEffect;
                var elem = $('div#tooltip');
                if (!desc && !eff) {
                    elem.stop(false, true).fadeOut('fast');
                    return;
                }
                if (desc)
                    $('div#tooltip pre:first').text((get = skillinfoooo.Name) + "\n[Description]\n" + desc);
                else
                    $('div#tooltip pre:first').empty();
                if (eff)
                    $('div#tooltip pre:last').text("[Effect]\n" + eff);
                else
                    $('div#tooltip pre:last').empty();
                elem.stop(false, true).fadeIn('fast');
                obj.mousemove(function() {
                    elem.css({ 'top': Math.min(window.mouseY + 10, $(document).height() - elem.outerHeight(true)), 'left': window.mouseX + 5 });
                });
            }
        }
    }).mouseout(function() {
        $('div#tooltip').stop(false, true).fadeOut('fast');
    });
    return obj;
}

function SetToolTipUp(obj) {
    obj.mouseover(function() {
        var key = $(this).attr("insight");
        if (key) {
            var skillinfoooo = window.SkillCore.GetSkill(key);
            var ddddddd = skillinfoooo.CurrentLevelInfo();
            var fffffff = skillinfoooo.NextLevelInfo();
            var elem = $('div#tooltip');
            if (ddddddd || fffffff) {
                var desc = get = ddddddd.SkillEffect;
                var eff = "";
                if (fffffff)
                    eff = get = fffffff.SkillEffect;
                if (!desc && !eff) {
                    elem.stop(false, true).fadeOut('fast');
                    return;
                }
                if (desc)
                    $('div#tooltip pre:first').text("[Current]\n" + desc);
                else
                    $('div#tooltip pre:first').empty();
                if (eff)
                    $('div#tooltip pre:last').text("[After]\n" + eff);
                else
                    $('div#tooltip pre:last').empty();
                elem.stop(false, true).fadeIn('fast');
                obj.mousemove(function() {
                    //elem.outerHeight(true)
                    elem.css({ 'top': Math.min(window.mouseY + 10, $(window).height() - elem.outerHeight(true)), 'left': window.mouseX + 5 });
                });
            }
        }
    }).mouseout(function() {
        $('div#tooltip').stop(false, true).fadeOut('fast');
    });
    return obj;
}

function SetToolTipDown(obj) {
    obj.mouseover(function() {
        var key = $(this).attr("insight");
        if (key) {
            var skillinfoooo = window.SkillCore.GetSkill(key);
            var ddddddd = skillinfoooo.CurrentLevelInfo();
            var fffffff = skillinfoooo.PreviousLevelInfo();
            var elem = $('div#tooltip');
            if (ddddddd || fffffff) {
                var desc = get = ddddddd.SkillEffect;
                var eff = "";
                if (fffffff) eff = get = fffffff.SkillEffect;
                if (!desc && !eff) {
                    elem.stop(false, true).fadeOut('fast');
                    return;
                }
                if (desc)
                    $('div#tooltip pre:first').text("[Current]\n" + desc);
                else
                    $('div#tooltip pre:first').empty();
                if (eff)
                    $('div#tooltip pre:last').text("[After]\n" + eff);
                else
                    $('div#tooltip pre:last').text("[After]\nNone.");
                elem.stop(false, true).fadeIn('fast');
                obj.mousemove(function() {
                    elem.css({ 'top': Math.min(window.mouseY + 10, $(document).height() - elem.outerHeight(true)), 'left': window.mouseX + 5 });
                });
            }
        }
    }).mouseout(function() {
        $('div#tooltip').stop(false, true).fadeOut('fast');
    });
    return obj;
}

function ShowDangerDialog(msg, yesCallback, noCallback) {
    BootstrapDialog.show({
        label: BootstrapDialog.TYPE_WARNING,
        title: 'Warning',
        message: msg,
        cssClass: 'bootstrap3-dialog',
        buttons: [{
            label: 'Yes',
            cssClass: 'btn btn-warning',
            action: function(dialogItself) {
                dialogItself.close();
                if (yesCallback)
                    yesCallback();
            }
        }, {
            label: 'No',
            cssClass: 'btn btn-primary',
            action: function(dialogItself) {
                dialogItself.close();
                if (noCallback)
                    noCallback();
            }
        }]
    });
}

function ShowConfirmDialog(msg, yesCallback, noCallback) {
    BootstrapDialog.show({
        title: 'Double confirm',
        message: msg,
        cssClass: 'bootstrap3-dialog',
        buttons: [{
            label: 'Yes',
            cssClass: 'btn btn-primary',
            action: function(dialogItself) {
                dialogItself.close();
                if (yesCallback)
                    yesCallback();
            }
        }, {
            label: 'No',
            cssClass: 'btn btn-default',
            action: function(dialogItself) {
                dialogItself.close();
                if (noCallback)
                    noCallback();
            }
        }]
    });
}

$(function() {
    SetLoading($("body"));
    var selecting = $("<select id=\"selectLevelBox\">").addClass("bootstrap3-dialog").change(function() {
        window.SkillCore.SetLevel($(this).val());
    });
    for (var i = 1; i <= window.c_maxlevel; i++)
        selecting.append($("<option>").val(i).text(i));
    $("#levelBoxtd").append(selecting);
    //selecting.insertAfter($("#levelBoxtd"));
    var clevel = GetUrlParam("lv", 55);
    if (clevel == 55) clevel = GetUrlParam("level", 55);
    if (isNaN(clevel))
        clevel = 55;
    selecting.val(clevel);
    selecting.trigger("change");
    //window.SkillCore.SetLevelFromElement();
    $("#charList li a[href]")
    $('a[href^="../' + GetCurrentFolderUrl() + '"]').parent().closest('li').remove();
    $("#copyURL").click(function() {
        var link = window.SkillCore.GenerateLink(false);
        if (link) {
            copyLink(link);
            shownotify("The link to this skill tree has been copied to clipboard.", 'success');
        }
    });
    $("#copyShortURL").click(function() {
        var link = window.SkillCore.GenerateLink(true);
        if (link) {
            copyLink(link);
            shownotify("The link to this skill tree has been copied to clipboard.<br/>This short link may break if the skill tree has breaking changes in the future.", 'success');
        }
    });
    $("#resetAllSkill").click(function() {
        ShowDangerDialog('Are you sure you want to unlearn all skills?', function() {
            window.SkillCore.UnlearnAllSkills();
        });
    });

    window.SkillCore.ReadTree();
});
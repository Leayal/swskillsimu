var c_maxlevel = 55;

function readurlparam(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
};

function GetUrlParam(name, defaultvalue) {
    var re = readurlparam(name);
    if (re)
        return re;
    else
        return defaultvalue;
};

function SetLoading(target) {
    var found = target.find($("div[metroloading]"));
    if (found && found.length > 0) return;
    //target.append($("<div metroloading class=\"midcenter\"><div class=\"windows8-loading\"><b></b><b></b><b></b><b></b><b></b></div></div>"));
    var aaasdwaf = $("<div>").addClass("stretch").addClass("windows8-loading");
    aaasdwaf.append($("<b>"));
    aaasdwaf.append($("<b>"));
    aaasdwaf.append($("<b>"));
    aaasdwaf.append($("<b>"));
    aaasdwaf.append($("<b>"));
    var ddd = $("<div metroloading>").addClass("midcenter").append(aaasdwaf);
    ($("<div metroloading>")
        .addClass("fixedDiv")
        .addClass("stretch")
        .addClass("disabled")
        .addClass("opacity50")).prependTo(target);
    target.append(ddd);
};

function RemoveLoading(target) {
    target.children("div[metroloading]").remove();
};

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
        $("#e_investedSP").text(this._investedsp);
        $("#e_remainingSP").text(this._spleft);
    }

    UpdateAllSPs() {
        $("#e_totalSP").text(this._totalsp);
        $("#e_investedSP").text(this._investedsp);
        this._spleft = this._totalsp - this._investedsp;
        $("#e_remainingSP").text(this._spleft);
        if (this._totalsp < this._investedsp)
            this.UnlearnAllSkills();
        else
            this.CheckAllSkills();
        if (this._spleft < 5)
            $("#e_remainingSP").addClass("alertlow");
        else
            $("#e_remainingSP").removeClass("alertlow");
    }

    CheckAllSkills() {
        var asdasdfafa;
        for (var skillid in this.SkillList) {
            asdasdfafa = this.SkillList[skillid].CurrentLevelInfo();
            if ((get = asdasdfafa.RequiredLevel) > this._currentlevel)
                this.SkillList[skillid].UnlearnSkill();
        }
    }

    UnlearnAllSkills() {
        for (var skillid in this.SkillList)
            this.SkillList[skillid].UnlearnSkill();
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

    GenerateLink() {
        var arrayString = [];
        for (var skillid in this.SkillList) {
            var levelasd = (get = this.SkillList[skillid].CurrentSkillLevel);
            if (levelasd != (get = this.SkillList[skillid].GetDefaultLevel))
                arrayString.push(skillid + "=" + levelasd);
        }
        var param = location.protocol + '//' + location.host + location.pathname + "?lv=" + this._currentlevel;
        if (arrayString.length > 0)
            param = param + "&" + arrayString.join("&");
        return param;
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
                    $('div#tooltip pre:first').text((get = skillinfoooo.Name) + "\n[Description]\n" + htmlEncode(desc));
                else
                    $('div#tooltip pre:first').empty();
                if (eff)
                    $('div#tooltip pre:last').text("[Effect]\n" + htmlEncode(eff));
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
                var eff = get = fffffff.SkillEffect;
                if (!desc && !eff) {
                    elem.stop(false, true).fadeOut('fast');
                    return;
                }
                if (desc)
                    $('div#tooltip pre:first').text("[Current]\n" + htmlEncode(desc));
                else
                    $('div#tooltip pre:first').empty();
                if (eff)
                    $('div#tooltip pre:last').text("[After]\n" + htmlEncode(eff));
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
                var eff = get = fffffff.SkillEffect;
                if (!desc && !eff) {
                    elem.stop(false, true).fadeOut('fast');
                    return;
                }
                if (desc)
                    $('div#tooltip pre:first').text("[Current]\n" + htmlEncode(desc));
                else
                    $('div#tooltip pre:first').empty();
                if (eff)
                    $('div#tooltip pre:last').text("[After]\n" + htmlEncode(eff));
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

$(function() {
    SetLoading($("body"));
    var selecting = $("<select id=\"selectLevelBox\">").change(function() {
        window.SkillCore.SetLevelFromElement();
    });
    for (var i = 1; i <= window.c_maxlevel; i++)
        selecting.append($("<option>").val(i).text(i));
    selecting.insertAfter($("span#levelBoxtd"));
    var clevel = GetUrlParam("lv", 55);
    if (clevel == 55) clevel = GetUrlParam("level", 55);
    if (!isNaN(clevel))
        clevel = 55;
    $("select#selectLevelBox").val(clevel);
    window.SkillCore.SetLevelFromElement();
    //$(document).tooltip();
    $("a#copyURL").click(function() {
        var link = window.SkillCore.GenerateLink();
        var asdDiv = $("<div>").addClass("hiddendiv");
        var asdButton = $("<button>").addClass("btncopymagicclass").attr("data-clipboard-text", link);
        asdDiv.append(asdButton);
        $("body").append(asdDiv);
        new Clipboard(".btncopymagicclass");
        asdButton.trigger("click");
        asdDiv.remove();
    });

    window.SkillCore.ReadTree();
});
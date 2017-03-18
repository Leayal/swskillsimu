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
        $("#e_investedSP").text(this._investedsp);
        $("#e_remainingSP").text(this._spleft);
    }

    UpdateAllSPs() {
        this._spleft = this._totalsp - this._investedsp;
        if (this._spleft < 0)
            this.UnlearnAllSkills();
        $("#e_totalSP").text(this._totalsp);
        $("#e_investedSP").text(this._investedsp);
        $("#e_remainingSP").text(this._spleft);
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
}

var SkillCore = new SkillTreeCore();

$(function() {
    SetLoading($("body"));
    var selecting = $("<select id=\"selectLevelBox\">").change(function() {
        window.SkillCore.SetLevelFromElement();
    });
    for (var i = 1; i <= window.c_maxlevel; i++)
        selecting.append($("<option>").val(i).text(i));
    selecting.insertAfter($("span#levelBoxtd"));
    window.SkillCore.ReadTree();
    var clevel = GetUrlParam("lv", 55);
    if (clevel == 55) clevel = GetUrlParam("level", 55);
    $("select#selectLevelBox").val(clevel);
    window.SkillCore.SetLevelFromElement();
});
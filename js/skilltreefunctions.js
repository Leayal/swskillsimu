var c_maxlevel = 60;

class SkillTreeCore {
    constructor() {
        this._totalsp = 0;
        this._currentlevel = 0;
        this._investedsp = 0;
        this._spleft = 0;
        this.slotassign = new SlotGrid();
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
        $("#e_investedSP").text("Invested SP: " + this._investedsp + "/" + this._totalsp);
        $("#e_remainingSP").text("Remaining SP: " + this._spleft + "/" + this._totalsp);
        $("#spusageinfo").html(this.GenerateUsageInfo());
    }

    UpdateAllSPs() {
        $("#e_investedSP").text("Invested SP: " + this._investedsp + "/" + this._totalsp);
        if (this.CheckAllSkills()) {
            this._spleft = this._totalsp - this._investedsp;
            $("#e_remainingSP").text("Remaining SP: " + this._spleft + "/" + this._totalsp);
            this.CheckAllSkills();
            if (this._spleft < 5)
                $("#e_remainingSP").addClass("alertlow");
            else
                $("#e_remainingSP").removeClass("alertlow");
        }

        // Foward event here
        $("#spusageinfo").html(this.GenerateUsageInfo());
    }

    UnlearnAllSkills() {
        for (var skillid in this.SkillList)
            this.SkillList[skillid].UnlearnSkill();
    }

    CheckAllSkills() {
        if (this._totalsp < this._investedsp) {
            if (this.SkillList) {
                for (var skillid in this.SkillList)
                    this.SkillList[skillid].UnlearnSkill();
            }
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
            case 60:
                return 5;
            default:
                return 2;
        }
    }

    GenerateLink(showSkillAssignment) {
        var arrayString = [];
        if (this._currentlevel !== window.c_maxlevel)
            arrayString.push("lv=" + this._currentlevel);
        for (var skillid in this.SkillList) {
            var levelasd = (get = this.SkillList[skillid].CurrentSkillLevel);
            if (levelasd != (get = this.SkillList[skillid].GetDefaultLevel)) {
                if (this.SkillList[skillid].ShortID) {
                    arrayString.push(this.SkillList[skillid].ShortID + "=" + levelasd);
                } else {
                    arrayString.push(skillid + "=" + levelasd);
                }
            }
        }
        var link = location.protocol + '//' + location.host + location.pathname;
        var param = null;

        var assignstring = this.slotassign.GenerateAssignment();
        if (assignstring)
            arrayString.push("s=" + assignstring);
        if (this.slotassign.effect2nd !== "2_1")
            arrayString.push("b1=" + this.slotassign.effect2nd);
        if (this.slotassign.effect3rd !== "3_1")
            arrayString.push("b2=" + this.slotassign.effect3rd);

        if (showSkillAssignment === true)
            arrayString.push("sa=1");

        if (arrayString.length > 1)
            param = arrayString.join("&");
        else if (arrayString.length === 1)
            param = arrayString[0];

        if (param)
            link = link + "?" + param;
        return link;
    }

    GenerateUsageInfo() {
        var arrayString = {};

        var parent_target, usedsp_target;
        for (var skillid in this.SkillList)
            if (this.SkillList.hasOwnProperty(skillid)) {
                var levelasd = (get = this.SkillList[skillid].CurrentSkillLevel);
                if (levelasd != (get = this.SkillList[skillid].GetDefaultLevel)) {
                    usedsp_target = this.SkillList[skillid].GetSPUsed();
                    parent_target = (get = this.SkillList[skillid].Parent);
                    if (usedsp_target != 0)
                        if (!parent_target) {
                            arrayString[skillid] = (get = this.SkillList[skillid].Name) + ": " + usedsp_target + "SP";
                        } else {
                            arrayString[get = parent_target.ID] += " + " + usedsp_target + "SP";
                        }
                }
            }

        var result = "",
            firstappend = true;
        if (Object.keys(arrayString).length > 0)
            for (var skillid in arrayString)
                if (arrayString.hasOwnProperty(skillid)) {
                    if (firstappend) {
                        result += arrayString[skillid];
                        firstappend = false;
                    } else
                        result += ("<br>" + arrayString[skillid]);
                }

        return result;
    }

    ResetSlotAssignment() {
        this.slotassign.ResetToEmpty();
    }

    SetSkillAssignment(columnIndex, rowIndex, skillinfo) {
        this.slotassign.SetGridValue(columnIndex, rowIndex, skillinfo);
    }

    GetSkillAssignmentRender() {
        return this.slotassign.GetRender();
    }

    ReadAssignment() {
        this.slotassign.ReadAssignment();
    }
}

var SkillCore = new SkillTreeCore();
var mouseX;
var mouseY;

$(document).mousemove(function (e) {
    window.mouseX = e.pageX;
    window.mouseY = e.pageY;
});

function SetToolTip(obj) {
    obj.mouseover(function () {
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
                var cssstyle = {};
                var currentInt = window.mouseY + 10,
                    positionY;
                if ((currentInt + elem.outerHeight(true)) > $(document).height()) {
                    cssstyle['bottom'] = 0;
                    cssstyle['top'] = "";
                } else {
                    cssstyle['bottom'] = "";
                    cssstyle['top'] = currentInt;
                }
                currentInt = window.mouseX + 5;
                if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
                    cssstyle['left'] = "";
                    cssstyle['right'] = 0;
                } else {
                    cssstyle['right'] = "";
                    cssstyle['left'] = currentInt;
                }

                elem.css(cssstyle);
                elem.stop(false, true).fadeIn('fast');
            }
        }
    }).mousemove(function () {
        var elem = $('div#tooltip');
        var cssstyle = {};
        var currentInt = window.mouseY + 10,
            positionY;
        if ((currentInt + elem.outerHeight(true)) > $(document).height()) {
            cssstyle['bottom'] = 0;
            cssstyle['top'] = "";
        } else {
            cssstyle['bottom'] = "";
            cssstyle['top'] = currentInt;
        }
        currentInt = window.mouseX + 5;
        if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
            cssstyle['left'] = "";
            cssstyle['right'] = 0;
        } else {
            cssstyle['right'] = "";
            cssstyle['left'] = currentInt;
        }

        elem.css(cssstyle);
    }).mouseout(function () {
        $('div#tooltip').stop(false, true).fadeOut('fast');
    });
    return obj;
}

function SetToolTipUp(obj) {
    obj.mouseover(function () {
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
                var cssstyle = {};
                var currentInt = window.mouseY + 10,
                    positionY;
                if ((currentInt + elem.outerHeight(true)) > $(document).height()) {
                    cssstyle['bottom'] = 0;
                    cssstyle['top'] = "";
                } else {
                    cssstyle['bottom'] = "";
                    cssstyle['top'] = currentInt;
                }
                currentInt = window.mouseX + 5;
                if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
                    cssstyle['left'] = "";
                    cssstyle['right'] = 0;
                } else {
                    cssstyle['right'] = "";
                    cssstyle['left'] = currentInt;
                }

                elem.css(cssstyle);
                elem.stop(false, true).fadeIn('fast');
            }
        }
    }).mousemove(function () {
        var elem = $('div#tooltip');
        var cssstyle = {};
        var currentInt = window.mouseY + 10,
            positionY;
        if ((currentInt + elem.outerHeight(true)) > $(document).height()) {
            cssstyle['bottom'] = 0;
            cssstyle['top'] = "";
        } else {
            cssstyle['bottom'] = "";
            cssstyle['top'] = currentInt;
        }
        currentInt = window.mouseX + 5;
        if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
            cssstyle['left'] = "";
            cssstyle['right'] = 0;
        } else {
            cssstyle['right'] = "";
            cssstyle['left'] = currentInt;
        }

        elem.css(cssstyle);
    }).mouseout(function () {
        $('div#tooltip').stop(false, true).fadeOut('fast');
    });
    return obj;
}

function SetToolTipDown(obj) {
    obj.mouseover(function () {
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
                var cssstyle = {};
                var currentInt = window.mouseY + 10,
                    positionY;
                if ((currentInt + elem.outerHeight(true)) > $(document).height()) {
                    cssstyle['bottom'] = 0;
                    cssstyle['top'] = "";
                } else {
                    cssstyle['bottom'] = "";
                    cssstyle['top'] = currentInt;
                }
                currentInt = window.mouseX + 5;
                if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
                    cssstyle['left'] = "";
                    cssstyle['right'] = 0;
                } else {
                    cssstyle['right'] = "";
                    cssstyle['left'] = currentInt;
                }

                elem.css(cssstyle);
                elem.stop(false, true).fadeIn('fast');
            }
        }
    }).mousemove(function () {
        var elem = $('div#tooltip');
        var cssstyle = {};
        var currentInt = window.mouseY + 10,
            positionY;
        if ((currentInt + elem.outerHeight(true)) > $(document).height()) {
            cssstyle['bottom'] = 0;
            cssstyle['top'] = "";
        } else {
            cssstyle['bottom'] = "";
            cssstyle['top'] = currentInt;
        }
        currentInt = window.mouseX + 5;
        if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
            cssstyle['left'] = "";
            cssstyle['right'] = 0;
        } else {
            cssstyle['right'] = "";
            cssstyle['left'] = currentInt;
        }

        elem.css(cssstyle);
    }).mouseout(function () {
        $('div#tooltip').stop(false, true).fadeOut('fast');
    });
    return obj;
}

function ShowDangerDialog(msg, yesCallback, noCallback) {
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_WARNING,
        title: 'Warning',
        message: msg,
        cssClass: 'bootstrap3-dialog',
        buttons: [{
            label: 'Yes',
            cssClass: 'btn btn-warning',
            action: function (dialogItself) {
                dialogItself.close();
                if (typeof yesCallback === "function")
                    yesCallback();
            }
        }, {
            label: 'No',
            cssClass: 'btn btn-primary',
            action: function (dialogItself) {
                dialogItself.close();
                if (typeof noCallback === "function")
                    noCallback();
            }
        }]
    });
}

function ShowMessageDialog(jquery_format_msg, okayCallback) {
    BootstrapDialog.show({
        title: 'Notice',
        message: jquery_format_msg,
        cssClass: 'bootstrap3-dialog',
        buttons: [{
            label: 'OK',
            cssClass: 'btn btn-primary',
            action: function (dialogItself) {
                dialogItself.close();
                if (typeof okayCallback === "function")
                    okayCallback();
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
            action: function (dialogItself) {
                dialogItself.close();
                if (typeof yesCallback === "function")
                    yesCallback();
            }
        }, {
            label: 'No',
            cssClass: 'btn btn-default',
            action: function (dialogItself) {
                dialogItself.close();
                if (typeof noCallback === "function")
                    noCallback();
            }
        }]
    });
}

function ShowSkillAssignment(noCallback) {
    if (!window.SkillCore) return;
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_SUCCESS,
        title: 'Skill slot assignment',
        draggable: true,
        message: window.SkillCore.GetSkillAssignmentRender(),
        buttons: [{
            label: 'Reset',
            cssClass: 'btn btn-warning',
            action: function (dialogItself) {
                ShowDangerDialog('Are you sure you want to reset all the slot assignments?', function () {
                    window.SkillCore.ResetSlotAssignment();
                });
            }
        }, {
            label: 'Close',
            cssClass: 'btn btn-default',
            action: function (dialogItself) {
                dialogItself.close();
                if (typeof noCallback === "function")
                    noCallback();
            }
        }]
    });
}

$(function () {
    /*
    $('div#sakura').sakura('start', {
        fallSpeed: 1.2,
        maxSize: 14, // Maximum petal size
        minSize: 4, // Minimum petal size
        newOn: 1500, // Interval after which a new petal is added
    });
    */
    SetLoading($("body"));
    var selecting = $("<select id=\"selectLevelBox\">").change(function () {
        window.SkillCore.SetLevel($(this).val());
    });
    for (var i = 1; i <= window.c_maxlevel; i++)
        selecting.append($("<option>").val(i).text(i));
    $("#levelBoxtd").append(selecting);
    //selecting.insertAfter($("#levelBoxtd"));
    var clevel = GetUrlParam("lv", 60);
    if (clevel == 60) clevel = GetUrlParam("level", 60);
    if (isNaN(clevel))
        clevel = 60;
    selecting.val(clevel);
    selecting.trigger("change");
    //window.SkillCore.SetLevelFromElement();
    $("#charList li a[href]")
    $('a[href^="../' + GetCurrentFolderUrl() + '"]').parent().closest('li').remove();
    $("#copyURL").click(function () {
        var link = window.SkillCore.GenerateLink();
        if (link) {
            copyLink(link);
        }
    });
    $("#copyURLshowassign").click(function () {
        e.preventDefault();
        var link = window.SkillCore.GenerateLink(true);
        if (link) {
            copyLink(link);
        }
    });
    $("#resetAllSkill").click(function () {
        ShowDangerDialog('Are you sure you want to unlearn all skills?', function () {
            window.SkillCore.UnlearnAllSkills();
        });
    });
    $("#slotassignment").click(function () {
        ShowSkillAssignment();
    });

    var showassignment = GetUrlParam("sa", null);
    window.SkillCore.ReadTree(function () {
        RemoveLoading($("body"));
        window.SkillCore.ReadAssignment();
        if (showassignment === "1")
            $("#slotassignment").click();
    });
});
var c_maxlevel = 60;

function SkillTreeCore() {
    this._totalsp = 0;
    this._currentlevel = 0;
    this._investedsp = 0;
    this._spleft = 0;
    this.slotassign = new SlotGrid();
}

SkillTreeCore.prototype.GetTotalSP = function () {
    return this._totalsp;
}

SkillTreeCore.prototype.GetCurrentLevel = function () {
    return this._currentlevel;
}

SkillTreeCore.prototype.GetInvestedSP = function () {
    return this._investedsp;
}

SkillTreeCore.prototype.GetSPLeft = function () {
    return this._spleft;
}

SkillTreeCore.prototype.SetLevel = function (_level) {
    this._currentlevel = Math.min(_level, window.c_maxlevel);
    this._totalsp = this.inner_gettotalsp(this._currentlevel);
    this.UpdateAllSPs();
}

SkillTreeCore.prototype.SetLevelFromElement = function () {
    this.SetLevel(parseInt($("#selectLevelBox").val()));
}

SkillTreeCore.prototype.UpdateSP = function () {
    this._spleft = this._totalsp - this._investedsp;
    if (this._spleft < 5)
        $("#e_remainingSP").addClass("alertlow");
    else
        $("#e_remainingSP").removeClass("alertlow");
    $("#e_investedSP").text("Invested SP: " + this._investedsp + "/" + this._totalsp);
    $("#e_remainingSP").text("Remaining SP: " + this._spleft + "/" + this._totalsp);
    $("#spusageinfo").html(this.GenerateUsageInfo());
}

SkillTreeCore.prototype.UpdateAllSPs = function () {
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

SkillTreeCore.prototype.UnlearnAllSkills = function () {
    for (var skillid in this.SkillList)
        this.SkillList[skillid].UnlearnSkill();
}

SkillTreeCore.prototype.CheckAllSkills = function () {
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
            if (sk.GetCurrentSkillLevel() < sk.GetDefaultLevel())
                sk.UnlearnSkill();
            skinfo = sk.CurrentLevelInfo();
            if (skinfo.RequiredLevel > this._currentlevel)
                sk.UnlearnSkill();
        }
    }
    return true
}

SkillTreeCore.prototype.inner_gettotalsp = function (_level) {
    var tsp = 0;
    for (var i = 1; i <= _level; i++) {
        tsp += this.inner_gettotalspex(i);
    }
    return tsp;
}

SkillTreeCore.prototype.inner_gettotalspex = function (_level) {
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

SkillTreeCore.prototype.GenerateLink = function (showSkillAssignment) {
    var arrayString = [];
    if (this._currentlevel !== window.c_maxlevel)
        arrayString.push("lv=" + this._currentlevel);
    for (var skillid in this.SkillList) {
        var levelasd = (this.SkillList[skillid].GetCurrentSkillLevel());
        if (levelasd != (this.SkillList[skillid].GetDefaultLevel())) {
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

SkillTreeCore.prototype.GenerateUsageInfo = function () {
    var arrayString = {};

    var parent_target, usedsp_target;
    for (var skillid in this.SkillList)
        if (this.SkillList.hasOwnProperty(skillid)) {
            var levelasd = this.SkillList[skillid].GetCurrentSkillLevel();
            if (levelasd != this.SkillList[skillid].GetDefaultLevel()) {
                usedsp_target = this.SkillList[skillid].GetSPUsed();
                parent_target = this.SkillList[skillid].GetParent();
                if (usedsp_target != 0)
                    if (!parent_target) {
                        arrayString[skillid] = this.SkillList[skillid].GetName() + ": " + usedsp_target + "SP";
                    } else {
                        arrayString[parent_target.GetID()] += " + " + usedsp_target + "SP";
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

SkillTreeCore.prototype.ResetSlotAssignment = function () {
    this.slotassign.ResetToEmpty();
}

SkillTreeCore.prototype.SetSkillAssignment = function (columnIndex, rowIndex, skillinfo) {
    this.slotassign.SetGridValue(columnIndex, rowIndex, skillinfo);
}

SkillTreeCore.prototype.GetSkillAssignmentRender = function () {
    return this.slotassign.GetRender();
}

SkillTreeCore.prototype.ReadAssignment = function () {
    this.slotassign.ReadAssignment();
}

var SkillCore = new SkillTreeCore();
var mouseX;
var mouseY;

$(document).mousemove(function (e) {
    window.mouseX = e.pageX;
    window.mouseY = e.pageY;
});

function SetToolTip(obj) {
    var navbarBottomHeight;
    obj.mouseover(function () {
        var key = $(this).attr("insight");
        if (key) {
            var skillinfoooo = window.SkillCore.GetSkill(key);
            var ddddddd = skillinfoooo.GetCurrentLevelInfo();
            if (ddddddd) {
                var desc = ddddddd.SkillDescription;
                var eff = ddddddd.SkillEffect;
                var elem = $("div#tooltip");
                // StringBuilder in the nutshell
                var stringresult = [];
                if (desc) {
                    stringresult.push("[Description]\n");
                    stringresult.push(desc);
                }
                if (eff) {
                    if (stringresult.length !== 0) {
                        stringresult.push("\n\n");
                    }
                    stringresult.push("[Effect]\n");
                    stringresult.push(eff);
                }
                $("div#tooltip .tooltipheader").text(skillinfoooo.GetName());
                if (stringresult !== 0)
                    $("div#tooltip pre").text(stringresult.join("")).show();
                else
                    $("div#tooltip pre").empty().hide();
                var cssstyle = {};
                navbarBottomHeight = $(".navbar.fixed-bottom").outerHeight(true);
                var currentInt = window.mouseY + 10,
                    positionY;
                if ((currentInt + elem.outerHeight(true)) > ($(document).height() - navbarBottomHeight)) {
                    cssstyle["bottom"] = navbarBottomHeight;
                    cssstyle["top"] = "";
                } else {
                    cssstyle["bottom"] = "";
                    cssstyle["top"] = currentInt;
                }
                currentInt = window.mouseX + 5;
                if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
                    cssstyle["left"] = "";
                    cssstyle["right"] = 0;
                } else {
                    cssstyle["right"] = "";
                    cssstyle["left"] = currentInt;
                }

                elem.css(cssstyle);
                elem.stop(false, true).fadeIn("fast");
            }
        }
    }).mousemove(function () {
        var elem = $("div#tooltip");
        var cssstyle = {};
        var currentInt = window.mouseY + 10,
            positionY;
        if ((currentInt + elem.outerHeight(true)) > ($(document).height() - navbarBottomHeight)) {
            cssstyle["bottom"] = navbarBottomHeight;
            cssstyle["top"] = "";
        } else {
            cssstyle["bottom"] = "";
            cssstyle["top"] = currentInt;
        }
        currentInt = window.mouseX + 5;
        if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
            cssstyle["left"] = "";
            cssstyle["right"] = 0;
        } else {
            cssstyle["right"] = "";
            cssstyle["left"] = currentInt;
        }

        elem.css(cssstyle);
    }).mouseout(function () {
        $("div#tooltip").stop(false, true).fadeOut("fast");
    });
    return obj;
}

function SetToolTipUp(obj) {
    var navbarBottomHeight;
    obj.mouseover(function () {
        var key = $(this).attr("insight");
        if (key) {
            var skillinfoooo = window.SkillCore.GetSkill(key);
            var ddddddd = skillinfoooo.GetCurrentLevelInfo();
            var fffffff = skillinfoooo.GetNextLevelInfo();
            var elem = $("div#tooltip");
            if (ddddddd || fffffff) {
                var desc = ddddddd.SkillEffect;
                var eff = "";
                if (fffffff)
                    eff = fffffff.SkillEffect;
                if (!desc && !eff) {
                    elem.stop(false, true).fadeOut("fast");
                    return;
                }
                // In the nutshell
                var stringbuilder = [];
                if (desc) {
                    stringbuilder.push("[Current]\n");
                    stringbuilder.push(desc);
                }
                if (eff) {
                    if (stringbuilder.length !== 0) {
                        stringbuilder.push("\n\n");
                    }
                    stringbuilder.push("[After]\n");
                    stringbuilder.push(eff);
                }
                if (stringbuilder.length !== 0)
                    $("div#tooltip pre").text(stringbuilder.join("")).show();
                else
                    $("div#tooltip pre").empty().hide();
                var cssstyle = {};
                navbarBottomHeight = $(".navbar.fixed-bottom").outerHeight(true);
                var currentInt = window.mouseY + 10,
                    positionY;
                if ((currentInt + elem.outerHeight(true)) > ($(document).height() - navbarBottomHeight)) {
                    cssstyle["bottom"] = navbarBottomHeight;
                    cssstyle["top"] = "";
                } else {
                    cssstyle["bottom"] = "";
                    cssstyle["top"] = currentInt;
                }
                currentInt = window.mouseX + 5;
                if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
                    cssstyle["left"] = "";
                    cssstyle["right"] = 0;
                } else {
                    cssstyle["right"] = "";
                    cssstyle["left"] = currentInt;
                }

                elem.css(cssstyle);
                elem.stop(false, true).fadeIn("fast");
            }
        }
    }).mousemove(function () {
        var elem = $("div#tooltip");
        var cssstyle = {};
        var currentInt = window.mouseY + 10,
            positionY;
        if ((currentInt + elem.outerHeight(true)) > ($(document).height() - navbarBottomHeight)) {
            cssstyle["bottom"] = navbarBottomHeight;
            cssstyle["top"] = "";
        } else {
            cssstyle["bottom"] = "";
            cssstyle["top"] = currentInt;
        }
        currentInt = window.mouseX + 5;
        if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
            cssstyle["left"] = "";
            cssstyle["right"] = 0;
        } else {
            cssstyle["right"] = "";
            cssstyle["left"] = currentInt;
        }

        elem.css(cssstyle);
    }).mouseout(function () {
        $("div#tooltip").stop(false, true).fadeOut("fast");
    });
    return obj;
}

function SetToolTipDown(obj) {
    var navbarBottomHeight;
    obj.mouseover(function () {
        var key = $(this).attr("insight");
        if (key) {
            var skillinfoooo = window.SkillCore.GetSkill(key);
            var ddddddd = skillinfoooo.GetCurrentLevelInfo();
            var fffffff = skillinfoooo.GetPreviousLevelInfo();
            var elem = $("div#tooltip");
            if (ddddddd || fffffff) {
                var desc = ddddddd.SkillEffect;
                var eff = "";
                if (fffffff) eff = fffffff.SkillEffect;
                if (!desc && !eff) {
                    elem.stop(false, true).fadeOut("fast");
                    return;
                }
                var stringbuilder = [];
                if (desc) {
                    stringbuilder.push("[Current]\n");
                    stringbuilder.push(desc);
                }
                if (eff) {
                    if (stringbuilder.length !== 0) {
                        stringbuilder.push("\n\n");
                    }
                    stringbuilder.push("[After]\n");
                    stringbuilder.push(eff);
                }
                if (stringbuilder.length !== 0)
                    $("div#tooltip pre").text(stringbuilder.join("")).show();
                else
                    $("div#tooltip pre").empty().hide();

                var cssstyle = {};
                navbarBottomHeight = $(".navbar.fixed-bottom").outerHeight(true);
                var currentInt = window.mouseY + 10,
                    positionY;
                if ((currentInt + elem.outerHeight(true)) > ($(document).height() - navbarBottomHeight)) {
                    cssstyle["bottom"] = navbarBottomHeight;
                    cssstyle["top"] = "";
                } else {
                    cssstyle["bottom"] = "";
                    cssstyle["top"] = currentInt;
                }
                currentInt = window.mouseX + 5;
                if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
                    cssstyle["left"] = "";
                    cssstyle["right"] = 0;
                } else {
                    cssstyle["right"] = "";
                    cssstyle["left"] = currentInt;
                }

                elem.css(cssstyle);
                elem.stop(false, true).fadeIn("fast");
            }
        }
    }).mousemove(function () {
        var elem = $("div#tooltip");
        var cssstyle = {};
        var currentInt = window.mouseY + 10,
            positionY;
        if ((currentInt + elem.outerHeight(true)) > ($(document).height() - navbarBottomHeight)) {
            cssstyle["bottom"] = navbarBottomHeight;
            cssstyle["top"] = "";
        } else {
            cssstyle["bottom"] = "";
            cssstyle["top"] = currentInt;
        }
        currentInt = window.mouseX + 5;
        if ((currentInt + elem.outerWidth(true)) > $(document).width()) {
            cssstyle["left"] = "";
            cssstyle["right"] = 0;
        } else {
            cssstyle["right"] = "";
            cssstyle["left"] = currentInt;
        }

        elem.css(cssstyle);
    }).mouseout(function () {
        $("div#tooltip").stop(false, true).fadeOut("fast");
    });
    return obj;
}

function ShowDangerDialog(msg, yesCallback, noCallback) {
    var dialog = new Bootstrap4ModalDialog($("#dialogs"), msg, "Warning", Bootstrap4ModalDialog.ButtonsYesNoDanger);
    dialog.RegisterCallback(function (sender, val) {
        if (val) {
            if (typeof yesCallback === "function")
                yesCallback();
        } else {
            if (typeof noCallback === "function")
                noCallback();
        }
    });
    dialog.Show();
}

function ShowMessageDialog(jquery_format_msg, okayCallback) {
    var dialog = new Bootstrap4ModalDialog($("#dialogs"), jquery_format_msg, "Notice");
    dialog.RegisterCallback(function (sender, val) {
        if (val && (typeof okayCallback === "function"))
            okayCallback();
    });
    dialog.Show();
}

function ShowConfirmDialog(msg, yesCallback, noCallback) {
    var dialog = new Bootstrap4ModalDialog($("#dialogs"), msg, "Double confirmation", Bootstrap4ModalDialog.ButtonsYesNo);
    dialog.RegisterCallback(function (sender, val) {
        if (val) {
            if (typeof yesCallback === "function")
                yesCallback();
        } else {
            if (typeof noCallback === "function")
                noCallback();
        }
    });
    dialog.Show();
}

function ShowSkillAssignment(noCallback) {
    if (!window.SkillCore) return;

    var dialog = new Bootstrap4ModalDialog($("#dialogs"), window.SkillCore.GetSkillAssignmentRender(), "Skill slot assignment", [
        {
            label: "Reset",
            cssClass: "btn btn-warning",
            action: function (dialogitself) {
                window.ShowDangerDialog("Are you sure you want to reset all the slot assignments?", function () {
                    window.SkillCore.ResetSlotAssignment();
                });
            }
        },
        {
            label: "Close",
            cssClass: "btn btn-default",
            action: function (dialogitself) {
                dialogitself.Hide();
                if (typeof noCallback === "function")
                    noCallback();
            }
        }
    ]);
    dialog.Show();
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
    $("#dialogs").hide().click(function (e) {
        e.preventDefault();
        window.DialogManager.CloseForegroundDialog();
    });
    window.DialogManager.OnModalChanged(function (val) {
        if (val)
            $("#dialogs").show();
        else
            $("#dialogs").hide();
    });
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
    $('#charList a[href^="../' + GetCurrentFolderUrl() + '"]').remove();
    $("#copyURL").click(function (e) {
        e.preventDefault();
        var link = window.SkillCore.GenerateLink();
        if (link) {
            copyLink(link);
        }
    });
    $("#copyURLshowassign").click(function (e) {
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
    window.SkillCore.ReadTree(function (data) {
        if (data.Cover) {
            if (data.Cover.URL) {
                var pos;
                if (data.Cover.Position) {
                    pos = data.Cover.Position;
                } else {
                    pos = "side-right";
                }
                $("#forbackground").append(
                    $("<img>").addClass(["image-bg-character", pos]).attr("src", data.Cover.URL).imagesLoaded().always(function (instance) {
                        instance.elements.forEach(function (element, index, arr) {
                            $(element).addClass("animated fadeIn").show();
                        });
                    }).hide()
                );
            }
        }
    }, function () {
        RemoveLoading($("body"));
        window.SkillCore.ReadAssignment();
        if (showassignment === "1")
            $("#slotassignment").click();
    });
});
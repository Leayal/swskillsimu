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
    var dialog = new Bootstrap4ModalDialog($("#dialogs"), msg, "Warning", Bootstrap4ModalDialog.Buttons.YesNoDanger, Bootstrap4ModalDialog.Type.Danger);
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

function ShowRetryDialog(jquery_format_msg, title, retryCallback) {
    var dialog = new Bootstrap4ModalDialog($("#dialogs"), jquery_format_msg, title, Bootstrap4ModalDialog.Buttons.Retry, Bootstrap4ModalDialog.Type.Warning);
    dialog.RegisterCallback(function (sender, val) {
        if (val && (typeof retryCallback === "function"))
            retryCallback();
    });
    dialog.Show();
}

function ShowMessageDialog(jquery_format_msg, okayCallback) {
    var dialog = new Bootstrap4ModalDialog($("#dialogs"), jquery_format_msg, "Notice", null, Bootstrap4ModalDialog.Type.Info);
    dialog.RegisterCallback(function (sender, val) {
        if (val && (typeof okayCallback === "function"))
            okayCallback();
    });
    dialog.Show();
}

function ShowConfirmDialog(msg, yesCallback, noCallback) {
    var dialog = new Bootstrap4ModalDialog($("#dialogs"), msg, "Double confirmation", Bootstrap4ModalDialog.Buttons.YesNo, Bootstrap4ModalDialog.Type.Primary);
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
    ], Bootstrap4ModalDialog.Type.Success);
    dialog.Show();
}

function ReRenderTree(characterclassinfo) {
    if (typeof (window.SkillCore.RenderTree) !== "function") return;
    if (!characterclassinfo) throw "characterclassinfo is null";

    window.SkillCore.RenderTree(function () {
        let target = $("img.image-bg-character");
        if (target)
            target.remove();

        if (characterclassinfo.Cover) {
            var pos;
            if (characterclassinfo.Position) {
                pos = characterclassinfo.Position;
            } else {
                pos = "side-right";
            }
            $("#forbackground").append(
                $("<img>").addClass(["image-bg-character", pos]).attr("src", characterclassinfo.Cover).imagesLoaded().always(function (instance) {
                    instance.elements.forEach(function (element, index, arr) {
                        $(element).addClass("animated fadeIn").show();
                    });
                }).hide()
            );
        }
    });
}

function copyLink(_url) {
    if (window.clipboardsupport) {
        var asdDiv = $("<div>").addClass("hiddendiv");
        var asdButton = $("<button>").addClass("btncopymagicclass").attr("data-clipboard-text", encodeURI(_url));
        asdDiv.append(asdButton);
        $("body").append(asdDiv);
        asdButton.trigger("click");
        asdDiv.remove();
        return true;
    } else {
        var divthingie = $("<div>");
        divthingie.append($("<p>").text("Clipboard access failed. Please copy the link below:"));
        divthingie.append($("<input>").attr("type", "text").css({ width: "100%" }).prop("readonly", true).val(_url).click(function () { $(this).select(); }));
        window.ShowMessageDialog(divthingie);
        return false;
    }
}

$(function () {
    if (ClipboardJS && ClipboardJS.isSupported()) {
        var clipboard = new ClipboardJS(".btncopymagicclass");
        window.clipboardsupport = true;
        clipboard.on('success', function (e) {
            window.shownotify("The link to this skill tree has been copied to clipboard.", 'success');
        });
        clipboard.on('error', function (e) {
            var divthingie = $("<div>");
            divthingie.append($("<p>").text("Clipboard access failed. Please copy the link below:"));
            divthingie.append($("<input>").attr("type", "text").css({ width: "100%" }).prop("readonly", true).val(e.text).click(function () { $(this).select(); }));
            window.ShowMessageDialog(divthingie);
        });
    }
    else {
        window.clipboardsupport = false;
    }

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

    var cached_querstring = window.location.search,
        showassignment = GetUrlParam("sa", null),
        clevel = GetUrlParam("lv", 60),
        param_selectedclass = GetUrlParam("c", window.SkillCore.GetAvailableClassIndex());
    if (clevel == 60) clevel = GetUrlParam("level", 60);
    if (isNaN(clevel)) clevel = 60;

    window.SkillCore.ReadTree(function (data) {
        param_selectedclass = Math.min(param_selectedclass, window.SkillCore.GetAvailableClassIndex());
        let level_selecting = $("<select>").attr("id", "selectLevelBox").change(function () {
            var selectedlevel = $(this).val();
            if (window.SkillCore.SetLevel(selectedlevel)) {
                clevel = selectedlevel;
            } else {
                $(this).val(clevel);
            }
        });
        for (var i = 1; i <= window.c_maxlevel; i++)
            level_selecting.append($("<option>").val(i).text(i));
        $("#levelBoxtd").append(level_selecting);
        level_selecting.val(clevel);

        let class_selecting = $("<select>").attr("id", "selectClassBox").change(function () {
            var selectedclass = $(this).val();
            var changingclassinfo = window.SkillCore.GetClass(selectedclass);
            if (window.SkillCore.IsSelectiveClass(selectedclass)) {
                ShowConfirmDialog($("<span><strong>Changing class will reset your skill tree.</strong><br/>Are you sure you want to change class?</span>"), function () {
                    window.SkillCore.UnlearnAllSkills();
                    if (window.SkillCore.SetSelectedClass(selectedclass)) {
                        param_selectedclass = selectedclass;
                        ReRenderTree(window.SkillCore.GetSelectedClass());
                    } else {
                        $("#selectClassBox").val(param_selectedclass);
                    }
                }, function () {
                    $("#selectClassBox").val(param_selectedclass);
                });
            } else {
                shownotify("The class you selected requires the character to be at least at level " + (changingclassinfo.RequiredLevel || "????"), 'info');
                $("#selectClassBox").val(param_selectedclass);
            }
        });
        if (data.hasOwnProperty("AvailableClass")) {
            for (var item in data.AvailableClass) {
                if (data.AvailableClass.hasOwnProperty(item)) {
                    class_selecting.append($("<option>").val(item).text(data.AvailableClass[item].Name || "Unknown"));
                }
            }
        } else {
            class_selecting.append($("<option>").val(0).text("Base"));
        }
        $("#classBoxtd").append(class_selecting);
    }, function (isCompleted, statusText, errorThrown) {
        RemoveLoading($("body"));
        if (isCompleted === false) {
            ShowRetryDialog($("<span>Unknown internet error occurred: " + errorThrown + "<br/>Do you want to retry?</span>"), function () {
                PageReload();
            });
        } else {
            let classrequiredlv = window.SkillCore.GetClass(param_selectedclass).RequiredLevel || 0;
            if (clevel < classrequiredlv) {
                shownotify("The class you selected requires the character to be at least at level " + (changingclassinfo.RequiredLevel || "????"), 'info');
                clevel = classrequiredlv;
            }
            // Correct it again in case people messed it up
            window.SkillCore.SetCharacterInfo(clevel, param_selectedclass);

            let level_selecting = $("#selectLevelBox");
            level_selecting.val(clevel);
            let class_selecting = $("#selectClassBox");
            class_selecting.val(param_selectedclass);
            //class_selecting.trigger("change");

            ReRenderTree(window.SkillCore.GetClass(param_selectedclass));

            // Read the info from URL string. This is for loading the shared link.
            for (let skill_id_name in window.SkillCore.SkillList) {
                if (window.SkillCore.SkillList.hasOwnProperty(skill_id_name)) {
                    let tmpvalue = window.SkillCore.SkillList[skill_id_name];
                    if (tmpvalue._availablelevel <= clevel && tmpvalue.IsClassAvailable(param_selectedclass)) {
                        let paraminfo = readurlparam(tmpvalue.GetID(), cached_querstring);
                        if (!paraminfo && tmpvalue.ShortID)
                            paraminfo = readurlparam(tmpvalue.ShortID, cached_querstring);
                        if (!paraminfo) paraminfo = tmpvalue.GetDefaultLevel();
                        tmpvalue.SetCurrentSkillLevel(paraminfo);
                    } else {
                        tmpvalue.SetCurrentSkillLevel(0);
                    }
                }
            }

            window.SkillCore.ReadAssignment();
            if (showassignment === "1")
                $("#slotassignment").click();
        }
    });
});
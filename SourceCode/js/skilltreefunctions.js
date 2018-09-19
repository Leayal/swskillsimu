// Set up fallback for requestAnimationFrame function.
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) { return setTimeout(callback, 1000 / 60); };
// Set up fallback for cancelAnimationFrame function.
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function (callback) { clearTimeout(callback); };

const v_PreviewHeight = "170px",
    mediaType = {
        webm_vp9: "video/webm; codecs=\"vp9\"",
        mp4_h264: "video/mp4; codecs=\"avc1.64001E\""
    };
// type="video/mp4; codecs=\"avc1.64001E\""
let justSomeTemp1 = document.createElement("video");
const SupportedCodec = {
    webm: {
        vp9: (justSomeTemp1.canPlayType(mediaType.webm_vp9) === "probably"),
    },
    mp4: {
        h264_highProfile: (justSomeTemp1.canPlayType(mediaType.mp4_h264) === "probably")
    }
}
justSomeTemp1 = null;
const isPromiseSupported = (typeof (Promise) !== "undefined");

const previewOptions = {
    "No preview": 0,
    "Show video": 1,
    "Show video (Beta)": 2
};

const previewOptionExplains = {
    0: "Turn off preview",
    1: "Show skill preview with MP4 container with video codec H.264 (Profile High). This container and the codec are widely supported in most of browsers you can find.",
    2: "\"Show video (Beta)\" will use WebM container with video codec VP9 to achieve even higher compression. This means you will download less data (it happens only once anyway or until browser's cache is expired or cleaned, so you don't really save anything much) in exchange of higher compute power to decode and play the video. It may have some visual bugs, too, select \"Show video\" option if you can't stand the bug or the video can't be played."
};

var mouseX;
var mouseY;

$(document).mousemove(function (e) {
    window.mouseX = e.pageX;
    window.mouseY = e.pageY;
});

function SetToolTip(obj) {
    obj.attr("tooltipframework", "0");
    return obj;
}

// String.prototype.includes

function SetToolTipUp(obj) {
    obj.attr("tooltipframework", "1");
    return obj;
}

function SetToolTipDown(obj) {
    obj.attr("tooltipframework", "-1");
    return obj;
}

function ChangeFileExtension() {
    if (arguments.length === 2) {
        let pos = arguments[0].lastIndexOf(".");
        if (pos === -1) {
            return (arguments[0] + arguments[1]);
        } else {
            return arguments[0].substr(0, pos) + arguments[1];
        }
    } else if (arguments.length === 3) {
        let pos = arguments[0].lastIndexOf(arguments[1]);
        if (pos === -1) {
            return (arguments[0] + arguments[2]);
        } else {
            return arguments[0].substr(0, pos) + arguments[2];
        }
    } else {
        return arguments[0];
    }
}

function IsExtension(filename, extension) { return (filename.lastIndexOf(extension) !== -1); }

function ShowDangerDialog(msg, yesCallback, noCallback) {
    let dialog = new Bootstrap4ModalDialog($("#dialogs"), msg, "Warning", Bootstrap4ModalDialog.Buttons.YesNoDanger, Bootstrap4ModalDialog.Type.Danger);
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
    let dialog = new Bootstrap4ModalDialog($("#dialogs"), jquery_format_msg, title, Bootstrap4ModalDialog.Buttons.Retry, Bootstrap4ModalDialog.Type.Warning);
    dialog.RegisterCallback(function (sender, val) {
        if (val && (typeof retryCallback === "function"))
            retryCallback();
    });
    dialog.Show();
}

function ShowMessageDialog(jquery_format_msg, okayCallback) {
    let dialog = new Bootstrap4ModalDialog($("#dialogs"), jquery_format_msg, "Notice", null, Bootstrap4ModalDialog.Type.Info);
    dialog.RegisterCallback(function (sender, val) {
        if (val && (typeof okayCallback === "function"))
            okayCallback();
    });
    dialog.Show();
}

function ShowConfirmDialog(msg, yesCallback, noCallback) {
    let dialog = new Bootstrap4ModalDialog($("#dialogs"), msg, "Double confirmation", Bootstrap4ModalDialog.Buttons.YesNo, Bootstrap4ModalDialog.Type.Primary);
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

    let dialog = new Bootstrap4ModalDialog($("#dialogs"), window.SkillCore.GetSkillAssignmentRender(), "Skill slot assignment", [
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
    }, true);
}

function copyLink(_url) {
    if (window.clipboardsupport) {
        var asdDiv = $("<div>").addClass("hiddendiv");
        var asdButton = $("<button>").addClass("btncopymagicclass").attr("data-clipboard-text", encodeURI(_url));
        asdDiv.append(asdButton);
        $(document.body).append(asdDiv);
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

$(document).ready(function () {
    // UI tricks
    var myBodeh = $(document.body);
    myBodeh.on("click", ".dropdown-menu.keep-open", function (e) {
        if (e)
            e.stopPropagation();
    });

    // Setting init
    window.SkillTreeSetting = {};
    var domtarget_skillsimulatoroption = $("#skillsimulatoroption"),
        domtarget_skillpreview = $("#option_skillpreview select"),
        domtarget_saveSetting = $("#saveSettingToBrowser"),
        popover_saveSetting = null;

    // Read setting
    let tmpSettingVal, defaultValue_SkillPreview = previewOptions["Show video (Beta)"];
    tmpSettingVal = SafeStorage.GetData("skilltree_firsttime");
    window.SkillTreeSetting.skilltree_firsttime = ((typeof (tmpSettingVal) === "string") ? parseInt(tmpSettingVal) : 1);
    tmpSettingVal = SafeStorage.GetData("skilltree_skillpreview");
    window.SkillTreeSetting.skilltree_skillpreview = ((typeof (tmpSettingVal) === "string") ? parseInt(tmpSettingVal) : defaultValue_SkillPreview);

    if (!previewOptionExplains.hasOwnProperty(window.SkillTreeSetting.skilltree_skillpreview))
        window.SkillTreeSetting.skilltree_skillpreview = defaultValue_SkillPreview;

    var skillpreview_explain = $("<span>").text(previewOptionExplains[window.SkillTreeSetting.skilltree_skillpreview]),
        popover_skillpreview = domtarget_skillpreview.popover({
            animation: true,
            placement: "right",
            trigger: "hover focus",
            html: true,
            content: skillpreview_explain
        });

    // Setting listeners
    domtarget_skillpreview.change(function () {
        window.SkillTreeSetting.skilltree_skillpreview = parseInt($(this).val());
        skillpreview_explain.text(previewOptionExplains[window.SkillTreeSetting.skilltree_skillpreview]);
        popover_skillpreview.popover("update");
    });

    for (var stringname in previewOptions) {
        if (previewOptions.hasOwnProperty(stringname)) {
            domtarget_skillpreview.append($("<option>").attr("value", previewOptions[stringname]).text(stringname));
        }
    }

    // Setting controls init
    if (typeof (window.SkillTreeSetting.skilltree_firsttime) === "undefined" || window.SkillTreeSetting.skilltree_firsttime === 1) {
        // First time visit the site or the user has never saved the setting to browser
        domtarget_skillsimulatoroption.addClass("highlight-red");
        popover_saveSetting = domtarget_saveSetting.popover({ animation: true, placement: "right", trigger: "hover focus", content: "The option you changed here will not be remembered next time you visit the site. Save the setting to your browser will make your browser remember the setting forever, even when the browser is restarted." });

        domtarget_skillsimulatoroption.one("mouseover", function () {
            domtarget_skillsimulatoroption.removeClass("highlight-red");
        });
    }
    domtarget_skillpreview.val(window.SkillTreeSetting.skilltree_skillpreview);

    // Save Setting
    domtarget_saveSetting.click(function (e) {
        e.preventDefault();
        let link_localStorage = "<a href=\"https://www.w3schools.com/html/html5_webstorage.asp\" target=\"_blank\">localStorage</a>",
            link_cookie = "<a href=\"https://www.w3schools.com/js/js_cookies.asp\" target=\"_blank\">cookie</a>";

        if (popover_saveSetting) {
            popover_saveSetting.popover("hide");
            popover_saveSetting.on("hidden.bs.popover", function () {
                popover_saveSetting.popover("disable");
                popover_saveSetting.popover("dispose");
                popover_saveSetting = null;
            });
        }

        var func_save = function thisfunc() {
            try {
                for (let key in window.SkillTreeSetting) {
                    if (window.SkillTreeSetting.hasOwnProperty(key)) {
                        SafeStorage.SetData(key, window.SkillTreeSetting[key]);
                    }
                }
                shownotify("Your setting has been saved", "success");
            } catch (ex) {
                ShowDangerDialog($("<div>")
                    .append($("<span>").text("Error: " + ex))
                    .append($("<br/>"))
                    .append($("<span>").text("Do you want to retry?")), function () {
                        thisfunc();
                    });
            }
        };
        if (window.SkillTreeSetting.skilltree_firsttime === 0) {
            func_save();
        } else {
            var myfunc = function (event) {
                if (typeof (event.stopPropagation) === "function")
                    event.stopPropagation();
            },
                dialogContent = $("<span>The setting will be saved to your web browser by using " + link_localStorage + " (Or fallback to " + link_cookie + " if your browser does not support " + link_localStorage + ").<br/><strong>Do you want to store the data on your computer?</strong></span>")
                    .on("click", "a", myfunc);

            ShowConfirmDialog(dialogContent, function () {
                window.SkillTreeSetting.skilltree_firsttime = 0;
                dialogContent.off("click", "a", myfunc);
                func_save();
            }, function () {
                dialogContent.off("click", "a", myfunc);
            });
        }
    });

    // Clipboard API init
    if (ClipboardJS && ClipboardJS.isSupported()) {
        let clipboard = new ClipboardJS(".btncopymagicclass");
        window.clipboardsupport = true;
        clipboard.on("success", function (e) {
            window.shownotify("The link to this skill tree has been copied to clipboard.", 'success');
        });
        clipboard.on("error", function (e) {
            let divthingie = $("<div>");
            divthingie.append($("<p>").text("Clipboard access failed. Please copy the link below:"));
            divthingie.append($("<input>").attr("type", "text").css({ width: "100%" }).prop("readonly", true).val(e.text).click(function () { $(this).select(); }));
            window.ShowMessageDialog(divthingie);
        });
    }
    else {
        window.clipboardsupport = false;
    }

    // Dialog API init
    var dialogObject = $("#dialogs");
    dialogObject.hide().click(function (e) {
        e.preventDefault();
        window.DialogManager.CloseForegroundDialog();
    });
    window.DialogManager.OnModalChanged(function (val) {
        if (val)
            dialogObject.show();
        else
            dialogObject.hide();
    });
    SetLoading(myBodeh);

    // Tooltip Framework init

    var tooltipObj = $("#tooltip"),
        tooltipHeader = $("#tooltip .tooltipheader"),
        tooltippreviewPanel = $("#tooltip #skillpreview").css("height", v_PreviewHeight),
        tooltippreviewPanel_video = $("#tooltip #skillpreview video")
            .css({ height: v_PreviewHeight }),
        tooltipText = $("#tooltip pre"),
        navBarBottom = $(".navbar.fixed-bottom"),
        toolTipFramework = new SkillTreeToolTipFramework(tooltipObj, "[tooltipframework][insight]");
    tooltipObj.detach();

    if (isPromiseSupported) {
        tooltippreviewPanel_video.on("error", function () {
            tooltippreviewPanel.hide();
        }).on("canplay", function (event) {
            let objPromise = event.target.play();
            if (objPromise) {
                objPromise.catch(function () {
                    tooltippreviewPanel.hide();
                    toolTipFramework.UpdateTooltipSize();
                });
            }
        });
    } else {
        if (tooltippreviewPanel_video) {
            tooltippreviewPanel_video.remove();
            tooltippreviewPanel_video = null;
        }
    }

    toolTipFramework.OnMouseEnter.Register(function (event) {
        let key = $(event.target).attr("insight");
        if (key) {
            let tooltipInfoType = $(event.target).attr("tooltipframework");

            if (isNaN(tooltipInfoType)) {
                event.cancel = true;
                return;
            }

            // StringBuilder in the nutshell
            let stringbuilder = [],
                skillinfoooo = window.SkillCore.GetSkill(key),
                currentEffect = skillinfoooo.GetCurrentLevelInfo(),
                // No, not Adobe's AfterEffect reference.
                afterEffect = null;

            tooltipHeader.text(skillinfoooo.GetName());

            let previewinfo = currentEffect.PreviewInfo;

            toolTipFramework.SetBound(0, 0, 0, navBarBottom.outerHeight(true) || 0);
            // tooltippreviewPanel.hide();

            if (isPromiseSupported && tooltippreviewPanel_video && (window.SkillTreeSetting.skilltree_skillpreview !== previewOptions["No preview"]) && previewinfo) {
                let hasVP9 = (typeof (previewinfo.Video.vp9) === "string"),
                    hasH264 = (typeof (previewinfo.Video.h264) === "string");

                if (hasVP9 || hasH264) {
                    // Show preview video if it has one
                    let _attributes = {
                        src: null
                    };

                    if ((window.SkillTreeSetting.skilltree_skillpreview === previewOptions["Show video (Beta)"]) && hasVP9 && SupportedCodec.webm.vp9) {
                        // Main feed: a WebM container with VP9 codec with 420p pixel format
                        _attributes.src = previewinfo.Video.vp9;
                        _attributes.type = mediaType.webm_vp9;
                    } else if (hasH264 && SupportedCodec.mp4.h264_highProfile) {
                        // Provide fallback to MP4 container with codec H264 with 420p pixel format
                        _attributes.src = previewinfo.Video.h264;
                        _attributes.type = mediaType.mp4_h264;
                    }

                    if (typeof (_attributes.src) === "string") {
                        tooltippreviewPanel_video.attr(_attributes);
                        tooltippreviewPanel.show();
                        // tooltippreviewPanel_video.trigger("load");
                        // Trigger first time
                        tooltippreviewPanel_video[0].play();
                    } else {
                        tooltippreviewPanel.hide();
                    }
                    // } else if (typeof (previewinfo.Image) === "string") {
                    // Show preview image if it has one
                    // $("<img>").attr({ width: "240", height: "auto", src: previewinfo.Image }).appendTo(tooltippreviewPanel);
                } else {
                    if (tooltippreviewPanel_video) {
                        if (!tooltippreviewPanel_video[0].paused) {
                            tooltippreviewPanel_video.trigger("pause");
                        }
                    }
                    tooltippreviewPanel.hide();
                }
            } else {
                if (tooltippreviewPanel_video) {
                    if (!tooltippreviewPanel_video[0].paused) {
                        tooltippreviewPanel_video.trigger("pause");
                    }
                }
                tooltippreviewPanel.hide();
            }

            tooltipInfoType = parseInt(tooltipInfoType);
            switch (tooltipInfoType) {
                case -1:
                    // Mean skill level down
                    afterEffect = skillinfoooo.GetPreviousLevelInfo();
                    if (currentEffect || afterEffect) {
                        let before = currentEffect.SkillEffect;
                        let after = "";
                        if (afterEffect) after = afterEffect.SkillEffect;
                        stringbuilder.push("[Current]");
                        if (before) {
                            stringbuilder.push("\n");
                            stringbuilder.push(before);
                        } else {
                            stringbuilder.push("\n<No info available>");
                        }
                        stringbuilder.push("\n\n[After]");
                        if (after) {
                            stringbuilder.push("\n");
                            stringbuilder.push(after);
                        } else {
                            stringbuilder.push("\n<No info available>");
                        }
                    }
                    break;
                case 0:
                    // Mean skill viewing description only
                    if (currentEffect) {
                        let desc = currentEffect.SkillDescription;
                        let eff = currentEffect.SkillEffect;
                        if (desc) {
                            stringbuilder.push("[Description]\n");
                            stringbuilder.push(desc);
                        }
                        if (eff) {
                            if (stringbuilder.length !== 0) {
                                stringbuilder.push("\n\n");
                            }
                            stringbuilder.push("[Effect]\n");
                            stringbuilder.push(eff);
                        }
                    }
                    break;
                case 1:
                    // Mean skill level up
                    afterEffect = skillinfoooo.GetNextLevelInfo();
                    if (currentEffect || afterEffect) {
                        let before = currentEffect.SkillEffect;
                        let after = "";
                        if (afterEffect) after = afterEffect.SkillEffect;
                        stringbuilder.push("[Current]");
                        if (before) {
                            stringbuilder.push("\n");
                            stringbuilder.push(before);
                        } else {
                            stringbuilder.push("\n<No info available>");
                        }
                        stringbuilder.push("\n\n[After]");
                        if (after) {
                            stringbuilder.push("\n");
                            stringbuilder.push(after);
                        } else {
                            stringbuilder.push("\n<No info available>");
                        }
                    }
                    break;
                default:
                    // How can I supposed to be here????
                    event.cancel = true;
                    return;
            }
            if (stringbuilder !== 0) {
                tooltipText.text(stringbuilder.join("")).show();
            } else {
                tooltipText.empty().hide();
            }
            tooltipObj.insertAfter(dialogObject);
        }
    });
    toolTipFramework.OnTooltipHidden.Register(function (targetDOM) {
        if (tooltippreviewPanel_video) {
            if (!tooltippreviewPanel_video[0].paused) {
                tooltippreviewPanel_video.trigger("pause");
            }
        }
        // tooltipObj.detach();
    });
    toolTipFramework.StartListen();

    // Skill tree init
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
        ShowDangerDialog("Are you sure you want to unlearn all skills?", function () {
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
        RemoveLoading(myBodeh);
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
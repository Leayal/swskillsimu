const ClassOperator = {
    // Require the class to be equal to higher
    AtLeast: 0,
    // Require the class to be equal only
    MustMatch: 1,
    // Require the class to be equal to lower
    AtMost: 2
};

const ClassIndex = {
    Base: 0,
    Upgraded: 1
}

function SkillInfo(_skilltreeCore, __id, skillName, infos) {
    Object.defineProperty(this, "SkillCore", {
        value: _skilltreeCore,
        writable: false,
        configurable: false
    });
    this._rowspan = [];
    this._defaultLevel = 0;
    this._id = __id;
    // Yes. You read it right. By default the skill will never available.
    this._availablelevel = window.appdata.maxCharacterLevel + 1;
    this._currentskilllevel = 0;
    this._name = skillName;
    this._passive = false;
    this._parent = null;
    this._visible = true;
    this._spused = 0;
    this.Assignable = true;
    this.RequiredClassIndex = 0;
    this._previewinfo = null;
    this.readInfos(infos);
}

SkillInfo.prototype.readInfos = function (ob) {
    this.Levels = [];
    let lastDescription = "",
        lastpreviewinfo = null;

    /*
    if (typeof (previewinfo.Video) === "string") {
                    let autoExtension = IsExtension("", ".{{auto}}");
                    if (autoExtension) {
                        ChangeFileExtension("")
                    }
                } else {
                }
    */
    for (var skinfo in ob.Levels) {
        let tmp = ob.Levels[skinfo];
        if (tmp.Description)
            lastDescription = tmp.Description;
        if (tmp.Preview) {
            if (typeof (tmp.Preview.Video) === "string") {
                let autoExtension = IsExtension(tmp.Preview.Video, ".{{auto}}")
                result = {};
                result.Video = {};
                if (autoExtension) {
                    result.Video.vp9 = ChangeFileExtension(tmp.Preview.Video, ".{{auto}}", ".webm");
                    result.Video.h264 = ChangeFileExtension(tmp.Preview.Video, ".{{auto}}", ".mp4");
                } else {
                    if (IsExtension(tmp.Preview.Video, ".webm")) {
                        result.Video.vp9 = tmp.Preview.Video;
                    } else if (IsExtension(tmp.Preview.Video, ".mp4")) {
                        result.Video.h264 = tmp.Preview.Video;
                    }
                }
                lastpreviewinfo = result;
            } else {
                lastpreviewinfo = tmp.Preview;
            }
        }
        this.Levels.push(new LevelInfo(tmp.RequiredLevel, tmp.RequiredSP, tmp.Effect, lastDescription, lastpreviewinfo));
    };
    this._string_extensions = ob.Extensions;
    if (ob.Passive)
        this._passive = ob.Passive;
    this._iconURL = ob.Icon;
    if (ob.Assignable == false)
        this.Assignable = ob.Assignable;
    if (ob.Visible == false)
        this._visible = ob.Visible;
    this._skillmaxlevel = this.Levels.length - 1;
    if (ob.DefaultLevel > 0)
        this._defaultLevel = ob.DefaultLevel;
    this._availablelevel = this.Levels[1].RequiredLevel;
    if (ob.ID)
        this.ShortID = ob.ID;

    if (ob.hasOwnProperty("RowSpan")) {
        let highestCount = this.SkillCore.GetAvailableClassIndex(),
            lastknownvalue = 1;
        for (var classIndex = ClassIndex.Base; classIndex <= highestCount; classIndex++) {
            if (ob.RowSpan.hasOwnProperty(classIndex)) {
                lastknownvalue = ob.RowSpan[classIndex];
            }
            this._rowspan[classIndex] = lastknownvalue;
        }
    }
    if (ob.hasOwnProperty("RequireClass")) {
        let comparer = ob.RequireClass.CompareType || ClassOperator.AtLeast;
        if (isNaN(comparer)) {
            if (typeof (comparer) === "string") {
                comparer = comparer.toLowerCase();
                if (comparer === "atmost" || comparer === "<") {
                    comparer = ClassOperator.AtMost;
                } else if (comparer === "mustmatch" || comparer === "=") {
                    comparer = ClassOperator.MustMatch;
                } else {
                    comparer = ClassOperator.AtLeast;
                }
            } else {
                comparer = ClassOperator.AtLeast;
            }
        } else {
            // This is useless, but whatever.
            switch (comparer) {
                case ClassOperator.AtMost:
                    comparer = ClassOperator.AtMost;
                    break;
                case ClassOperator.MustMatch:
                    comparer = ClassOperator.MustMatch;
                    break;
                default:
                    comparer = ClassOperator.AtLeast;
                    break;
            }
        }
        this._classComparer = comparer;
        this.RequiredClassIndex = ob.RequireClass.ClassIndex || 0;
    }
}

SkillInfo.prototype.SetSkillLevel = function () {
    if (this._availablelevel <= this.SkillCore.GetCurrentLevel()) {
        let paraminfo = GetUrlParam(this._id, null);
        if (!paraminfo && this.ShortID)
            paraminfo = GetUrlParam(this.ShortID, null);
        if (!paraminfo) paraminfo = this._defaultLevel;
        this.SetCurrentSkillLevel(paraminfo);
    } else {
        this.SetCurrentSkillLevel(0);
    }
}

SkillInfo.prototype.SetParent = function (obj) {
    this._parent = obj;
}

// Why these meaningless functions?
// I'm sorry but it was because the backward-compatible downgrade.
SkillInfo.prototype.GetParent = function () {
    return this._parent;
}
SkillInfo.prototype.GetID = function () {
    return this._id;
}
SkillInfo.prototype.GetName = function () {
    return this._name;
}
SkillInfo.prototype.GetAvailableLevel = function () {
    return this._availablelevel;
}
SkillInfo.prototype.GetSPUsed = function () {
    return this._spused;
}
SkillInfo.prototype.GetCurrentSkillLevel = function () {
    return this._currentskilllevel;
}
SkillInfo.prototype.GetMaxLevel = function () {
    return this._skillmaxlevel;
}
SkillInfo.prototype.GetCurrentLevelInfo = function () {
    return this.Levels[this._currentskilllevel];
}
SkillInfo.prototype.GetIconURL = function () {
    return this._iconURL;
}
SkillInfo.prototype.IsPassive = function () {
    return this._passive;
}
SkillInfo.prototype.GetDefaultLevel = function () {
    return this._defaultLevel;
}
SkillInfo.prototype.IsAssignable = function () {
    return this.Assignable;
}
SkillInfo.prototype.GetRowSpan = function (classIndex) {
    return this._rowspan[classIndex] || 1;
}
SkillInfo.prototype.GetNextLevelInfo = function () {
    return this.Levels[this._currentskilllevel + 1];
}
SkillInfo.prototype.GetPreviousLevelInfo = function () {
    return this.Levels[this._currentskilllevel - 1];
}
// Must return a direct link one, can't use embed like youtube or something
SkillInfo.prototype.GetExtensions = function () {
    if (!this._extensions) {
        this._extensions = {};
        let extName, exteItem;
        for (var extIndex in this._string_extensions) {
            extName = this._string_extensions[extIndex];
            exteItem = this.SkillCore.GetSkill(extName);
            exteItem.SetParent(this);
            this._extensions[extName] = exteItem;
        }
    }
    return this._extensions;
}
SkillInfo.prototype.IsVisible = function () {
    return this._visible;
}

SkillInfo.prototype.UnlearnSkill = function () {
    if (this._availablelevel > this.SkillCore.GetCurrentLevel())
        this.SetCurrentSkillLevel(0);
    else
        this.ToDefaultLevel();
}

SkillInfo.prototype.ToDefaultLevel = function () {
    this.SetCurrentSkillLevel(Math.max(0, this._defaultLevel));
}

SkillInfo.prototype.SetCurrentSkillLevel = function (_level) {
    for (let count = 0; count <= this._skillmaxlevel; count++) {
        if (this._currentskilllevel > _level)
            this.SkillDownEx();
        if (this._currentskilllevel < _level)
            this.SkillUp();
        if (this._currentskilllevel === _level)
            break;
    }
}

SkillInfo.prototype.IsClassAvailable = function (_classIndex) {
    if (this.RequiredClassIndex) {
        switch (this._classComparer) {
            case ClassOperator.AtMost:
                return (_classIndex <= this.RequiredClassIndex);
            case ClassOperator.MustMatch:
                return (_classIndex === this.RequiredClassIndex);
            default:
                // Default comparision is here: AtLeast.
                return (_classIndex >= this.RequiredClassIndex);
        }
    }
    // If the skill does not have info about class requirement, it means it will be available to all classes.
    return true;
}

SkillInfo.prototype.GetSkillPanel = function (ex, forceCreate) {
    if (this.Panel) {
        if (forceCreate) {
            if (this.Panel)
                this.Panel.remove();
            this.Panel = null;
        } else {
            return this.Panel;
        }
    }
    let mySkillCore = this.SkillCore;
    if (ex) {
        let skillInfoPanel = $("<div>").addClass("skillExinfopanel").addClass("fadeinAppear");
        skillInfoPanel.attr("insight", this._id);
        skillInfoPanel.css({
            'top': ''
        });
        let img = $("<img>").addClass("skillExIcon").attr("insight", this._id).attr("src", this.GetIconURL());
        skillInfoPanel.append(img);
        SetToolTip(img);
        let mybutton = $("<button type=\"button\" class=\"btn-success skillexup\" insight=\"" + this._id + "\">").attr("skillup", "1");
        if (this._currentskilllevel === this._skillmaxlevel)
            mybutton.addClass("disabled");
        SetToolTipUp(mybutton);
        skillInfoPanel.append(mybutton.click(function () {
            if (!$(this).hasClass("disabled")) {
                mySkillCore.GetSkill($(this).attr("insight")).SkillUp();
                $(this).trigger("mouseover");
            }
        }));
        this.btn_skillup = mybutton;
        mybutton = $("<button type=\"button\" class=\"btn-danger skillexdown\" insight=\"" + this._id + "\">").attr("skilldown", "1");
        if (this._currentskilllevel === this._defaultLevel)
            mybutton.addClass("disabled");
        SetToolTipDown(mybutton);
        skillInfoPanel.append(mybutton.click(function () {
            if (!$(this).hasClass("disabled")) {
                mySkillCore.GetSkill($(this).attr("insight")).SkillDown();
                $(this).trigger("mouseover");
            }
        }));
        this.btn_skilldown = mybutton;
        this.text_skillevel = $("<p insight=\"skilllexevel\">").addClass("skillExLevel").text(this._currentskilllevel + "" + this._skillmaxlevel);
        skillInfoPanel.append(this.text_skillevel);
        let exts = this.GetExtensions();
        if (exts !== undefined && Object.keys(exts).length > 0) {
            let extItem;
            for (var sle in exts) {
                extItem = mySkillCore.GetSkill(sle);
                extItem.GetSkillPanel(true).appendTo(skillInfoPanel);
            }
        }
        this.Panel = skillInfoPanel;
    } else {
        let skillInfoPanel = $("<div>").addClass("skillinfopanel").addClass("fadeinAppear");
        skillInfoPanel.attr("insight", this._id);
        let img = $("<img>").addClass("skillIcon").attr("insight", this._id).attr("src", this.GetIconURL());
        skillInfoPanel.append(img);
        SetToolTip(img);
        let mybutton = $("<button type=\"button\" class=\"btn btn-success skillup\" insight=\"" + this._id + "\">").attr("skillup", "1");
        if (this._currentskilllevel === this._skillmaxlevel)
            mybutton.addClass("disabled");
        SetToolTipUp(mybutton);
        skillInfoPanel.append(mybutton.click(function () {
            mySkillCore.GetSkill($(this).attr("insight")).SkillUp();
            $(this).trigger("mouseover");
        }));
        this.btn_skillup = mybutton;
        mybutton = $("<button type=\"button\" class=\"btn btn-danger skilldown\" insight=\"" + this._id + "\">").attr("skilldown", "1");
        if (this._currentskilllevel === this._defaultLevel)
            mybutton.addClass("disabled");
        SetToolTipDown(mybutton);
        skillInfoPanel.append(mybutton.click(function () {
            mySkillCore.GetSkill($(this).attr("insight")).SkillDown();
            $(this).trigger("mouseover");
        }));
        this.btn_skilldown = mybutton;
        this.text_skillevel = $("<p insight=\"skilllevel\">").addClass("skillLevel").text(this._currentskilllevel + "/" + this._skillmaxlevel);
        skillInfoPanel.append(this.text_skillevel);
        //skillInfoPanel.append($("<p>").addClass("skillName").text(this.GetName()));

        //Set Skill Extensions
        let exts = this.GetExtensions();
        if (exts !== undefined && Object.keys(exts).length > 0) {
            let extItem, foundExt = false,
                extIndex = 0;
            for (var sle in exts) {
                extItem = mySkillCore.GetSkill(sle);
                if (!extItem.IsVisible() && extItem.IsClassAvailable(mySkillCore.GetSelectedClassIndex())) {
                    extIndex++;
                    let extensionPanel = $('<div>').addClass("extension" + extIndex + "infopanel");
                    extItem.GetSkillPanel(true, true).appendTo(extensionPanel);
                    if (this._currentskilllevel < this._skillmaxlevel)
                        extItem.Disabled(true);
                    else {
                        if ((extItem.GetCurrentSkillLevel()) > 0) {
                            extItem.Disabled(false);
                            foundExt = true;
                        } else
                            extItem.Disabled(true);
                    }
                    extensionPanel.appendTo(skillInfoPanel);
                }
                //extItem.GetSkillPanel(true).children().addClass("disabled");
            }
            if (!foundExt && (this._currentskilllevel == this._skillmaxlevel))
                for (var sle in exts)
                    mySkillCore.GetSkill(sle).Disabled(false);
        }
        this.Panel = skillInfoPanel;
    }
    return this.Panel;
}

SkillInfo.prototype.Disabled = function (bool) {
    if (bool) {
        this.UnlearnSkill();
        let hohoho = this.GetSkillPanel();
        if (!hohoho.hasClass("disabled"))
            hohoho.addClass("disabled");
        hohoho.find("button[skilldown]:not(.disabled)").addClass("disabled");
        hohoho.find("button[skillup]:not(.disabled)").addClass("disabled");
        hohoho.find("img:not(.disabled)").addClass("disabled");
    } else {
        let hohoho = this.GetSkillPanel();
        if (hohoho.hasClass("disabled"))
            hohoho.removeClass("disabled");
        hohoho.find("img.disabled").removeClass("disabled");
        hohoho.find("button.disabled[skilldown]").removeClass("disabled");
        hohoho.find("button.disabled[skillup]").removeClass("disabled");
    }
}

SkillInfo.prototype.UpdateSkill = function () {
    if (!this.Panel) return;
    let panel = this.Panel,
        button_skillup = this.btn_skillup,
        button_skilldown = this.btn_skilldown;
    panel.children("p[insight=\"skilllevel\"]:first").text(this._currentskilllevel + "/" + this._skillmaxlevel);
    // panel.children("p[insight=\"skilllexevel\"]:first").text(this._currentskilllevel + "" + this._skillmaxlevel);
    if (this._currentskilllevel <= this._defaultLevel) {
        button_skilldown.addClass("disabled");
        let pa = this._parent;
        if (pa && !(pa.GetNextLevelInfo())) {
            let skillextensions = pa.GetExtensions();
            for (var ske in skillextensions)
                skillextensions[ske].Disabled(false);
        }
    } else if (this._currentskilllevel == this._skillmaxlevel) {
        button_skillup.addClass("disabled");
        let pa = this._parent;
        let skillextensions;
        if (pa) {
            let asdsss;
            skillextensions = pa.GetExtensions();
            for (var ske in skillextensions) {
                asdsss = skillextensions[ske];
                if ((asdsss.GetID()) !== this._id)
                    asdsss.Disabled(true);
            }
        }
        skillextensions = this.GetExtensions();
        for (var ske in skillextensions)
            skillextensions[ske].Disabled(false);
    } else {
        button_skilldown.removeClass("disabled");
        button_skillup.removeClass("disabled");
        let pa = this._parent;
        let skillextensions;
        if (pa) {
            let asdsss;
            skillextensions = pa.GetExtensions();
            for (var ske in skillextensions) {
                asdsss = skillextensions[ske];
                if ((asdsss.GetID()) !== this._id)
                    asdsss.Disabled(true);
            }
        }
        skillextensions = this.GetExtensions();
        for (var ske in skillextensions)
            skillextensions[ske].Disabled(true);
    }
}

SkillInfo.prototype.SkillUp = function () {
    var next = this.GetNextLevelInfo();
    if (next) {
        if (next.RequiredLevel > (this.SkillCore.GetCurrentLevel())) {
            shownotify("Character level is not enough to learn further.", 'info');
            return;
        }
        var reqSP = next.RequiredSP;
        if ((this.SkillCore.GetSPLeft()) < reqSP) {
            shownotify("Insufficient skill point.", 'info');
            return;
        }
        this._currentskilllevel++;
        this._spused += reqSP;
        this.SkillCore.InvestedSPIncrease(reqSP);
        this.UpdateSkill();
    }
}

SkillInfo.prototype.SkillDown = function () {
    let prev = this.GetPreviousLevelInfo();
    if (prev) {
        if (this._defaultLevel === this._currentskilllevel) {
            shownotify("Can not go lower than skill's default level.", 'warning');
            return;
        }
        let reqSP = this.GetCurrentLevelInfo().RequiredSP;
        this._spused -= reqSP;
        this.SkillCore.InvestedSPDecrease(reqSP);
        this._currentskilllevel--;
        this.UpdateSkill();
    }
}

SkillInfo.prototype.SkillDownEx = function () {
    let prev = this.GetPreviousLevelInfo();
    if (prev) {
        this.SkillCore.InvestedSPDecrease(this.GetCurrentLevelInfo().RequiredSP);
        this._currentskilllevel--;
        this.UpdateSkill();
    }
}

function LevelInfo(__requiredlevel, __requiredsp, __effect, __description, _previewinfo) {
    this.RequiredLevel = __requiredlevel;
    this.RequiredSP = __requiredsp;
    this.SkillDescription = __description;
    this.SkillEffect = __effect;
    this.PreviewInfo = _previewinfo;
}
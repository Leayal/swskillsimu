SkillTreeCore.prototype.ReadTree = function (loadingCallback, loadedCallback) {
    this.SkillList = {};
    this.ActiveSkillList = {};
    this.PassiveSkillList = {};
    this.SkillCount = 0;
    this.loadedSkillCount = 0;
    $.ajax({
        cache: false,
        url: "skilltreeinfo.json",
        dataType: "json",
        success: function (json) {
            if (json.CharacterName)
                $("#charName").text(json.CharacterName);
            else
                $("#charName").text(GetCurrentFolderUrl());
            if (json.CharacterWikiURL) {
                if (json.CharacterName)
                    $("#morecharacterinfo").attr("href", json.CharacterWikiURL).attr("target", "_blank").text("More info about " + json.CharacterName);
                else
                    $("#morecharacterinfo").attr("href", json.CharacterWikiURL).attr("target", "_blank").text("More info about " + GetCurrentFolderUrl());
            } else
                $("#morecharacterinfo").remove();
            //$("li#charName").append($("<a>").attr("href", json.CharacterWikiURL).attr("target", "_blank").text(json.CharacterName));
            window.document.title = "Skill Simulator - " + json.CharacterName;
            for (var ssk in json.Skills)
                if (json.Skills.hasOwnProperty(ssk)) {
                    window.SkillCore.SkillList[ssk] = new SkillInfo(ssk, json.Skills[ssk]["Name"], json.Skills[ssk]);
                    if (window.SkillCore.SkillList[ssk].IsPassive())
                        window.SkillCore.PassiveSkillList[ssk] = window.SkillCore.SkillList[ssk];
                    else
                        window.SkillCore.ActiveSkillList[ssk] = window.SkillCore.SkillList[ssk];
                };
            window.SkillCore.SkillCount = Object.keys(window.SkillCore.SkillList).length;
            if (typeof (loadingCallback) === "function")
                loadingCallback(json);
            window.SkillCore.RenderTree(loadedCallback);
        }
    });
}

SkillTreeCore.prototype.GetSkill = function (id) {
    return this.SkillList[id];
}

SkillTreeCore.prototype.GetSkillByShortID = function (shortID) {
    for (var ssk in this.SkillList)
        if (this.SkillList.hasOwnProperty(ssk)) {
            if (this.SkillList[ssk].ShortID && (this.SkillList[ssk].ShortID == shortID))
                return this.SkillList[ssk];
        };
    return null;
}

SkillTreeCore.prototype.RenderTree = function (loadedCallback) {
    var eTree = $("li#activeskill");
    if (eTree) {
        var activeRow = $("<ul>").addClass("tableactiveskill");
        eTree.empty();
        var activeCount = 0;
        for (var sl in this.ActiveSkillList) {
            if (this.ActiveSkillList[sl].IsVisible()) {
                if (this.ActiveSkillList[sl].GetRowSpan() > 1) {
                    activeCount += this.ActiveSkillList[sl].GetRowSpan();
                } else
                    activeCount++;
                activeRow.append($("<li>").addClass("tablelike").append(this.ActiveSkillList[sl].GetSkillPanel()));
                if (activeCount >= 3) {
                    if (activeRow)
                        eTree.append(activeRow);
                    activeRow = $("<ul>").addClass("tableactiveskill");
                    activeCount = 0;
                }
            }
        }
        if (activeCount > 0)
            if (activeRow)
                eTree.append(activeRow);
    }
    eTree = $("li#passiveskill");
    if (eTree) {
        var passiveRow = $("<ul>").addClass("tablepassiveskill");
        eTree.empty();
        var passiveCount = 0;
        for (var sl in this.PassiveSkillList) {
            if (this.PassiveSkillList[sl].IsVisible()) {
                if (this.PassiveSkillList[sl].GetRowSpan() > 1) {
                    passiveCount += this.PassiveSkillList[sl].GetRowSpan();
                } else
                    passiveCount++;
                passiveRow.append($("<li>").addClass("tablelike").addClass("passiveskilltree").append(this.PassiveSkillList[sl].GetSkillPanel()));
                if (passiveCount >= 2) {
                    if (passiveRow)
                        eTree.append(passiveRow);
                    passiveRow = $("<ul>").addClass("tablepassiveskill");
                    passiveCount = 0;
                }
            }
        }
        if (passiveCount > 0)
            if (passiveRow)
                eTree.append(passiveRow);
    }

    if (typeof loadedCallback === "function") {
        $("#skilltree").imagesLoaded().always(function () {
            loadedCallback();
        });
    }
}

SkillInfo.prototype.GetSkillPanel = function (ex) {
    if (this.Panel) return this.Panel;
    if (ex) {
        var skillInfoPanel = $("<div>").addClass("skillExinfopanel").addClass("fadeinAppear");
        skillInfoPanel.attr("insight", this._id);
        skillInfoPanel.css({ 'top': '' });
        var img = $("<img>").addClass("skillExIcon").attr("insight", this._id).attr("src", this.GetIconURL());
        skillInfoPanel.append(img);
        SetToolTip(img);
        var mybutton = $("<button type=\"button\" class=\"btn-success skillexup\" insight=\"" + this._id + "\">").attr("skillup", "1");
        if (this._currentskilllevel === this._skillmaxlevel)
            mybutton.addClass("disabled");
        SetToolTipUp(mybutton);
        skillInfoPanel.append(mybutton.click(function () {
            if (!$(this).hasClass("disabled")) {
                window.SkillCore.GetSkill($(this).attr("insight")).SkillUp();
                $(this).trigger("mouseover");
            }
        }));
        mybutton = $("<button type=\"button\" class=\"btn-danger skillexdown\" insight=\"" + this._id + "\">").attr("skilldown", "1");
        if (this._currentskilllevel === this._defaultLevel)
            mybutton.addClass("disabled");
        SetToolTipDown(mybutton);
        skillInfoPanel.append(mybutton.click(function () {
            if (!$(this).hasClass("disabled")) {
                window.SkillCore.GetSkill($(this).attr("insight")).SkillDown();
                $(this).trigger("mouseover");
            }
        }));
        skillInfoPanel.append($("<p insight=\"skilllexevel\">").addClass("skillExLevel").text(this._currentskilllevel + "" + this._skillmaxlevel));
        var exts = this.GetExtensions();
        if (exts !== undefined && Object.keys(exts).length > 0) {
            var extItem;
            for (var sle in exts) {
                extItem = window.SkillCore.GetSkill(sle);
                extItem.GetSkillPanel(true).appendTo(skillInfoPanel);
            }
        }
        this.Panel = skillInfoPanel;
    } else {
        var skillInfoPanel = $("<div>").addClass("skillinfopanel").addClass("fadeinAppear");
        skillInfoPanel.attr("insight", this._id);
        var img = $("<img>").addClass("skillIcon").attr("insight", this._id).attr("src", this.GetIconURL());
        skillInfoPanel.append(img);
        SetToolTip(img);
        var mybutton = $("<button type=\"button\" class=\"btn btn-success skillup\" insight=\"" + this._id + "\">").attr("skillup", "1");
        if (this._currentskilllevel === this._skillmaxlevel)
            mybutton.addClass("disabled");
        SetToolTipUp(mybutton);
        skillInfoPanel.append(mybutton.click(function () {
            window.SkillCore.GetSkill($(this).attr("insight")).SkillUp();
            $(this).trigger("mouseover");
        }));
        mybutton = $("<button type=\"button\" class=\"btn btn-danger skilldown\" insight=\"" + this._id + "\">").attr("skilldown", "1");
        if (this._currentskilllevel === this._defaultLevel)
            mybutton.addClass("disabled");
        SetToolTipDown(mybutton);
        skillInfoPanel.append(mybutton.click(function () {
            window.SkillCore.GetSkill($(this).attr("insight")).SkillDown();
            $(this).trigger("mouseover");
        }));
        skillInfoPanel.append($("<p insight=\"skilllevel\">").addClass("skillLevel").text(this._currentskilllevel + "/" + this._skillmaxlevel));
        //skillInfoPanel.append($("<p>").addClass("skillName").text(this.GetName()));

        //Set Skill Extensions
        var exts = this.GetExtensions();
        if (exts !== undefined && Object.keys(exts).length > 0) {
            var extItem, foundExt = false,
                extIndex = 0;
            for (var sle in exts) {
                extIndex++;
                var extensionPanel = $('<div>').addClass("extension" + extIndex + "infopanel");
                extItem = window.SkillCore.GetSkill(sle);
                extItem.GetSkillPanel(true).appendTo(extensionPanel);
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
                //extItem.GetSkillPanel(true).children().addClass("disabled");
            }
            if (!foundExt && (this._currentskilllevel == this._skillmaxlevel))
                for (var sle in exts)
                    window.SkillCore.GetSkill(sle).Disabled(false);
        }
        this.Panel = skillInfoPanel;
    }
    return this.Panel;
}

SkillInfo.prototype.Disabled = function (bool) {
    if (bool) {
        this.UnlearnSkill();
        var hohoho = this.GetSkillPanel();
        if (!hohoho.hasClass("disabled"))
            hohoho.addClass("disabled");
        hohoho.find("button[skilldown]:not(.disabled)").addClass("disabled");
        hohoho.find("button[skillup]:not(.disabled)").addClass("disabled");
        hohoho.find("img:not(.disabled)").addClass("disabled");
    } else {
        var hohoho = this.GetSkillPanel();
        if (hohoho.hasClass("disabled"))
            hohoho.removeClass("disabled");
        hohoho.find("img.disabled").removeClass("disabled");
        hohoho.find("button.disabled[skilldown]").removeClass("disabled");
        hohoho.find("button.disabled[skillup]").removeClass("disabled");
    }
}

SkillInfo.prototype.UpdateSkill = function () {
    if (!this.Panel) return;
    var panel = this.Panel;
    panel.children("p[insight=\"skilllevel\"]:first").text(this._currentskilllevel + "/" + this._skillmaxlevel);
    panel.children("p[insight=\"skilllexevel\"]:first").text(this._currentskilllevel + "" + this._skillmaxlevel);
    if (this._currentskilllevel <= this._defaultLevel) {
        panel.children("button[skilldown]:first").addClass("disabled");
        var pa = this._parent;
        if (pa && !(pa.GetNextLevelInfo())) {
            var skillextensions = pa.GetExtensions();
            for (var ske in skillextensions)
                skillextensions[ske].Disabled(false);
        }
    } else if (this._currentskilllevel == this._skillmaxlevel) {
        panel.children("button[skillup]:first").addClass("disabled");
        var pa = this._parent;
        var skillextensions;
        if (pa) {
            var asdsss;
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
        panel.children("button.disabled[skilldown]:first").removeClass("disabled");
        panel.children("button.disabled[skillup]:first").removeClass("disabled");
        var pa = this._parent;
        var skillextensions;
        if (pa) {
            var asdsss;
            var skillextensions = pa.GetExtensions();
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
        if (next.RequiredLevel > (window.SkillCore.GetCurrentLevel())) {
            shownotify("Character level is not enough to learn further.", 'info');
            return;
        }
        var reqSP = next.RequiredSP;
        if ((window.SkillCore.GetSPLeft()) < reqSP) {
            shownotify("Insufficient skill point.", 'info');
            return;
        }
        this._currentskilllevel++;
        this._spused += reqSP;
        window.SkillCore.InvestedSPIncrease(reqSP);
        this.UpdateSkill();
    }
}

SkillInfo.prototype.SkillDown = function () {
    var prev = this.GetPreviousLevelInfo();
    if (prev) {
        if (this._defaultLevel === this._currentskilllevel) {
            shownotify("Can not go lower than skill's default level.", 'warning');
            return;
        }
        var reqSP = this.GetCurrentLevelInfo().RequiredSP;
        this._spused -= reqSP;
        window.SkillCore.InvestedSPDecrease(reqSP);
        this._currentskilllevel--;
        this.UpdateSkill();
    }
}

SkillInfo.prototype.SkillDownEx = function () {
    var prev = this.GetPreviousLevelInfo();
    if (prev) {
        window.SkillCore.InvestedSPDecrease(this.GetCurrentLevelInfo().RequiredSP);
        this._currentskilllevel--;
        this.UpdateSkill();
    }
}

SkillTreeCore.prototype.InvestedSPIncrease = function (sp) {
    this._investedsp += sp;
    this.UpdateSP();
}

SkillTreeCore.prototype.InvestedSPDecrease = function (sp) {
    this._investedsp -= sp;
    this.UpdateSP();
}
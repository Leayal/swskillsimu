SkillTreeCore.prototype.ReadTree = function() {
    this.SkillList = {};
    this.ActiveSkillList = {};
    this.PassiveSkillList = {};
    this.SkillCount = 0;
    this.loadedSkillCount = 0;
    $.ajax({
        cache: false,
        url: "skilltreeinfo.json",
        dataType: "json",
        success: function(json) {
            if (json.CharacterWikiURL)
                $("li#charName").append($("<a>").attr("href", json.CharacterWikiURL).attr("target", "_blank").text(json.CharacterName));
            else
                $("li#charName").text(json.CharacterName);
            window.document.title = "Skill Simulator - " + json.CharacterName;
            for (var ssk in json.Skills) {
                window.SkillCore.SkillList[ssk] = new SkillInfo(ssk, json.Skills[ssk]["Name"], json.Skills[ssk]);
                if (get = window.SkillCore.SkillList[ssk].IsPassive)
                    window.SkillCore.PassiveSkillList[ssk] = window.SkillCore.SkillList[ssk];
                else
                    window.SkillCore.ActiveSkillList[ssk] = window.SkillCore.SkillList[ssk]
            };
            window.SkillCore.SkillCount = Object.keys(window.SkillCore.SkillList).length;
            window.SkillCore.RenderTree();
        }
    });
}

SkillTreeCore.prototype.GetSkill = function(id) {
    return this.SkillList[id];
}

SkillTreeCore.prototype.RenderTree = function() {
    var eTree = $("li#activeskill");
    if (eTree) {
        var activeRow;
        eTree.empty();
        var activeCount = 0;
        for (var sl in this.ActiveSkillList) {
            if (get = this.ActiveSkillList[sl].Visible) {
                activeCount++;
                if (activeCount === 1) {
                    if (activeRow)
                        eTree.append(activeRow);
                    activeRow = $("<ul>").addClass("tablelike");
                }
                activeRow.append($("<li>").addClass("tablelike").append(this.ActiveSkillList[sl].GetSkillPanel()));
                if (activeCount >= 3) activeCount = 0;
            }
        }
        if (activeCount > 0)
            if (activeRow)
                eTree.append(activeRow);
    }
    eTree = $("li#passiveskill");
    if (eTree) {
        var passiveRow;
        eTree.empty();
        var passiveCount = 0;
        for (var sl in this.PassiveSkillList) {
            if (get = this.PassiveSkillList[sl].Visible) {
                passiveCount++;
                if (passiveCount === 1) {
                    if (passiveRow)
                        eTree.append(passiveRow);
                    passiveRow = $("<ul>").addClass("tablelike");
                }
                passiveRow.append($("<li>").addClass("tablelike").append(this.PassiveSkillList[sl].GetSkillPanel()));
                if (passiveCount >= 2) passiveCount = 0;
            }
        }
        if (passiveCount > 0)
            if (passiveRow)
                eTree.append(passiveRow);
    }
}

function imagesLoadedCallback(element) {
    window.SkillCore.loadedSkillCount++;
    if (window.SkillCore.SkillCount == window.SkillCore.loadedSkillCount) {
        //Finished Everything
        RemoveLoading($("body"));
        //title="That&apos;s what this widget is"
    }
    //LoadtheSharedLinkHere
    var currentskill = window.SkillCore.GetSkill(element.attr("insight"));
    currentskill.SetCurrentSkillLevel(GetUrlParam(element.attr("insight"), get = currentskill.GetDefaultLevel));
    SetToolTip(element);
}

SkillInfo.prototype.GetSkillPanel = function(ex) {
    if (this.Panel) return this.Panel;
    if (ex) {
        var skillInfoPanel = $("<div>").addClass("skillExinfopanel").addClass("fadeinAppear");
        skillInfoPanel.attr("insight", this._id);
        var img = $("<img>").addClass("skillExIcon").attr("insight", this._id).attr("src", get = this.IconURL);
        skillInfoPanel.append(img.imagesLoaded(function() {
            imagesLoadedCallback(img);
        }));
        SetToolTip(img);
        var mybutton = $("<button skillup type=\"button\" class=\"btn-success skillexup\" insight=\"" + this._id + "\">");
        if (this._currentskilllevel === this._skillmaxlevel)
            mybutton.addClass("disabled");
        SetToolTipUp(mybutton);
        skillInfoPanel.append(mybutton.click(function() {
            if (!$(this).hasClass("disabled")) {
                window.SkillCore.GetSkill($(this).attr("insight")).SkillUp();
                $(this).trigger("mouseover");
            }
        }));
        mybutton = $("<button skilldown type=\"button\" class=\"btn-danger skillexdown\" insight=\"" + this._id + "\">");
        if (this._currentskilllevel === 0)
            mybutton.addClass("disabled");
        SetToolTipDown(mybutton);
        skillInfoPanel.append(mybutton.click(function() {
            if (!$(this).hasClass("disabled")) {
                window.SkillCore.GetSkill($(this).attr("insight")).SkillDown();
                $(this).trigger("mouseover");
            }
        }));
        skillInfoPanel.append($("<p insight=\"skilllexevel\">").addClass("skillExLevel").text(this._currentskilllevel + "" + this._skillmaxlevel));
        var exts = get = this.Extensions;
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
        var img = $("<img>").addClass("skillIcon").attr("insight", this._id).attr("src", get = this.IconURL);
        skillInfoPanel.append(img.imagesLoaded(function() {
            imagesLoadedCallback(img);
        }));
        SetToolTip(img);
        var mybutton = $("<button skillup type=\"button\" class=\"btn btn-success skillup\" insight=\"" + this._id + "\">");
        if (this._currentskilllevel === this._skillmaxlevel)
            mybutton.addClass("disabled");
        SetToolTipUp(mybutton);
        skillInfoPanel.append(mybutton.click(function() {
            window.SkillCore.GetSkill($(this).attr("insight")).SkillUp();
            $(this).trigger("mouseover");
        }));
        mybutton = $("<button skilldown type=\"button\" class=\"btn btn-danger skilldown\" insight=\"" + this._id + "\">");
        if (this._currentskilllevel === 0)
            mybutton.addClass("disabled");
        SetToolTipDown(mybutton);
        skillInfoPanel.append(mybutton.click(function() {
            window.SkillCore.GetSkill($(this).attr("insight")).SkillDown();
            $(this).trigger("mouseover");
        }));
        skillInfoPanel.append($("<p insight=\"skilllevel\">").addClass("skillLevel").text(this._currentskilllevel + "/" + this._skillmaxlevel));
        //skillInfoPanel.append($("<p>").addClass("skillName").text(get = this.Name));

        //Set Skill Extensions
        var exts = get = this.Extensions;
        if (exts !== undefined && Object.keys(exts).length > 0) {
            var extItem;
            for (var sle in exts) {
                extItem = window.SkillCore.GetSkill(sle);
                extItem.GetSkillPanel(true).addClass("disabled").appendTo(skillInfoPanel);
                extItem.GetSkillPanel(true).children().addClass("disabled");
            }
        }
        this.Panel = skillInfoPanel;
    }
    return this.Panel;
}

SkillInfo.prototype.Disabled = function(bool) {
    if (bool) {
        this.UnlearnSkill();
        var hohoho = this.GetSkillPanel();
        if (!hohoho.hasClass("disabled"))
            hohoho.addClass("disabled");
        hohoho.children("button[skilldown]:not(.disabled)").addClass("disabled");
        hohoho.children("button[skillup]:not(.disabled)").addClass("disabled");
        hohoho.children("img:not(.disabled)").addClass("disabled");
    } else {
        var hohoho = this.GetSkillPanel();
        if (hohoho.hasClass("disabled"))
            hohoho.removeClass("disabled");
        hohoho.children("img.disabled").removeClass("disabled");
        hohoho.children("button.disabled[skilldown]").removeClass("disabled");
        hohoho.children("button.disabled[skillup]").removeClass("disabled");
    }
}

SkillInfo.prototype.UpdateSkill = function() {
    if (!this.Panel) return;
    var panel = this.Panel;
    panel.children("p[insight=\"skilllevel\"]:first").text(this._currentskilllevel + "/" + this._skillmaxlevel);
    panel.children("p[insight=\"skilllexevel\"]:first").text(this._currentskilllevel + "" + this._skillmaxlevel);
    if (this._currentskilllevel == 0) {
        panel.children("button[skilldown]:first").addClass("disabled");
        var pa = this._parent;
        if (pa && !(pa.NextLevelInfo()))
            for (var ske in pa.Extensions)
                pa.Extensions[ske].Disabled(false);
    } else if (this._currentskilllevel == this._skillmaxlevel) {
        panel.children("button[skillup]:first").addClass("disabled");
        var pa = this._parent;
        if (pa) {
            var asdsss;
            for (var ske in pa.Extensions) {
                asdsss = pa.Extensions[ske];
                if ((get = asdsss.ID) !== this._id)
                    asdsss.Disabled(true);
            }
        }
        for (var ske in this.Extensions)
            this.Extensions[ske].Disabled(false);
    } else {
        panel.children("button.disabled[skilldown]:first").removeClass("disabled");
        panel.children("button.disabled[skillup]:first").removeClass("disabled");
        var pa = this._parent;
        if (pa) {
            var asdsss;
            for (var ske in pa.Extensions) {
                asdsss = pa.Extensions[ske];
                if ((get = asdsss.ID) !== this._id)
                    asdsss.Disabled(true);
            }
        }
        for (var ske in this.Extensions)
            this.Extensions[ske].Disabled(true);
    }
}

SkillInfo.prototype.SkillUp = function() {
    var next = this.NextLevelInfo();
    if (next) {
        if ((get = next.RequiredLevel) > (get = window.SkillCore.CurrentLevel)) return;
        var reqSP = get = next.RequiredSP;
        if ((get = window.SkillCore.SPLeft) < reqSP) return;
        this._currentskilllevel++;
        this.UpdateSkill();
        window.SkillCore.InvestedSPIncrease(reqSP);
    }
}

SkillInfo.prototype.SkillDown = function() {
    var prev = this.PreviousLevelInfo();
    if (prev) {
        window.SkillCore.InvestedSPDecrease(get = this.CurrentLevelInfo().RequiredSP);
        this._currentskilllevel--;
        this.UpdateSkill();
    }
}

SkillTreeCore.prototype.InvestedSPIncrease = function(sp) {
    this._investedsp += sp;
    this.UpdateSP();
}

SkillTreeCore.prototype.InvestedSPDecrease = function(sp) {
    this._investedsp -= sp;
    this.UpdateSP();
}
SkillTreeCore.prototype.ReadTree = function() {
    this.SkillList = {};
    this.ActiveSkillList = {};
    this.PassiveSkillList = {};
    $.getJSON("skilltreeinfo.json", function(json) {
        $("td#charName").text(json.CharacterName);
        for (var ssk in json.Skills) {
            window.SkillCore.SkillList[ssk] = new SkillInfo(ssk, json.Skills[ssk]["Name"], json.Skills[ssk]);
            if (get = window.SkillCore.SkillList[ssk].IsPassive)
                window.SkillCore.PassiveSkillList[ssk] = window.SkillCore.SkillList[ssk];
            else
                window.SkillCore.ActiveSkillList[ssk] = window.SkillCore.SkillList[ssk]
        }
        window.SkillCore.RenderTree();
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

SkillInfo.prototype.GetSkillPanel = function(ex) {
    if (this.Panel) return this.Panel;
    if (ex) {
        var skillInfoPanel = $("<div>").addClass("skillExinfopanel");
        skillInfoPanel.append($("<img>").addClass("skillExIcon").attr("src", get = this.IconURL));
        skillInfoPanel.append($("<button skillup type=\"button\" class=\"btn-success skillexup\" target=\"" + this._id + "\"></button>").click(function() {
            if (!$(this).hasClass("disabled"))
                window.SkillCore.GetSkill($(this).attr("target")).SkillUp();
        }));
        skillInfoPanel.append($("<button skilldown type=\"button\" class=\"btn-danger skillexdown disabled\" target=\"" + this._id + "\"></button>").click(function() {
            if (!$(this).hasClass("disabled"))
                window.SkillCore.GetSkill($(this).attr("target")).SkillDown();
        }));
        skillInfoPanel.append($("<p insight=\"skilllevel\">").addClass("skillExLevel").text(this._currentskilllevel + "/" + this._skillmaxlevel));

        //Set Skill Extensions
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
        var skillInfoPanel = $("<div>").addClass("skillinfopanel");
        skillInfoPanel.append($("<img>").addClass("skillIcon").attr("src", get = this.IconURL));
        skillInfoPanel.append($("<button skillup type=\"button\" class=\"btn btn-success skillup\" target=\"" + this._id + "\"></button>").click(function() {
            window.SkillCore.GetSkill($(this).attr("target")).SkillUp();
        }));
        skillInfoPanel.append($("<button skilldown type=\"button\" class=\"btn btn-danger skilldown disabled\" target=\"" + this._id + "\"></button>").click(function() {
            window.SkillCore.GetSkill($(this).attr("target")).SkillDown();
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
                /*var skillExInfoPanel = $("<div>").addClass("skillExinfopanel").addClass("disabled");
                skillExInfoPanel.append($("<img>").addClass("skillExIcon").attr("src", get = extItem.IconURL));
                skillExInfoPanel.appendTo(skillInfoPanel);//*/
            }
        }
        this.Panel = skillInfoPanel;
    }
    return this.Panel;
}

SkillInfo.prototype.Disabled = function(bool) {
    if (bool) {
        var hohoho = this.GetSkillPanel();
        if (!hohoho.hasClass("disabled"))
            hohoho.addClass("disabled");
        hohoho.find($("button[skilldown]:not(.disabled)")).addClass("disabled");
        hohoho.find($("button[skillup]:not(.disabled)")).addClass("disabled");
        hohoho.find($("img:not(.disabled)")).addClass("disabled");
        this.UnlearnSkill();
    } else {
        var hohoho = this.GetSkillPanel();
        if (hohoho.hasClass("disabled"))
            hohoho.removeClass("disabled");
        hohoho.find($("img.disabled")).removeClass("disabled");
        hohoho.find($("button.disabled[skilldown]")).removeClass("disabled");
        hohoho.find($("button.disabled[skillup]")).removeClass("disabled");
    }
}

SkillInfo.prototype.UpdateSkill = function() {
    var panel = this.GetSkillPanel();
    panel.children("p[insight=\"skilllevel\"]").text(this._currentskilllevel + "/" + this._skillmaxlevel);
    if (this._currentskilllevel == 0) {
        panel.find($("button[skilldown]")[0]).addClass("disabled");
    } else if (this._currentskilllevel == this._skillmaxlevel) {
        panel.find($("button[skillup]")[0]).addClass("disabled");
        for (var ske in this.Extensions) {
            this.Extensions[ske].Disabled(false);
        }
    } else {
        panel.find($("button.disabled[skilldown]")).removeClass("disabled");
        panel.find($("button.disabled[skillup]")).removeClass("disabled");
        for (var ske in this.Extensions) {
            this.Extensions[ske].Disabled(true);
        }
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
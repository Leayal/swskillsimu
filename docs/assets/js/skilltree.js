function SkillTreeCore() {
    this._totalsp = 0;
    this._currentlevel = 0;
    this._investedsp = 0;
    this._spleft = 0;
    this._selectedclassindex = 0;
    this._selectedclass = null;
    this.slotassign = new SlotGrid(this);

    let maxValue = ClassIndex.Base;
    for (var className in ClassIndex) {
        if (ClassIndex[className] > maxValue) {
            maxValue = ClassIndex[className];
        }
    }

    this.AvailableClassIndex = maxValue;
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

SkillTreeCore.prototype.GetAvailableClassIndex = function () {
    return this.AvailableClassIndex;
}

SkillTreeCore.prototype.SetLevel = function (_level) {
    if (isNaN(_level)) {
        return;
    }
    let classData = this.GetSelectedClass(),
        classReqLevel = classData.RequiredLevel || 0;
    if (_level >= classReqLevel) {
        this.setlevelcore(_level);
        return true;
    } else {
        shownotify("The class you selected requires the character to be at level " + classReqLevel, 'info');
    }
    return false;
}

SkillTreeCore.prototype.setlevelcore = function (_level) {
    this._currentlevel = Math.min(_level, window.appdata.maxCharacterLevel);
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
    this._spleft = this._totalsp - this._investedsp;
    $("#e_remainingSP").text("Remaining SP: " + this._spleft + "/" + this._totalsp);
    if (this.CheckAllSkills()) {
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
            skinfo = sk.GetCurrentLevelInfo();
            if (skinfo.RequiredLevel > this._currentlevel)
                sk.UnlearnSkill();
        }
    }
    return true;
}

SkillTreeCore.prototype.inner_gettotalsp = function (_level) {
    var tsp = 0;
    for (var i = 1; i <= _level; i++) {
        tsp += this.inner_gettotalspex(i);
    }
    return tsp;
}

SkillTreeCore.prototype.inner_gettotalspex = function (a) {
    switch (a) {
        case 0:
        case 1:
        case 2:
        case 3:
            return 0;
        case 4:
        case 6:
        case 7:
        case 8:
        case 9:
        case 61:
        case 62:
        case 63:
        case 64:
            return 1;
        case 5:
        case 65:
            return 3;
        case 10:
        case 15:
        case 25:
        case 30:
        case 35:
        case 45:
        case 50:
        case 55:
        case 60:
            return 5;
        case 20:
        case 40:
            return 10;
        default:
            return 2;
    }
};

SkillTreeCore.prototype.GenerateLink = function (showSkillAssignment) {
    var arrayString = [];
    if (this._currentlevel !== window.appdata.maxCharacterLevel)
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

    var selectedclassindex = this.GetSelectedClassIndex();
    if (selectedclassindex !== this.GetAvailableClassIndex())
        arrayString.push("c=" + selectedclassindex);

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

SkillTreeCore.prototype.SetSelectedClass = function (classIndex) {
    let result = this.IsSelectiveClass(classIndex);
    if (result)
        this.setclasscore(classIndex);
    return result;
}

SkillTreeCore.prototype.IsSelectiveClass = function (classIndex) {
    if (classIndex === 0) return true;
    if (classIndex > this.AvailableClassIndex) return false;
    if (this._jsondata.hasOwnProperty("AvailableClass")) {
        if (this._jsondata.AvailableClass.hasOwnProperty(classIndex)) {
            let classReqLevel = this._jsondata.AvailableClass[classIndex].RequiredLevel;
            if (!classReqLevel) {
                return true;
            }
            if (this._currentlevel >= classReqLevel) {
                return true;
            }
        }
    }
    return false;
}

SkillTreeCore.prototype.setclasscore = function (classIndex) {
    this._selectedclassindex = classIndex;
    this._selectedclass = this._jsondata.AvailableClass[classIndex];
}

SkillTreeCore.prototype.SetCharacterInfo = function (_level, classIndex) {
    if (isNaN(_level) || isNaN(classIndex)) return;
    if (classIndex > this.AvailableClassIndex) return false;
    if (this._jsondata.hasOwnProperty("AvailableClass")) {
        if (this._jsondata.AvailableClass.hasOwnProperty(classIndex)) {
            let classData = this._jsondata.AvailableClass[classIndex],
                classReqLevel = classData.RequiredLevel;
            if (!classReqLevel) classReqLevel = 0;
            if (_level >= classReqLevel) {
                this.setclasscore(classIndex);
                this.setlevelcore(_level);
                return true;
            } else {
                shownotify("The class you selected requires the character to be at least at level " + classReqLevel, 'info');
            }
        }
    }
    return false;
}

SkillTreeCore.prototype.GetClass = function (classIndex) {
    if (isNaN(classIndex)) return null;

    return this._jsondata.AvailableClass[classIndex];
}

SkillTreeCore.prototype.GetClasses = function () {
    return this._jsondata.AvailableClass;
}

SkillTreeCore.prototype.GetSelectedClassIndex = function () {
    return this._selectedclassindex;
}

SkillTreeCore.prototype.GetSelectedClass = function () {
    return this._selectedclass;
}

SkillTreeCore.prototype.SetJSON = function (jsonData) {
    this._jsondata = jsonData;
}

SkillTreeCore.prototype.GetJSON = function () {
    return this._jsondata;
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

SkillTreeCore.prototype.ReadTree = function (loadingCallback, loadedCallback) {
    this.SkillList = {};
    this.ActiveSkillList = {};
    this.PassiveSkillList = {};
    this.SkillCount = 0;
    this.loadedSkillCount = 0;

    let myself = this;
    $.ajax({
        cache: false,
        url: "skilltreeinfo.json",
        dataType: "json",
        success: function (json) {
            myself.SetJSON(json);
            if (json.MaxLevel && !isNaN(json.MaxLevel)) {
                Object.defineProperty(myself, "maxCharacterLevel", {
                    value: json.MaxLevel,
                    writable: false,
                    configurable: false
                });
            } else {
                Object.defineProperty(myself, "maxCharacterLevel", {
                    value: window.appdata.maxCharacterLevel,
                    writable: false,
                    configurable: false
                });
            }
            //Get the highest class index
            if (json.hasOwnProperty("AvailableClass")) {
                let highestClassIndex = 0;
                for (let classindex in json.AvailableClass) {
                    if (json.AvailableClass.hasOwnProperty(classindex) && (classindex > highestClassIndex))
                        highestClassIndex = classindex;
                }
                myself.AvailableClassIndex = highestClassIndex;
            }
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
            for (let ssk in json.Skills)
                if (json.Skills.hasOwnProperty(ssk)) {
                    myself.SkillList[ssk] = new SkillInfo(myself, ssk, json.Skills[ssk]["Name"], json.Skills[ssk]);
                    if (myself.SkillList[ssk].IsPassive())
                        myself.PassiveSkillList[ssk] = myself.SkillList[ssk];
                    else
                        myself.ActiveSkillList[ssk] = myself.SkillList[ssk];
                };
            myself.SkillCount = Object.keys(myself.SkillList).length;
            if (typeof (loadingCallback) === "function")
                loadingCallback.call(myself, json);
            if (typeof (loadedCallback) === "function")
                loadedCallback.call(myself, true, null, null);
            //myself.RenderTree(loadedCallback);
        },
        error: function (xhr, textStatus, errorThrown) {
            if (typeof (loadedCallback) === "function")
                loadedCallback(false, textStatus, errorThrown);
        }
    });
}

SkillTreeCore.prototype.RenderTree = function (loadedCallback, forceCreate) {
    var eTree = $("li#activeskill");
    if (eTree) {
        var activeRow = $("<ul>").addClass("tableactiveskill");
        eTree.empty();
        var activeCount = 0;
        for (var sl in this.ActiveSkillList) {
            if (this.ActiveSkillList.hasOwnProperty(sl)) {
                if (this.ActiveSkillList[sl].IsVisible() && this.ActiveSkillList[sl].IsClassAvailable(this._selectedclassindex)) {
                    var spanvalue = this.ActiveSkillList[sl].GetRowSpan(this._selectedclassindex);
                    if (spanvalue > 1) {
                        activeCount += spanvalue;
                    } else
                        activeCount++;
                    activeRow.append($("<li>").addClass("tablelike").append(this.ActiveSkillList[sl].GetSkillPanel(false, forceCreate)));
                    if (activeCount >= 3) {
                        if (activeRow)
                            eTree.append(activeRow);
                        activeRow = $("<ul>").addClass("tableactiveskill");
                        activeCount = 0;
                    }
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
            if (this.PassiveSkillList.hasOwnProperty(sl)) {
                if (this.PassiveSkillList[sl].IsVisible() && this.PassiveSkillList[sl].IsClassAvailable(this._selectedclassindex)) {
                    var spanvalue = this.PassiveSkillList[sl].GetRowSpan(this._selectedclassindex);
                    if (spanvalue > 1) {
                        passiveCount += spanvalue;
                    } else
                        passiveCount++;
                    passiveRow.append($("<li>").addClass("tablelike").addClass("passiveskilltree").append(this.PassiveSkillList[sl].GetSkillPanel(false, forceCreate)));
                    if (passiveCount >= 2) {
                        if (passiveRow)
                            eTree.append(passiveRow);
                        passiveRow = $("<ul>").addClass("tablepassiveskill");
                        passiveCount = 0;
                    }
                }
            }
        }
        if (passiveCount > 0)
            if (passiveRow)
                eTree.append(passiveRow);
    }

    if (typeof loadedCallback === "function") {
        $("#skilltree").imagesLoaded().always(function () {
            loadedCallback(true);
        });
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
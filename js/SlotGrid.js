function ShowSkillSelection(showRemove, okCallback, cancelCallback) {
    if (!window.SkillCore) return;
    var buttonslist = [{
        label: 'Select',
        cssClass: 'btn btn-success',
        action: function (dialogItself) {
            dialogItself.close();
            if (typeof okCallback === "function")
                okCallback(dialogItself.getData("selectedskillid"));
        }
    }];
    if (showRemove) {
        buttonslist.push({
            label: 'Remove',
            cssClass: 'btn btn-danger',
            action: function (dialogItself) {
                dialogItself.close();
                if (typeof okCallback === "function")
                    okCallback(null);
            }
        });
    }
    buttonslist.push({
        label: 'Cancel',
        cssClass: 'btn btn-default',
        action: function (dialogItself) {
            dialogItself.close();
            if (typeof noCallback === "function")
                noCallback();
        }
    });
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_INFO,
        title: "Select skill to assign",
        draggable: true,
        message: function (dialogItself) {
            var myul = $("<ul>").addClass(["liststyle-none", "width-max-fit"]);
            for (var ssk in window.SkillCore.ActiveSkillList)
                if (window.SkillCore.ActiveSkillList.hasOwnProperty(ssk) && (get = window.SkillCore.ActiveSkillList[ssk].Visible) && (get = window.SkillCore.ActiveSkillList[ssk].IsAssignable) && ((get = window.SkillCore.ActiveSkillList[ssk].CurrentSkillLevel) > 0)) {
                    // window.SkillCore.ActiveSkillList[ssk]
                    myul.append(
                        $("<li>").append(
                            $("<button>").attr("type", "button").addClass(["btn", "btn-primary", "btn-xs"]).append(
                                $("<ul>").addClass(["clickthrough", "list-inline", "ul-flexible", "text-noselect"]).append([
                                    $("<li>").addClass("image").append($("<img>").attr("src", get = window.SkillCore.ActiveSkillList[ssk].IconURL)),
                                    $("<li>").addClass("name").text(get = window.SkillCore.ActiveSkillList[ssk].Name),
                                    $("<li>").addClass("level").text("Lv: " + (get = window.SkillCore.ActiveSkillList[ssk].CurrentSkillLevel) + "/" + (get = window.SkillCore.ActiveSkillList[ssk].MaxLevel))
                                ])
                            )
                        ).click(function (e) {
                            e.preventDefault();
                            myul.find("button.active").removeClass(["btn-success", "active"]).addClass("btn-primary");
                            $(this).find("button").removeClass("btn-primary").addClass(["active", "btn-success"]);
                            dialogItself.setData("selectedskillid", $(this).attr("skillid"));
                        }).dblclick(function (e) {
                            e.preventDefault();
                            dialogItself.close();
                            if (typeof okCallback === "function")
                                okCallback($(this).attr("skillid"));
                        }).attr("skillid", ssk)
                    );
                };
            return $("<div>").addClass(["skill-list-select", "text-black"]).append(myul);
        },
        buttons: buttonslist
    });
}

class GridInfo {
    constructor() {
        this.IsEmpty = true;
        this.SkillInfo = null;
        this.myDiv = null;
    }

    Redraw() {
        if (!this.myDiv) return;
        this.myDiv.empty();
        if (!this.IsEmpty) {
            this.myDiv.append($("<img>").addClass("clickthrough").attr("src", (get = this.SkillInfo.IconURL)));
            this.myDiv.attr("title", "Skill: " + (get = this.SkillInfo.Name) + "\nClick the box to select skill");
        } else {
            this.myDiv.append($("<img>").addClass("clickthrough").attr("src", "../skillicons/skillslot_empty_null.png"));
            this.myDiv.attr("title", "Click the box to select skill");
        }
    }

    SetSkill(skillinfo) {
        if (skillinfo) {
            this.IsEmpty = false;
            this.SkillInfo = skillinfo;
        }
        else {
            this.IsEmpty = true;
            this.SkillInfo = null;
        }
        this.Redraw();
    }

    UnsetSkill() {
        this.SetSkill(null);
    }

    GetRender() {
        var thegridinfo = this;
        this.myDiv = $("<div>").addClass("slotskillimg").click(function (e) {
            e.preventDefault();
            ShowSkillSelection(!thegridinfo.IsEmpty, function (skillid) {
                if (skillid) {
                    thegridinfo.SetSkill(window.SkillCore.SkillList[skillid]);
                } else {
                    thegridinfo.UnsetSkill();
                }
            });
        });
        if (!this.IsEmpty) {
            this.myDiv.append($("<img>").addClass("clickthrough").attr("src", (get = this.SkillInfo.IconURL)));
            this.myDiv.attr("title", "Skill: " + (get = this.SkillInfo.Name) + "\nClick the box to select skill");
        } else {
            this.myDiv.append($("<img>").addClass("clickthrough").attr("src", "../skillicons/skillslot_empty_null.png"))
            this.myDiv.attr("title", "Click the box to select skill");
        }
        return this.myDiv;
    }
}
class SlotGrid {
    constructor() {
        this.effect2nd = "2_1";
        this.effect3rd = "3_1";
        this.Column = [];
        this.Column[0] = this.initRow();
        this.Column[1] = this.initRow();
        this.Column[2] = this.initRow();
        this.Column[3] = this.initRow();
        this.Column[4] = this.initRow();
        this.Column[5] = this.initRow();
    }

    getoption(id, effect) {
        return $("<option>").val(id).text(effect);
    }

    initRow() {
        var result = [];
        result[0] = new GridInfo();
        result[1] = new GridInfo();
        result[2] = new GridInfo();
        return result;
    }

    IsEmptyColumn(index) {
        for (var rowI = 0; rowI < this.Column[index].length; rowI++)
            if (!this.GetGridValue(index, rowI).IsEmpty)
                return false;

        return true;
    }

    IsEmptyTree() {
        for (var columnI = 0; columnI < this.Column.length; columnI++)
            if (!this.IsEmptyColumn(columnI))
                return false;

        return true;
    }

    ResetToEmpty() {
        for (var rowcount = 0; rowcount < this.Column[0].length; rowcount++)
            for (var columncount = 0; columncount < this.Column.length; columncount++)
                this.Column[columncount][rowcount].UnsetSkill();
    }

    GetGridValue(columnIndex, rowIndex) {
        return this.Column[columnIndex][rowIndex];
    }

    SetGridValue(columnIndex, rowIndex, value) {
        this.Column[columnIndex][rowIndex].SetSkill(value);
    }

    UnsetGridValue(columnIndex, rowIndex) {
        this.Column[columnIndex][rowIndex].UnsetSkill();
    }

    printfloor(floorData) {
        var output = [];
        for (var i = 0; i < floorData.length; i++)
            output.push($("<li>").append(floorData[i]));
        return output;
    }

    generatefloor() {
        var floor = [];
        for (var rowcount = 0; rowcount < this.Column[0].length; rowcount++) {
            floor[rowcount] = [];
            for (var columncount = 0; columncount < this.Column.length; columncount++)
                floor[rowcount].push(this.Column[columncount][rowcount].GetRender());
        }
        return floor;
    }

    GetRender() {
        var floor = this.generatefloor();
        var myself = this;
        return $("<div>").addClass("text-black").append(
            $("<ul>").addClass("liststyle-none").append([
                $("<li>").append(
                    $("<ul>").addClass(["liststyle-none", "list-inline"]).append(this.printfloor(floor[0]))
                ),
                $("<li>").append($("<span>").addClass(["glyphicon", "glyphicon-arrow-up"])),
                $("<li>").append(
                    $("<span>").text("Step-3 Bonus: "),
                    $("<select>").attr("id", "select3rdchaineffect").append(
                        [this.getoption("3_1", "Damage +8%"), this.getoption("3_2", "Cooldown -15%"), this.getoption("3_3", "SG cost -25%")]
                    ).val(myself.effect3rd).change(function () {
                        myself.effect3rd = $(this).val();
                    })
                ),
                $("<li>").append($("<span>").addClass(["glyphicon", "glyphicon-arrow-up"])),
                $("<li>").append(
                    $("<ul>").addClass(["liststyle-none", "list-inline"]).append(this.printfloor(floor[1]))
                ),
                $("<li>").append($("<span>").addClass(["glyphicon", "glyphicon-arrow-up"])),
                $("<li>").append(
                    $("<span>").text("Step-2 Bonus: "),
                    $("<select>").attr("id", "select2ndchaineffect").append(
                        [this.getoption("2_1", "Damage +4%"), this.getoption("2_2", "Cooldown -8%"), this.getoption("2_3", "SG cost -12%")]
                    ).val(myself.effect2nd).change(function () {
                        myself.effect2nd = $(this).val();
                    })
                ),
                $("<li>").append($("<span>").addClass(["glyphicon", "glyphicon-arrow-up"])),
                $("<li>").append(
                    $("<ul>").addClass(["liststyle-none", "list-inline"]).append(this.printfloor(floor[2]))
                ),
                $("<li>").append($("<span>").text("(Click the boxes to assign skill)")),
            ])
        );
    }

    ReadAssignment() {
        var currentsplit = null,
            assignCount = 0;
        var assignmentvalue = GetUrlParam("s", null);
        if (assignmentvalue) {
            assignmentvalue = assignmentvalue.split("_");
            for (assignCount = 0; assignCount < assignmentvalue.length; assignCount++) {
                currentsplit = assignmentvalue[assignCount].split("-");
                var skillinfo = window.SkillCore.GetSkillByShortID(currentsplit[2]);
                if (!skillinfo) {
                    skillinfo = window.SkillCore.GetSkill(currentsplit[2]);
                }
                if (skillinfo && !(get = skillinfo.IsPassive) && (get = skillinfo.Visible) && ((get = skillinfo.IsAssignable) === true) && ((get = skillinfo.CurrentSkillLevel) > 0)) {
                    this.Column[currentsplit[0]][currentsplit[1]].SetSkill(skillinfo);
                }
            }
        }

        var assignmentbuff1value = GetUrlParam("b1", null),
            assignmentbuff2value = GetUrlParam("b2", null);
        if (assignmentbuff1value) {
            this.effect2nd = assignmentbuff1value;
        }
        if (assignmentbuff2value) {
            this.effect3rd = assignmentbuff2value;
        }
    }

    GenerateAssignment() {
        if (this.IsEmptyTree()) return null;
        var arrayString = [];

        for (var rowcount = 0; rowcount < this.Column[0].length; rowcount++)
            for (var columncount = 0; columncount < this.Column.length; columncount++)
                if (!this.Column[columncount][rowcount].IsEmpty)
                    if (this.Column[columncount][rowcount].SkillInfo.ShortID) {
                        arrayString.push(columncount + "-" + rowcount + "-" + this.Column[columncount][rowcount].SkillInfo.ShortID);
                    } else {
                        arrayString.push(columncount + "-" + rowcount + "-" + (get = this.Column[columncount][rowcount].SkillInfo.ID));
                    }

        return arrayString.join("_");
    }
}

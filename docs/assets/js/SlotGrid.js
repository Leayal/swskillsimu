function ShowSkillSelection(_skilltreeCore, showRemove, okCallback, cancelCallback) {
    if (!_skilltreeCore) return;
    var buttonslist = [{
        label: 'Select',
        cssClass: 'btn btn-success',
        action: function (dialogItself) {
            dialogItself.Hide();
            if (typeof okCallback === "function")
                okCallback(dialogItself.GetData("selectedskillid"));
        }
    }];
    if (showRemove) {
        buttonslist.push({
            label: 'Remove',
            cssClass: 'btn btn-danger',
            action: function (dialogItself) {
                dialogItself.Hide();
                if (typeof okCallback === "function")
                    okCallback(null);
            }
        });
    }
    buttonslist.push({
        label: 'Cancel',
        cssClass: 'btn btn-default',
        action: function (dialogItself) {
            dialogItself.Hide();
            if (typeof noCallback === "function")
                noCallback();
        }
    });

    var dialog = new Bootstrap4ModalDialog($("#dialogs"), function (dialogItself) {
        var skilllistUl = $("<div>").addClass("container");
        for (var ssk in _skilltreeCore.ActiveSkillList)
            if (_skilltreeCore.ActiveSkillList.hasOwnProperty(ssk) && (_skilltreeCore.ActiveSkillList[ssk].IsVisible()) && (_skilltreeCore.ActiveSkillList[ssk].IsAssignable()) && ((_skilltreeCore.ActiveSkillList[ssk].GetCurrentSkillLevel()) > 0)) {
                // _skilltreeCore.ActiveSkillList[ssk]
                skilllistUl.append(
                    $("<div>").addClass("row").append(
                        $("<div>").addClass("col").append(
                            $("<button>").attr("type", "button").addClass("btn btn-primary btn-block").append(
                                $("<div>").addClass(["clickthrough", "row", "text-noselect"]).append([
                                    $("<div>").addClass("col-md-auto").append($("<img>").attr("src", _skilltreeCore.ActiveSkillList[ssk].GetIconURL())),
                                    $("<div>").addClass("col").text(_skilltreeCore.ActiveSkillList[ssk].GetName()),
                                    $("<div>").addClass("col col-lg-2").text("Lv: " + (_skilltreeCore.ActiveSkillList[ssk].GetCurrentSkillLevel()) + "/" + (_skilltreeCore.ActiveSkillList[ssk].GetMaxLevel()))
                                ])
                            )
                        )
                    ).click(function (e) {
                        e.stopPropagation();
                        skilllistUl.find("button.active").removeClass(["btn-success", "active"]).addClass("btn-primary");
                        $(this).find("button").removeClass("btn-primary").addClass("active btn-success");
                        dialogItself.SetData("selectedskillid", $(this).attr("skillid"));
                    }).dblclick(function (e) {
                        e.stopPropagation();
                        dialogItself.Hide();
                        if (typeof okCallback === "function")
                            okCallback($(this).attr("skillid"));
                    }).attr("skillid", ssk)
                );
            };
        return $("<div>").addClass("skill-list-select").append(skilllistUl);
    }, "Select skill to assign", buttonslist);
    dialog.Show();
}

function GridInfo(_skilltreeCore) {
    Object.defineProperty(this, "SkillCore", {
        value: _skilltreeCore,
        configurable: false,
        writable: false
    });
    this.IsEmpty = true;
    this.SkillInfo = null;
    this.myDiv = null;
}

GridInfo.prototype.Redraw = function () {
    if (!this.myDiv) return;
    this.myDiv.empty();
    if (!this.IsEmpty) {
        this.myDiv.append($("<img>").addClass("clickthrough").attr("src", (this.SkillInfo.GetIconURL())));
        this.myDiv.attr("title", "Skill: " + (this.SkillInfo.GetName()) + "\nClick the box to select skill");
    } else {
        this.myDiv.append($("<img>").addClass("clickthrough").attr("src", "../skillicons/skillslot_empty_null.png"));
        this.myDiv.attr("title", "Click the box to select skill");
    }
}

GridInfo.prototype.resetinfo = function () {
    this.IsEmpty = true;
    this.SkillInfo = null;
}

GridInfo.prototype.SetSkill = function (skillinfo) {
    if (skillinfo) {
        this.IsEmpty = false;
        this.SkillInfo = skillinfo;
    } else {
        this.resetinfo();
    }
    this.Redraw();
}

GridInfo.prototype.UnsetSkill = function () {
    this.SetSkill(null);
}

GridInfo.prototype.GetRender = function () {
    var thegridinfo = this;
    let theskillCore = this.SkillCore;
    this.myDiv = $("<div>").addClass("slotskillimg").click(function (e) {
        e.preventDefault();
        ShowSkillSelection(theskillCore, !thegridinfo.IsEmpty, function (skillid) {
            if (skillid) {
                thegridinfo.SetSkill(theskillCore.SkillList[skillid]);
            } else {
                thegridinfo.UnsetSkill();
            }
        });
    });
    if (!this.IsEmpty)
        if ((this.SkillInfo.GetCurrentSkillLevel()) === 0) {
            this.resetinfo();
        }
    if (!this.IsEmpty) {
        this.myDiv.append($("<img>").addClass("clickthrough").attr("src", this.SkillInfo.GetIconURL()));
        this.myDiv.attr("title", "Skill: " + this.SkillInfo.GetName() + "\nClick the box to select skill");
    } else {
        this.myDiv.append($("<img>").addClass("clickthrough").attr("src", "../skillicons/skillslot_empty_null.png"))
        this.myDiv.attr("title", "Click the box to select skill");
    }
    return this.myDiv;
}

function SlotGrid(_skilltreeCore) {
    Object.defineProperty(this, "SkillCore", {
        value: _skilltreeCore,
        configurable: false,
        writable: false
    });
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

SlotGrid.prototype.getoption = function (id, effect) {
    return $("<option>").val(id).text(effect);
}

SlotGrid.prototype.initRow = function () {
    var result = [];
    result[0] = new GridInfo(this.SkillCore);
    result[1] = new GridInfo(this.SkillCore);
    result[2] = new GridInfo(this.SkillCore);
    return result;
}

SlotGrid.prototype.IsEmptyColumn = function (index) {
    for (var rowI = 0; rowI < this.Column[index].length; rowI++)
        if (!this.GetGridValue(index, rowI).IsEmpty)
            return false;

    return true;
}

SlotGrid.prototype.IsEmptyTree = function () {
    for (var columnI = 0; columnI < this.Column.length; columnI++)
        if (!this.IsEmptyColumn(columnI))
            return false;

    return true;
}

SlotGrid.prototype.ResetToEmpty = function () {
    for (var rowcount = 0; rowcount < this.Column[0].length; rowcount++)
        for (var columncount = 0; columncount < this.Column.length; columncount++)
            this.Column[columncount][rowcount].UnsetSkill();
}

SlotGrid.prototype.GetGridValue = function (columnIndex, rowIndex) {
    return this.Column[columnIndex][rowIndex];
}

SlotGrid.prototype.SetGridValue = function (columnIndex, rowIndex, value) {
    this.Column[columnIndex][rowIndex].SetSkill(value);
}

SlotGrid.prototype.UnsetGridValue = function (columnIndex, rowIndex) {
    this.Column[columnIndex][rowIndex].UnsetSkill();
}

SlotGrid.prototype.printfloor = function (floorData) {
    var output = [];
    for (var i = 0; i < floorData.length; i++)
        output.push($("<div>").addClass("col").append(floorData[i]));
    return output;
}

SlotGrid.prototype.generatefloor = function () {
    var floor = [];
    for (var rowcount = 0; rowcount < this.Column[0].length; rowcount++) {
        floor[rowcount] = [];
        for (var columncount = 0; columncount < this.Column.length; columncount++)
            floor[rowcount].push(this.Column[columncount][rowcount].GetRender());
    }
    return floor;
}

SlotGrid.prototype.GetRender = function () {
    var floor = this.generatefloor();
    var myself = this;
    return $("<div>").append(
        $("<ul>").addClass("liststyle-none").append([
            $("<li>").append(
                $("<div>").addClass("row").append(this.printfloor(floor[0]))
            ),
            $("<li>").append($("<i>").addClass("fas fa-arrow-up")),
            $("<li>").append(
                $("<span>").text("Step-3 Bonus: "),
                $("<select>").attr("id", "select3rdchaineffect").append(
                    [this.getoption("3_1", "Damage +8%"), this.getoption("3_2", "Cooldown -15%"), this.getoption("3_3", "SG cost -25%")]
                ).val(myself.effect3rd).change(function () {
                    myself.effect3rd = $(this).val();
                })
            ),
            //<i class="fas fa-arrow-up"></i>
            $("<li>").append($("<i>").addClass("fas fa-arrow-up")),
            $("<li>").append(
                $("<div>").addClass("row").append(this.printfloor(floor[1]))
                // $("<ul>").addClass(["liststyle-none", "list-inline"]).append(this.printfloor(floor[1]))
            ),
            $("<li>").append($("<i>").addClass("fas fa-arrow-up")),
            $("<li>").append(
                $("<span>").text("Step-2 Bonus: "),
                $("<select>").attr("id", "select2ndchaineffect").append(
                    [this.getoption("2_1", "Damage +4%"), this.getoption("2_2", "Cooldown -8%"), this.getoption("2_3", "SG cost -12%")]
                ).val(myself.effect2nd).change(function () {
                    myself.effect2nd = $(this).val();
                })
            ),
            $("<li>").append($("<i>").addClass("fas fa-arrow-up")),
            $("<li>").append(
                $("<div>").addClass("row").append(this.printfloor(floor[2]))
                // $("<ul>").addClass(["liststyle-none", "list-inline"]).append(this.printfloor(floor[2]))
            ),
            $("<li>").append($("<span>").text("(Click the boxes to assign skill)")),
        ])
    );
}

SlotGrid.prototype.ReadAssignment = function () {
    var currentsplit = null,
        assignCount = 0;
    var assignmentvalue = GetUrlParam("s", null);
    if (assignmentvalue) {
        assignmentvalue = assignmentvalue.split("_");
        for (assignCount = 0; assignCount < assignmentvalue.length; assignCount++) {
            currentsplit = assignmentvalue[assignCount].split("-");
            var skillinfo = this.SkillCore.GetSkillByShortID(currentsplit[2]);
            if (!skillinfo) {
                skillinfo = this.SkillCore.GetSkill(currentsplit[2]);
            }
            if (skillinfo && !(skillinfo.IsPassive()) && (skillinfo.IsVisible()) && ((skillinfo.IsAssignable()) === true) && ((skillinfo.GetCurrentSkillLevel()) > 0)) {
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

SlotGrid.prototype.GenerateAssignment = function () {
    if (this.IsEmptyTree()) return null;
    var arrayString = [];

    for (var rowcount = 0; rowcount < this.Column[0].length; rowcount++)
        for (var columncount = 0; columncount < this.Column.length; columncount++)
            if (!this.Column[columncount][rowcount].IsEmpty)
                if (this.Column[columncount][rowcount].SkillInfo.ShortID) {
                    arrayString.push(columncount + "-" + rowcount + "-" + this.Column[columncount][rowcount].SkillInfo.ShortID);
                } else {
                    arrayString.push(columncount + "-" + rowcount + "-" + (this.Column[columncount][rowcount].SkillInfo.GetID()));
                }

    return arrayString.join("_");
}
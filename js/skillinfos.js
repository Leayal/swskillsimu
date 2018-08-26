function SkillInfo(__id, skillName, infos) {
    this._rowspan = 1;
    this._defaultLevel = 0;
    this._id = __id;
    this._availablelevel = window.c_maxlevel + 1;
    this._currentskilllevel = 0;
    this._name = skillName;
    this._passive = false;
    this._parent = null;
    this._visible = true;
    this._spused = 0;
    this.Assignable = true;
    this.readInfos(infos);
}

SkillInfo.prototype.readInfos = function (ob) {
    this.Levels = [];
    var lastDescription = "";
    for (var skinfo in ob.Levels) {
        if (ob.Levels[skinfo].Description)
            lastDescription = ob.Levels[skinfo].Description;
        this.Levels.push(new LevelInfo(ob.Levels[skinfo].RequiredLevel,
            ob.Levels[skinfo].RequiredSP, ob.Levels[skinfo].Effect, lastDescription));
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
    if (ob.RowSpan > 0)
        this._rowspan = ob.RowSpan;
    this.SetCurrentSkillLevel(this._defaultLevel);
    if (this._availablelevel <= window.SkillCore.GetCurrentLevel()) {
        var paraminfo = GetUrlParam(this._id, null);
        if (!paraminfo && this.ShortID)
            paraminfo = GetUrlParam(this.ShortID, null);
        if (!paraminfo) paraminfo = this._defaultLevel;
        this.SetCurrentSkillLevel(paraminfo);
    } else
        this.SetCurrentSkillLevel(0);
}

SkillInfo.prototype.SetParent = function (obj) {
    this._parent = obj;
}

SkillInfo.prototype.GetParent = function () { return this._parent; }
SkillInfo.prototype.GetID = function () { return this._id; }
SkillInfo.prototype.GetName = function () { return this._name; }
SkillInfo.prototype.GetAvailableLevel = function () { return this._availablelevel; }
SkillInfo.prototype.GetSPUsed = function () { return this._spused; }
SkillInfo.prototype.GetCurrentSkillLevel = function () { return this._currentskilllevel; }
SkillInfo.prototype.GetMaxLevel = function () { return this._skillmaxlevel; }
SkillInfo.prototype.GetCurrentLevelInfo = function () { return this.Levels[this._currentskilllevel]; }
SkillInfo.prototype.GetIconURL = function () { return this._iconURL; }
SkillInfo.prototype.IsPassive = function () { return this._passive; }
SkillInfo.prototype.GetDefaultLevel = function () { return this._defaultLevel; }
SkillInfo.prototype.IsAssignable = function () { return this.Assignable; }
SkillInfo.prototype.GetRowSpan = function () { return this._rowspan; }
SkillInfo.prototype.GetNextLevelInfo = function () {
    return this.Levels[this._currentskilllevel + 1];
}
SkillInfo.prototype.GetPreviousLevelInfo = function () {
    return this.Levels[this._currentskilllevel - 1];
}
SkillInfo.prototype.GetExtensions = function () {
    if (!this._extensions) {
        this._extensions = {};
        var extName, exteItem;
        for (var extIndex in this._string_extensions) {
            extName = this._string_extensions[extIndex];
            exteItem = window.SkillCore.GetSkill(extName);
            exteItem.SetParent(this);
            this._extensions[extName] = exteItem;
        }
    }
    return this._extensions;
}
SkillInfo.prototype.IsVisible = function () { return this._visible; }

SkillInfo.prototype.UnlearnSkill = function () {
    if (this._availablelevel > window.SkillCore.GetCurrentLevel())
        this.SetCurrentSkillLevel(0);
    else
        this.ToDefaultLevel();
}

SkillInfo.prototype.ToDefaultLevel = function () {
    this.SetCurrentSkillLevel(Math.max(0, this._defaultLevel));
}

SkillInfo.prototype.SetCurrentSkillLevel = function (_level) {
    for (var count = 0; count <= this._skillmaxlevel; count++) {
        if (this._currentskilllevel > _level)
            this.SkillDownEx();
        if (this._currentskilllevel < _level)
            this.SkillUp();
        if (this._currentskilllevel == _level)
            break;
    }
}

function LevelInfo(__requiredlevel, __requiredsp, __effect, __description) {
    this.RequiredLevel = __requiredlevel;
    this.RequiredSP = __requiredsp;
    this.SkillDescription = __description;
    this.SkillEffect = __effect;
}

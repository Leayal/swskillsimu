class SkillInfo {
    constructor(__id, skillName, infos) {
        this._id = __id;
        this._availablelevel = window.c_maxlevel + 1;
        this._currentskilllevel = 0;
        this._name = skillName;
        this._passive = false;
        this._parent = null;
        this._visible = true;
        this.readInfos(infos);
    }

    SetParent(obj) {
        this._parent = obj;
    }

    get Parent() { return this._parent; }
    get ID() { return this._id; }
    get Name() { return this._name; }
    get AvailableLevel() { return this._availablelevel; }
    get CurrentSkillLevel() { return this._currentskilllevel; }
    get MaxLevel() { return this._skillmaxlevel; }
    CurrentLevelInfo() { return this.Levels[this._currentskilllevel - 1]; }
    get IconURL() { return this._iconURL; }
    get IsPassive() { return this._passive; }
    NextLevelInfo() {
        return this.Levels[this._currentskilllevel];
    }
    PreviousLevelInfo() {
        return this.Levels[this._currentskilllevel - 1];
    }
    get Extensions() {
        if (!this._extensions) {
            this._extensions = {};
            var extName, exteItem;
            for (var extIndex in this._string_extensions) {
                extName = this._string_extensions[extIndex];
                exteItem = window.SkillCore.GetSkill(extName);
                this._extensions[extName] = exteItem;
                exteItem.SetParent(this);
            }
        }
        return this._extensions;
    }
    get Visible() { return this._visible; }

    UnlearnSkill() {
        for (var ii = this._currentskilllevel; ii > 0; ii--)
            this.SkillDown();
    }

    readInfos(ob) {
        this.Levels = [];
        var lastDescription = "";
        for (var skinfo in ob.Levels) {
            if (ob.Levels[skinfo].Description)
                lastDescription = ob.Levels[skinfo].Description;
            this.Levels.push(new LevelInfo(ob.Levels[skinfo].RequiredLevel,
                ob.Levels[skinfo].RequiredSP, ob.Levels[skinfo].Effect, lastDescription));
        };
        if (ob.Passive)
            this._passive = ob.Passive;
        this._iconURL = ob.Icon;
        if (ob.Visible == false)
            this._visible = ob.Visible;
        this._availablelevel = this.Levels[0].RequiredLevel;
        this._skillmaxlevel = this.Levels.length;
        this._string_extensions = ob.Extensions;
    }
}

class LevelInfo {
    constructor(__requiredlevel, __requiredsp, __effect, __description) {
        this._requiredlevel = __requiredlevel;
        this._requiredsp = __requiredsp;
        this._description = __description;
        this._effect = __effect;
    }

    get RequiredSP() { return this._requiredsp; }
    get RequiredLevel() { return this._requiredlevel; }
    get SkillDescription() { return this._description; }
    get SkillEffect() { return this._effect; }
}
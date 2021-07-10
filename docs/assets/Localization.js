(function (w) {
    'use strict'

    /*
       Localize your language here

       Note:
       - <b>text</b>: "text" will be in bold
       - <br/>: line break in HTML
       - {0}, {1}, {2} and go on: the placeholder which will be replaced by Javascript on runtime,
                                  when a string has these, you should translate but leave these placeholders within the string.
                                  Example: "The class you selected requires the character to be at least at level {0}" will happen
                                  when user select character level below the required level of the current selected class.
                                  + {0} will be replaced with the required level of the current selected class by the code
    */
    var localize = {
        General: {
            WindowTitle: "Skill Simulator",

            // {0}: the character name
            WindowTitleWithCharacter: "Skill Simulator - {0}",

            ClipboardSuccess: "The link to this skill tree has been copied to clipboard.",
            ClipboardAccessFailure: "Clipboard access failed. Please copy the link below",
            ButtonClose: "Close",
            ButtonCancel: "Cancel",
            ButtonSelect: "Select",
            ButtonRemove: "Remove",

            // When a character's JSON data doesn't specify character classes, this string will be used as the initial class
            DefaultCharacterClassName: "Base"
        },
        SkillTree: {
            CharacterClass: "Class:",
            CharacterLevel: "Level:",
            InvestedSP: "Invested SP",
            RemainingSP: "Remaining SP",
            Button_ResetAllSkills: "Reset All Skills",
            Button_SlotAssignment: "Slot assignment",
            Button_Options: "Options",
            Button_CopyLinkToCurrentSkillTree: "Copy Link to current build",
            Button_CopyLinkToCurrentSkillTreeAndShowSkillAssignment: "Copy Link to current build and show skill assignment on load",

            // {0}: the character name
            MenuItem_MoreInfoAboutCharacter: "More info about {0}",

            MenuItem_MoreInfo: "More info",
            MenuItem_Home: "Home"
        },
        Notify: {
            // {0}: the level
            ClassRequireCharacterLevel: "The class you selected requires the character to be at least at level {0}",
            UnableToUnlearnBelowDefaultSkillLevel: "Can not go lower than skill's default level.",
            InsufficientSP: "Insufficient skill point.",
            InsufficientCharacterLevel: "Character level is not enough to learn further."
        },
        Prompt: {
            ResetSkill: "Are you sure you want to unlearn all skills?",
            ChangeClass: "<b>Changing class will reset your skill tree.</b><br/>Are you sure you want to change class?",
        },
        ToolTip: {
            CurrentHeader: "Current",
            AfterHeader: "After",
            NoInfoAvailable: "No info available",
            SkillEffectHeader: "Effect",
            SkillDescriptionHeader: "Description",
        },
        SkillSlot: {
            SkillSlotAssignmentDialogHeader: "Skill slot assignment",
            SkillSlotSelectionDialogHeader: "Select skill to assign",
            ButtonResetAssignment: "Reset",
            Prompt_ResetAssignment: "Are you sure you want to reset all the slot assignments?",
            SmallGuideText_HowToAssignASkill: "(Click the boxes to assign skill)",
            SmallGuideText_HowToSelectASkill: "Click the box to select skill",

            SkillChainEffectHeader_SecondChain: "Step-2 Bonus:",
            SkillChainEffectHeader_ThirdChain: "Step-3 Bonus:",

            // {0}: the value of the effect. See effect value below
            SkillChainEffect_DamageUp: "Damage +{0}",
            SkillChainEffect_CooldownReduce: "Cooldown -{0}",
            SkillChainEffect_SGCostReduce: "SG Cost -{0}",

            // Second skill chain effect value
            SkillChainEffect2nd_DamageValue: "4%",
            SkillChainEffect2nd_CooldownValue: "8%",
            SkillChainEffect2nd_SGCostValue: "12%",

            // Third skill chain effect value
            SkillChainEffect3rd_DamageValue: "8%",
            SkillChainEffect3rd_CooldownValue: "15%",
            SkillChainEffect3rd_SGCostValue: "25%",
        },
        Option: {
            Tooltip_SaveToBrowser: "The option you changed here will not be remembered next time you visit the site. Save the setting to your browser will make your browser remember the setting forever, even when the browser is restarted.",
            OptionSavedToBrowser: "Your setting has been saved",
            Button_SaveSettingToBrowser: "Save the setting to browser",

            // {0}: the "localStorage" hyperlink which refers to https://www.w3schools.com/html/html5_webstorage.asp
            // {1}: the "cookie" hyperlink which refers to https://www.w3schools.com/js/js_cookies.asp
            SaveSettingToBrowser: "The setting will be saved to your web browser by using {0} (Or fallback to {1} if your browser does not support {0}).<br/><b>Do you want to store the data on your computer?</b>",
            SaveSettingToBrowserRetry: "Do you want to retry?",

            SkillPreviewHeader: "Skill preview:",
            Selection_PreviewOff: "No preview",
            Selection_PreviewOn_Beta: "Show video (Beta)",
            Selection_PreviewOn: "Show video",
            SelectionDescription_PreviewOff: "Turn off preview",
            SelectionDescription_PreviewOn_Beta: "\"Show video (Beta)\" will use WebM container with video codec VP9 to achieve even higher compression. This means you will download less data (it happens only once anyway or until browser's cache is expired or cleaned, so you don't really save anything much) in exchange of higher compute power to decode and play the video. It may have some visual bugs, too, select \"Show video\" option if you can't stand the bug or the video can't be played",
            SelectionDescription_PreviewOn: "Show skill preview with MP4 container with video codec H.264 (Profile High). This container and the codec are widely supported in most of browsers you can find",
        },
        Error: {
            VideoAutoplayBlocked: "Your browser's video autoplay policy has blocked skill preview videos. Therefore, the preview video will show a blank space until you press or click on the page. If you want to see the preview without doing so, please change the policy to allow autoplay video (with or without audio doesn't matter)."
        }
    };

    // Don't modify anything below
    let skillTreeData;
    if (!w.hasOwnProperty("SkillTreeData")) {
        skillTreeData = {};
        Object.defineProperty(w, "SkillTreeData", {
            value: skillTreeData,
            configurable: false,
            enumerable: true,
            writable: false
        });
    } else {
        skillTreeData = w.SkillTreeData;
    }

    Object.defineProperty(skillTreeData, "Localization", {
        value: deepFreeze(localize),
        configurable: false,
        enumerable: true,
        writable: false
    });
})(window);
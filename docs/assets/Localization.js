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
            WindowTitle: "Soulworker スキルシミュレーター",

            // {0}: the character name
            WindowTitleWithCharacter: "Soulworker スキルシミュレーター - {0}",

            ClipboardSuccess: "コピーに成功",
            ClipboardAccessFailure: "コピーに失敗。 下記のリンクをコピーしてください。",
            ButtonClose: "終了",
            ButtonCancel: "キャンセル",
            ButtonSelect: "選択",
            ButtonRemove: "除去",

            // When a character's JSON data doesn't specify character classes, this string will be used as the initial class
            DefaultCharacterClassName: "オリジナル"
        },
        SkillTree: {
            CharacterClass: "クラス：",
            CharacterLevel: "Lv：",
            InvestedSP: "使用済みSP：",
            RemainingSP: "残りSP：",
            Button_ResetAllSkills: "スキル全体初期化",
            Button_SlotAssignment: "スキルプリセット",
            Button_Options: "設定",
            Button_CopyLinkToCurrentSkillTree: "URLをコピー",
            Button_CopyLinkToCurrentSkillTreeAndShowSkillAssignment: "URLをコピーしてロード時にスキルプリセットを表示",

            // {0}: the character name
            MenuItem_MoreInfoAboutCharacter: "キャラクター Wiki",

            MenuItem_MoreInfo: "詳細情報",
            MenuItem_Home: "トップ"
        },
        Notify: {
            // {0}: the level
            ClassRequireCharacterLevel: "選択したクラスは、キャラクターのレベルが{0}以上である必要があります。",
            UnableToUnlearnBelowDefaultSkillLevel: "スキルのデフォルトレベルより低くすることはできません。",
            InsufficientSP: "SP不足",
            InsufficientCharacterLevel: "キャラクターのレベルが足りず、それ以上は習得できません。"
        },
        Prompt: {
            ResetSkill: "本当に全スキルをリセットしても良いですか？",
            ChangeClass: "<b>クラスを変更するとスキルツリーがリセットされます。</b><br/>クラスを変更しますか？",
        },
        ToolTip: {
            CurrentHeader: "現在のレベルの性能",
            AfterHeader: "変化後のレベルの性能",
            NoInfoAvailable: "存在しません。",
            SkillEffectHeader: "情報",
            SkillDescriptionHeader: "説明",
        },
        SkillSlot: {
            SkillSlotAssignmentDialogHeader: "スキルプリセット",
            SkillSlotSelectionDialogHeader: "割り当てるスキルを選択",
            ButtonResetAssignment: "リセット",
            Prompt_ResetAssignment: "スロットの割り当てを全部リセットしても良いですか？",
            SmallGuideText_HowToAssignASkill: "（ボックスをクリックしてスキルを割り当てる）",
            SmallGuideText_HowToSelectASkill: "ボックスをクリックしてスキルを選択します。",

            SkillChainEffectHeader_SecondChain: "2段階ボーナス",
            SkillChainEffectHeader_ThirdChain: "3段階ボーナス",

            // {0}: the value of the effect. See effect value below
            SkillChainEffect_DamageUp: "ダメージ{0}増加",
            SkillChainEffect_CooldownReduce: "ク一ル夕イム{0}減少",
            SkillChainEffect_SGCostReduce: "SG消費量{0}減少",

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
            Tooltip_SaveToBrowser: "ここで変更したオプションは、次回のサイト訪問時には記憶されません。設定をブラウザに保存しておくと、ブラウザを再起動しても設定が記憶されます。",
            OptionSavedToBrowser: "設定が保存されました。",
            Button_SaveSettingToBrowser: "設定をブラウザに保存",

            // {0}: the "localStorage" hyperlink which refers to https://www.w3schools.com/html/html5_webstorage.asp
            // {1}: the "cookie" hyperlink which refers to https://www.w3schools.com/js/js_cookies.asp
            SaveSettingToBrowser: "設定は{0}でブラウザに保存されます（ブラウザが{0}に対応していない場合は{1}にフォールバックします）。に保存しますか？",
            SaveSettingToBrowserRetry: "再挑戦しますか？",

            SkillPreviewHeader: "スキルプレビュー：",
            Selection_PreviewOff: "プレビューなし",
            Selection_PreviewOn_Beta: "ショービデオ(WebM) (BETA)",
            Selection_PreviewOn: "ショービデオ(MP4)",
            SelectionDescription_PreviewOff: "プレビューをオフにする。",
            SelectionDescription_PreviewOn_Beta: "\"ショービデオ(WebM) (BETA)\" では、WebMコンテナにビデオコーデックVP9を使用し、さらなる高圧縮を実現します。これは、より少ないデータでダウンロード出来ることを意味します（一度だけ発生するか、ブラウザのキャッシュ期限切れ。またはクリーンアップされるまで、追加で保存する必要がありません）。ただしビデオをデコードして再生するためのより高い計算パワーと引き換えに、いくつかの視覚的なバグが発生する可能性があります。あなたがバグに遭遇したくなかったり、ビデオを再生出来ない場合は、\"ショービデオ(MP4)\" オプションを選択して下さい。",
            SelectionDescription_PreviewOn: "ビデオコーデックH.264（ハイプロファイル）とMP4コンテナでスキルのプレビューを表示します。このコンテナとコーデックは、あなたが見つけることができるブラウザのほとんどで広くサポートされています。",
        },
        Confirmation: {
            Warning: "警告",
            Notice: "注意",
			DoubleConfirm: "二重確認",
        },
        Others: {
            CreativeCommon: "CCライセンス 表示 - 非営利 - 継承 3.0 非移植",
            // {0}: the "Creative Commons Attribution-NonCommercial-ShareAlike" hyperlink which refers to https://creativecommons.org/licenses/by-nc-sa/3.0/
            // {1}: the "Lion Games" hyperlink which refers to http://www.liongames.co.kr/Front/
            CreativeCommonNote: "<span>コンテンツは明記されていない限り{0}の条件下でのみ利用可能です。<br />公式アート、ゲームコンテンツ、スクリーンショットは{1}およびゲームのパブリッシャーの商標および著作権です。</span>",
            CreativeCommonNoteIndex: "<span>コンテンツは明記されていない限り{0}の条件下でのみ利用可能です。<br />公式アート、ゲームコンテンツ、スクリーンショットは{1}およびゲームのパブリッシャーの商標および著作権です。</span>"
        },
        Error: {
            VideoAutoplayBlocked: "ブラウザのビデオ自動再生ポリシーにより、スキルプレビュービデオがブロックされています。 したがって、ページを押すかクリックするまで、プレビュービデオには空白が表示されます。 そうせずにプレビューを表示したい場合は、自動再生ビデオを許可するようにポリシーを変更してください（オーディオの有無は関係ありません）。"
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
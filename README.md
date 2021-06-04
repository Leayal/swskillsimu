# SoulWorker Skill Simulator
This is the skill tree simulator for SoulWorker game which is developed by Lion Games.
The tree is developped with information source mainly from SoulWorker in Japan region. Feel free to fork and edit it (and redistribute/republish) for other regions.

# Notice
This repo is not actively maintained anymore. There are others who actually keep the tree up-to-date with the server's contents.

This repo is now mainly for archive purpose. Everyone can do whatever you want with this repo.

For consumers, please check out the forked repos which is actually being updated (stated above): [Network of forked](https://github.com/Leayal/swskillsimu/network)

The language stated in the releases below may not be meant for the publisher region, but the simulator's language|text:
- [Use the skill simulator release (Japanese language)](https://pinkusagi.github.io/swskillsimu_jp/) (by [pinkusagi](https://github.com/PinkUsagi)).
- [Use the skill simulator release (English language)](https://eden333.github.io/swskillsimu) (by [eden333](https://github.com/eden333)).

# Customize
- You can translate most of UI-related strings at [docs/assets/Localization.js](docs/assets/Localization.js).

- You can configure the simulator at [docs/assets/DefaultConfig.js](docs/assets/DefaultConfig.js). For example:
  - Add more character to the simulator: edit the `table_Character`, this will make your added character(s) appear on both homepage and others' skill tree page.
  - Change max level: edit the `maxCharacterLevel`, this will set default max level if not specified in character's JSON data.
  - Skill Point Table: edit the `table_SkillPoint`, configure the amount of SP gain for levels.

(Read the comment in the JS files for more info)

# Disclaimer
Content is available under [Commons Attribution-NonCommercial-ShareAlike](https://creativecommons.org/licenses/by-nc-sa/3.0/) unless stated.
Official Art, Game Content and Screenshots are trademarks and copyrights of [Lion Games](http://www.liongames.co.kr/Front/) and the game's publishers.

# Credits:
Special thanks to people who helped me on this simulator. [See details](https://leayal.github.io/swskillsimu/).

# Dependencies:
- [JQuery v3.4.1](https://jquery.com)
- [JQueryUI v1.12.1](https://jqueryui.com)
- [Bootstrap v4.1.3](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
- [zenorocha's clipboard.js v2.0.4](https://github.com/zenorocha/clipboard.js)
- [desandro's imagesloaded v4.1.4](https://github.com/desandro/imagesloaded)
- [mouse0270's bootstrap-notify v3.1.5](https://github.com/mouse0270/bootstrap-notify)
- [ntkme's github-buttons](https://github.com/ntkme/github-buttons)
- [animate.css v3.7.2](https://github.com/daneden/animate.css)

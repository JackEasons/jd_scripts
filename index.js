'use strict'
exports.main_handler = async (event, context, callback) => {
  require('./jd_xtg.js') //这里写你想要的脚本
  require('./jd_bean_change.js') //这里写你想要的脚本
  require('./jd_pet.js')
  require('./jd_fruit.js') //这里写你想要的脚本
  require('./jd_speed.js') //这里写你想要的脚本
  require('./jd_moneyTree.js') //这里写你想要的脚本
  require('./jd_joy.js') //这里写你想要的脚本
  require('./jd_joy_steal.js') //这里写你想要的脚本
  require('./jd_joy_feedPets.js') //这里写你想要的脚本
  require('./jd_joy_reward.js') //这里写你想要的脚本
  require('./jd_joy_help.js') //这里写你想要的脚本
  require('./jd_joy_run.js') //这里写你想要的脚本
  require('./jd_petTreasureBox.js') //这里写你想要的脚本
  require('./jd_unsubscribe.js') //这里写你想要的脚本
  require('./jd_superMarket.js') //这里写你想要的脚本
  require('./jd_blueCoin.js') //这里写你想要的脚本
  require('./jd_shop.js') //这里写你想要的脚本
  require('./jd_club_lottery.js') //这里写你想要的脚本
  require('./jd_redPacket.js') //这里写你想要的脚本
  require('./jd_bean_sign.js') //这里写你想要的脚本
}

const $ = new Env("获取shareCode");
const JD_API_HOST = "https://api.m.jd.com/client.action";
let message = ''
const cookie = "pt_key=AAJf5JFeADAELDjEvMP5pSK8bfymE93f6R-dMacXNB9-JvyHtJdUlHTZayOmv6YPU8HS3FIBUmI;pt_pin=jd_5b5dd9f9d8977;"
/////////////////  东东工厂 /////////////////////////////////////////////////////////////

$.post(
  taskPostUrl("jdfactory_getTaskDetail", {}, "jdfactory_getTaskDetail"),
  async (err, resp, data) => {
    try {
      if (err) {
        console.log(`${JSON.stringify(err)}`);
        console.log(`$东东工厂 API请求失败，请检查网路重试`);
      } else {
        if (safeGet(data)) {
          data = JSON.parse(data);
          if (data.data.bizCode === 0) {
            $.taskVos = data.data.result.taskVos; //任务列表
            $.taskVos.map((item) => {
              if (item.taskType === 14) {
                console.log(
                  `\n您的东东工厂好友助力邀请码：${item.assistTaskDetailVo.taskToken}\n`
                );
              }
            });
          }
        }
      }
    } catch (e) {
      $.logErr(e, resp);
    } finally {
      //resolve();
    }
  }
);

/////////////////  惊喜工厂 /////////////////////////////////////////////////////////////

const JX_API_HOST = "https://m.jingxi.com";

function JXGC_taskurl(functionId, body = "") {
  return {
    url: `${JX_API_HOST}/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now()}`,
    headers: {
      Cookie: cookie,
      Host: "m.jingxi.com",
      Accept: "*/*",
      Connection: "keep-alive",
      "User-Agent":
        "jdpingou;iPhone;3.14.4;14.0;ae75259f6ca8378672006fc41079cd8c90c53be8;network/wifi;model/iPhone10,2;appBuild/100351;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/62;pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      "Accept-Language": "zh-cn",
      Referer: "https://wqsd.jd.com/pingou/dream_factory/index.html",
      "Accept-Encoding": "gzip, deflate, br",
    },
  };
}

$.get(
  JXGC_taskurl(
    "userinfo/GetUserInfo",
    `pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=`
  ),
  async (err, resp, data) => {
    try {
      if (err) {
        console.log(`${JSON.stringify(err)}`);
        console.log(`惊喜工厂 API请求失败，请检查网路重试`);
      } else {
        if (safeGet(data)) {
          data = JSON.parse(data);
          if (data["ret"] === 0) {
            data = data["data"];
            $.unActive = true; //标记是否开启了京喜活动或者选购了商品进行生产
            $.encryptPin = "";
            $.shelvesList = [];
            if (data.factoryList && data.productionList) {
              const production = data.productionList[0];
              const factory = data.factoryList[0];
              const productionStage = data.productionStage;
              $.factoryId = factory.factoryId; //工厂ID
              $.productionId = production.productionId; //商品ID
              $.commodityDimId = production.commodityDimId;
              $.encryptPin = data.user.encryptPin;
              // subTitle = data.user.pin;
              console.log(`惊喜工厂分享码: ${data.user.encryptPin}`);
            }
          } else {
            $.unActive = false; //标记是否开启了京喜活动或者选购了商品进行生产
            if (!data.factoryList) {
              console.log(
                `【提示】京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动\n`
              );
            } else if (data.factoryList && !data.productionList) {
              console.log(
                `【提示】京东账号${$.index}[${$.nickName}]京喜工厂未选购商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选购\n`
              );
            }
          }
        } else {
          console.log(`GetUserInfo异常：${JSON.stringify(data)}`);
        }
      }
    } catch (e) {
      $.logErr(e, resp);
    } finally {
    }
  }
);

/////////////////  京东萌宠 /////////////////////////////////////////////////////////////

const JDPet_API_HOST = "https://api.m.jd.com/client.action";

function jdPet_Url(function_id, body = {}) {
  body["version"] = 2;
  body["channel"] = "app";
  return {
    url: `${JDPet_API_HOST}?functionId=${function_id}`,
    body: `body=${escape(
      JSON.stringify(body)
    )}&appid=wh5&loginWQBiz=pet-town&clientVersion=9.0.4`,
    headers: {
      Cookie: cookie,
      "User-Agent": $.isNode()
        ? process.env.JD_USER_AGENT
          ? process.env.JD_USER_AGENT
          : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
        : $.getdata("JDUA")
        ? $.getdata("JDUA")
        : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
      Host: "api.m.jd.com",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
}

$.post(jdPet_Url("initPetTown"), async (err, resp, data) => {
  try {
    if (err) {
      console.log("\n东东萌宠: API查询请求失败 ‼️‼️");
      console.log(JSON.stringify(err));
      $.logErr(err);
    } else {
      data = JSON.parse(data);

      const initPetTownRes = data;

      message = `【京东账号${$.index}】${$.nickName}\n`;
      if (
        initPetTownRes.code === "0" &&
        initPetTownRes.resultCode === "0" &&
        initPetTownRes.message === "success"
      ) {
        $.petInfo = initPetTownRes.result;
        if ($.petInfo.userStatus === 0) {
          console.log(
            `【提示】京东账号${$.index}${$.nickName}\n萌宠活动未开启\n请手动去京东APP开启活动\n入口：我的->游戏与互动->查看更多开启`
          );
          return;
        }

        console.log(
          `\n【您的京东萌宠互助码shareCode】 ${$.petInfo.shareCode}\n`
        );
      } else if (initPetTownRes.code === "0") {
        console.log(`初始化萌宠失败:  ${initPetTownRes.message}`);
      } else {
        console.log("shit");
      }
    }
  } catch (e) {
    $.logErr(e, resp);
  } finally {
    //resolve(data);
  }
});

/////////////////  京东萌宠 /////////////////////////////////////////////////////////////

const JDplant_API_HOST = "https://api.m.jd.com/client.action";

!(async () => {
  await jdPlantBean();
})()
  .catch((e) => {
    $.log("", `❌ 种豆得豆, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    //$.done();
  });

async function plantBeanIndex() {
  $.plantBeanIndexResult = await plant_request("plantBeanIndex"); //plantBeanIndexBody
}

function plant_request(function_id, body = {}) {
  return new Promise(async (resolve) => {
    $.post(plant_taskUrl(function_id, body), (err, resp, data) => {
      try {
        if (err) {
          console.log("\n种豆得豆: API查询请求失败 ‼️‼️");
          console.log(`function_id:${function_id}`);
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function plant_taskUrl(function_id, body) {
  body["version"] = "9.0.0.1";
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return {
    url: JDplant_API_HOST,
    body: `functionId=${function_id}&body=${escape(
      JSON.stringify(body)
    )}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`,
    headers: {
      Cookie: cookie,
      Host: "api.m.jd.com",
      Accept: "*/*",
      Connection: "keep-alive",
      "User-Agent": $.isNode()
        ? process.env.JD_USER_AGENT
          ? process.env.JD_USER_AGENT
          : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
        : $.getdata("JDUA")
        ? $.getdata("JDUA")
        : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
      "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
}

function getParam(url, name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  const r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

async function jdPlantBean() {
  console.log(`获取任务及基本信息`);
  await plantBeanIndex();
  // console.log(plantBeanIndexResult.data.taskList);
  if ($.plantBeanIndexResult.code === "0") {
    const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl;
    $.myPlantUuid = getParam(shareUrl, "plantUuid");
    console.log(`\n【您的种豆得豆互助码】 ${$.myPlantUuid}\n`);
  } else {
    console.log(
      `种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`
    );
  }
}

/////////////////  京东农场 /////////////////////////////////////////////////////////////

async function initForFarm() {
  return new Promise((resolve) => {
    const option = {
      url: `${JD_API_HOST}?functionId=initForFarm`,
      body: `body=${escape(
        JSON.stringify({ version: 4 })
      )}&appid=wh5&clientVersion=9.1.0`,
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        cookie: cookie,
        origin: "https://home.m.jd.com",
        pragma: "no-cache",
        referer: "https://home.m.jd.com/myJd/newhome.action",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "User-Agent": $.isNode()
          ? process.env.JD_USER_AGENT
            ? process.env.JD_USER_AGENT
            : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
          : $.getdata("JDUA")
          ? $.getdata("JDUA")
          : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    $.post(option, (err, resp, data) => {
      try {
        if (err) {
          console.log("\n东东农场: API查询请求失败 ‼️‼️");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            $.farmInfo = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

async function jdFruit() {
  await initForFarm();
  if ($.farmInfo.farmUserPro) {
    // option['media-url'] = $.farmInfo.farmUserPro.goodsImage;
    subTitle = `【京东账号${$.index}】${$.nickName}`;
    message = `【水果名称】${$.farmInfo.farmUserPro.name}\n`;
    console.log(
      `\n【您的京东农场互助码shareCode】 ${$.farmInfo.farmUserPro.shareCode}\n`
    );
  } else {
    console.log(
      `初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常,农场初始化数据: ${JSON.stringify(
        $.farmInfo
      )}`
    );
  }
}

!(async () => {
  await jdFruit();
})()
  .catch((e) => {
    $.log("", `❌东东农场, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    //$.done();
  });

///////////////////// 健康抽奖机 ///////////////////////////////////////////////////

function jdhealth_taskPostUrl(function_id, body = {}, function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(
      JSON.stringify(body)
    )}&client=wh5&clientVersion=9.1.0`,
    headers: {
      Cookie: cookie,
      origin: "https://h5.m.jd.com",
      referer: "https://h5.m.jd.com/",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": $.isNode()
        ? process.env.JD_USER_AGENT
          ? process.env.JD_USER_AGENT
          : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
        : $.getdata("JDUA")
        ? $.getdata("JDUA")
        : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
    },
  };
}

function jdhealth_getTaskDetail(get = 1) {
  return new Promise((resolve) => {
    $.post(
      jdhealth_taskPostUrl("healthyDay_getHomeData", {
        appId: "1EFRTwg",
        taskToken: "",
      }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`健康抽奖机API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.data.bizCode === 0) {
                $.taskVos = data.data.result.taskVos; //任务列表
                $.userInfo = data.data.result.userInfo;
                if (get)
                  $.taskVos.map((item) => {
                    if (item.taskType === 14) {
                      console.log(
                        `\n您的健康抽奖机好友助力邀请码：${item.assistTaskDetailVo.taskToken}\n`
                      );
                      message += `\n您的健康抽奖机好友助力邀请码：${item.assistTaskDetailVo.taskToken}\n`;
                    }
                  });
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      }
    );
  });
}

!(async () => {
  await jdhealth_getTaskDetail();
})()
  .catch((e) => {
    $.log("", `健康抽奖机, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    //$.done();
  });

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function taskPostUrl(function_id, body = {}, function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(
      JSON.stringify(body)
    )}&client=wh5&clientVersion=9.1.0`,
    headers: {
      Cookie: cookie,
      origin: "https://h5.m.jd.com",
      referer: "https://h5.m.jd.com/",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": $.isNode()
        ? process.env.JD_USER_AGENT
          ? process.env.JD_USER_AGENT
          : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
        : $.getdata("JDUA")
        ? $.getdata("JDUA")
        : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
    },
  };
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

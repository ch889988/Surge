const params = getParams($argument);
const provinceName = params.provname || "浙江";
const apiUrls = [
  `https://apis.tianapi.com/oilprice/index?key=8d193f5602157675330ecb8355bbefb4&prov=${encodeURIComponent(provinceName)}`,
  `https://apis.tianapi.com/oilprice/index?key=8d193f5602157675330ecb8355bbefb4&prov=${encodeURIComponent(provinceName)}`,
  `https://apis.tianapi.com/oilprice/index?key=8d193f5602157675330ecb8355bbefb4&prov=${encodeURIComponent(provinceName)}`,
  `https://apis.tianapi.com/oilprice/index?key=8d193f5602157675330ecb8355bbefb4&prov=${encodeURIComponent(provinceName)}`,
  `https://apis.tianapi.com/oilprice/index?key=8d193f5602157675330ecb8355bbefb4&prov=${encodeURIComponent(provinceName)}`
];
let currentIndex = 0;

function testNextUrl() {
  if (currentIndex >= apiUrls.length) {
    console.log("All URLs failed");
    $done();
    return;
  }

  const apiUrl = apiUrls[currentIndex];

  $httpClient.get(apiUrl, (error, response, data) => {
    if (error) {
      console.log(`Error for URL ${currentIndex + 1}: ${error}`);
      currentIndex++;
      testNextUrl();
    } else {
      handleResponse(data);
    }
  });
}

function handleResponse(data) {
  const oilPriceData = JSON.parse(data);
  console.log(oilPriceData);

  if (oilPriceData.code === 200) {
    const oilPriceInfo = oilPriceData.result;
    const message = `📍地区：${oilPriceInfo.prov}\n⛽0号柴油：${oilPriceInfo.p0}元/升\n⛽89号汽油：${oilPriceInfo.p89}元/升\n⛽92号汽油：${oilPriceInfo.p92}元/升\n⛽95号汽油：${oilPriceInfo.p95}元/升\n⛽98号汽油：${oilPriceInfo.p98}元/升\n🕰︎更新时间：${oilPriceInfo.time}`;

    const body = {
      title: "今日油价",
      content: message,
      provname: params.provname,
      icon: params.icon,
      "icon-color": params.color
    };
    $done(body);
  } else {
    console.log(`请求失败，错误信息：${oilPriceData.msg}`);
    currentIndex++;
    testNextUrl();
  }
}

function getParams() {
  try {
    //传入参数：provname
    let quires = getArgs();
    return quires;
  } catch (e) {
    throw e;
  }
}

function getArgs(t = {}) { let e; return e = "undefined" != typeof $argument ? Object.fromEntries($argument.split("&").map((t => t.split("=")))) : {}, $.info(`传入的 $argument: ${$.toStr(e)}`), e = { ...e, ...$.getjson(NAMESPACE, t) }, $.info(`从持久化存储读取参数后: ${$.toStr(e)}`), e }

testNextUrl();
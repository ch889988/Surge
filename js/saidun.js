(async () => {
  const ENV_URL = "https://raw.githubusercontent.com/ch889988/Surge/main/js/evn.js";
  const UTILS_URL = "https://raw.githubusercontent.com/ch889988/Surge/main/js/utils.js";

  try {
    const Env = await loadEnv();
    const $ = new Env("赛盾加速器VPN");

    let body = $response?.body || "";

    try {
      if (typeof body === "string") {
        body = JSON.parse(body);
      }
    } catch {
      return $.done({});
    }

    if (body.code !== 200) {
      return $.done({});
    }

    try {
      const utils = await loadUtils($);
      const CryptoJS = utils.createCryptoJS();
      if (!CryptoJS) throw new Error("CryptoJS 初始化失败");

      const encryptedUrl = body.result?.url;
      if (!encryptedUrl) throw new Error("未找到加密 URL");

      const key = CryptoJS.enc.Utf8.parse("TmPrPhkOf8by0cvx");
      const iv = CryptoJS.enc.Utf8.parse("TmPrPhkOf8by0cvx");

      const base64Url = decodeURIComponent(encryptedUrl);
      const decryptedUrl = AES_Decrypt(base64Url, key, iv, CryptoJS, $);

      $.msg($.name, "✅解密成功", decryptedUrl);
    } catch (e) {
      $.msg($.name, "❎解密失败", e.message);
    } finally {
      $.done({});
    }
  } catch {}

  function AES_Decrypt(data, key, iv, CryptoJS, $) {
    try {
      const decrypted = CryptoJS.AES.decrypt(data, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
      throw new Error("AES 解密失败");
    }
  }

  async function loadUtils($) {
    try {
      const cachedCode = $.getdata("Utils_Code");
      if (cachedCode) {
        const utils = evalCachedUtils(cachedCode, $);
        if (utils) {
          $.log("✅Utils 缓存加载成功");
          return utils;
        }
      }

      const script = await getCompatible(UTILS_URL, $);
      if (script) {
        $.setdata(script, "Utils_Code");
        const utils = evalCachedUtils(script, $);
        if (utils) {
          $.log("✅Utils 下载并缓存成功");
          return utils;
        }
      }
    } catch {}

    throw new Error("❎Utils 加载失败");
  }

  function evalCachedUtils(code, $) {
    try {
      eval(code);
      return typeof creatUtils === "function" ? creatUtils() : null;
    } catch {
      return null;
    }
  }

  async function loadEnv() {
    let envCode = $persistentStore?.read("Eric_Env_Code") || "";
    if (envCode) {
      
      const env = evalCachedEnv(envCode);
      if (env) {
        console.log("✅Env 缓存加载成功");
        return env;
      }
    }

    const data = await getCompatible(ENV_URL);
    if (data) {
      
      $persistentStore?.write(data, "Eric_Env_Code");
      const env = evalCachedEnv(data);
      if (env) {
        console.log("✅Env 下载并缓存成功");
        return env;
      }
    }

    throw new Error("❎Env 加载失败");
  }

  function evalCachedEnv(code) {
    try {
      eval(code);
      return typeof Env === "function" ? Env : null;
    } catch {
      return null;
    }
  }

  function getCompatible(url, $) {
    return new Promise((resolve, reject) => {
      if (typeof $httpClient !== "undefined") {
        $httpClient.get({ url }, (err, resp, data) => {
          if (!err && resp.status === 200) resolve(data);
          else reject(err || new Error(`状态码 ${resp.status}`));
        });
      } else if (typeof $task !== "undefined") {
        $task.fetch({ url }).then(
          (resp) => resolve(resp.body),
          reject
        );
      } else if (typeof fetch !== "undefined") {
        fetch(url)
          .then(r => r.ok ? r.text() : Promise.reject(new Error(`状态码 ${r.status}`)))
          .then(resolve)
          .catch(reject);
      } else {
        reject("不支持的运行环境");
      }
    });
  }
})();
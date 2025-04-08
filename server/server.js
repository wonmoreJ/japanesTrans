const express = require("express");
const cors = require("cors");
var request = require("request");
const axios = require("axios");

const app = express();
const PORT = 5000;
const DEEPL_API_KEY = "";

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  const param = req.body;

  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({
        text: param.text,
        target_lang: "JA",
        source_lang: "KO",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        },
      }
    );

    const translated = response.data.translations[0].text;
    const paramData = {
      translated: translated,
      token: param.token,
    };
    await sendKakaoMessage(paramData);
    res.json({ translated });
  } catch (e) {
    console.error("번역오류", e);
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});

const sendKakaoMessage = async (paramData) => {
  console.log("카카오톡API시작");

  const accessToken = "";
  console.log(accessToken);
  const text = paramData.translated;
  console.log(text);
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Bearer " + accessToken,
  };

  const template = {
    object_type: "text",
    text: text,
    link: {
      web_url: "http://localhost:5500/client/voice_japan.html",
      mobile_web_url: "http://localhost:5500/client/voice_japan.html",
    },
    button_title: "확인",
  };

  const dataString = `template_object=${encodeURIComponent(
    JSON.stringify(template)
  )}`;

  const options = {
    url: "https://kapi.kakao.com/v2/api/talk/memo/default/send",
    method: "POST",
    headers: headers,
    body: dataString,
  };
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("메시지 전송 완료.");
    } else {
      console.error("전송실패", error);
      console.error("response body:", body);
    }
  }

  request(options, callback);
};

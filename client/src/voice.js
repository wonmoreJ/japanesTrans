document.getElementById("voiceBtn").addEventListener("click", function () {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "ko-KR";
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById("voice").innerHTML = text;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const param = {
      text: text,
      token: code,
    };

    getJapanese(param);
  };
});

function getJapanese(param) {
  fetch("http://localhost:5000/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(param),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("japanese").innerHTML = data.translated;
    });
}

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
let speechResult = "";

const phrases = [
  "I love to sing because it's fun",
  "where are you going",
  "can I call you tomorrow",
  "why did you talk while I was talking",
  "she enjoys reading books and playing games",
  "where are you going",
  "have a great day",
  "she sells seashells on the seashore",
];

// const phrasePara = document.querySelector('.phrase');
// const resultPara = document.querySelector('.result');
const diagnosticPara = document.querySelector("[output]");
const testBtn = document.querySelector("[test-btn]");
const videoFrame = document.querySelector('#video-frame')

function randomPhrase() {
  const number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = "Test in progress";

  //   var phrase = phrases[randomPhrase()];
  // To ensure case consistency while checking with the returned output text
  //   phrase = phrase.toLowerCase();
  //   phrasePara.textContent = phrase;
  //   resultPara.textContent = 'Right or wrong?';
  //   resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = "listening";

  var grammar = "#JSGF V1.0; grammar phrase; public <phrase> = ;";
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = "Speech received: " + speechResult + ".";
    // if(speechResult === phrase) {
    //   resultPara.textContent = 'I heard the correct phrase!';
    //   resultPara.style.background = 'lime';
    // } else {
    //   resultPara.textContent = 'That didn\'t sound right.';
    //   resultPara.style.background = 'red';
    // }

    console.log("Confidence: " + event.results[0][0].confidence);
  };

  recognition.onspeechend = function () {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = "Start new test";
  };

  recognition.onerror = function (event) {
    testBtn.disabled = false;
    testBtn.textContent = "Start new test";
    diagnosticPara.textContent =
      "Error occurred in recognition: " + event.error;
  };

  recognition.onaudiostart = function (event) {
    //Fired when the user agent has started to capture audio.
    console.log("SpeechRecognition.onaudiostart");
  };

  recognition.onaudioend = function (event) {
    //Fired when the user agent has finished capturing audio.
    console.log("SpeechRecognition.onaudioend");
  };

  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    console.log("SpeechRecognition.onend");
    speak();
  };

  recognition.onnomatch = function (event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log("SpeechRecognition.onnomatch");
  };

  recognition.onsoundstart = function (event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log("SpeechRecognition.onsoundstart");
  };

  recognition.onsoundend = function (event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log("SpeechRecognition.onsoundend");
  };

  recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log("SpeechRecognition.onspeechstart");
  };
  recognition.onstart = function (event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log("SpeechRecognition.onstart");
  };

  return speechResult;
}

testBtn.addEventListener("click", testSpeech);

//****************Text to Speech********************

const synth = window.speechSynthesis;
let voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase();
    const bname = b.name.toUpperCase();

    if (aname < bname) {
      return -1;
    } else if (aname == bname) {
      return 0;
    } else {
      return +1;
    }
  });

}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  if (speechResult !== "") {
    const utterThis = new SpeechSynthesisUtterance(sayThisIf(speechResult));

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
      videoFrame.setAttribute('src', 'https://youtu.be/NLsyKCkoMXI?feature=shared');
      videoFrame.setAttribute('autoplay', '');
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === "Google UK English Male") {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = 0.8;
    utterThis.rate = 1;
    synth.speak(utterThis);
  }
}


function sayThisIf(result) {
  if (result.includes("charging station")) {
    return "Our charging stations are state of the art and our team has been diligent to solve the bottleneck problems so our clients never have to wait!";
  }
  if (result.includes("the gentleman")) {
    return "The gentleman is number one in streaming on Netflix for several weeks running.";
  } else {
    return "I don't know enough about that to comment";
  }
}

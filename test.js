/* =========================================================
   English Notebook - test.js
   テストロジック（問題生成 / 採点 / 結果表示）
   ========================================================= */

/* ---------------------------------------------------------
   DOM取得
--------------------------------------------------------- */
const startBtn = document.getElementById("startTestBtn");
const testArea = document.getElementById("testArea");
const resultArea = document.getElementById("resultArea");

const questionEl = document.getElementById("testQuestion");
const answerInput = document.getElementById("testAnswer");
const submitBtn = document.getElementById("submitAnswerBtn");
const feedbackEl = document.getElementById("testFeedback");

const scoreEl = document.getElementById("resultScore");
const rateEl = document.getElementById("resultRate");
const wrongListEl = document.getElementById("wrongList");
const retryBtn = document.getElementById("retryBtn");

const unitSelectSection = document.getElementById("unitSelectSection");
const unitSelect = document.getElementById("unitSelect");

/* ---------------------------------------------------------
   テスト設定
--------------------------------------------------------- */
let mode = "en-ja";     // 英→日 or 日→英
let count = 10;         // 問題数
let selectedUnit = 1;   // Unit指定時

let questions = [];     // 出題リスト
let index = 0;          // 現在の問題番号
let correctCount = 0;   // 正答数
let wrongList = [];     // 間違えた問題

/* ---------------------------------------------------------
   ラジオボタンの監視
--------------------------------------------------------- */
document.querySelectorAll("input[name='mode']").forEach(r => {
  r.addEventListener("change", () => {
    mode = r.value;
  });
});

document.querySelectorAll("input[name='count']").forEach(r => {
  r.addEventListener("change", () => {
    count = r.value;

    // Unit指定のときだけ表示
    unitSelectSection.style.display = (count === "unit") ? "block" : "none";
  });
});

unitSelect.addEventListener("change", () => {
  selectedUnit = Number(unitSelect.value);
});

/* ---------------------------------------------------------
   シャッフル関数
--------------------------------------------------------- */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------------------------------------------------------
   問題生成
--------------------------------------------------------- */
function generateQuestions() {
  let list = [];

  if (count === "unit") {
    list = words.filter(w => w.unit === selectedUnit);
  } else {
    list = [...words];
  }

  list = shuffle(list);

  if (count !== "all" && count !== "unit") {
    list = list.slice(0, Number(count));
  }

  questions = list;
}

/* ---------------------------------------------------------
   問題表示
--------------------------------------------------------- */
function renderQuestion() {
  const q = questions[index];

  if (mode === "en-ja") {
    questionEl.textContent = `${index + 1}. ${q.english}`;
  } else {
    questionEl.textContent = `${index + 1}. ${q.japanese}`;
  }

  answerInput.value = "";
  answerInput.focus();
  feedbackEl.textContent = "";
}

/* ---------------------------------------------------------
   回答判定
--------------------------------------------------------- */
function normalizeAnswer(value) {
  return value.trim().replace(/[\s　]+/g, "").toLowerCase();
}

function getBaseFormFromJapanese(text) {
  if (!text) return "";
  const cleaned = text.replace(/[\s　]+/g, "");
  const parts = cleaned.split("の");
  if (parts.length > 1) {
    const candidate = parts[0].trim();
    if (candidate) return candidate;
  }
  return "";
}

function isCorrectAnswer(userAnswer, q) {
  const normalizedUser = normalizeAnswer(userAnswer);

  if (mode === "ja-en") {
    return normalizedUser === normalizeAnswer(q.english);
  }

  const correctAnswer = normalizeAnswer(q.japanese);
  if (normalizedUser === correctAnswer) {
    return true;
  }

  const needsBaseForm = /過去分詞|過去形/.test(q.japanese);
  if (needsBaseForm) {
    const baseForm = getBaseFormFromJapanese(q.japanese);
    if (baseForm) {
      return normalizedUser === normalizeAnswer(baseForm);
    }
  }

  return false;
}

function checkAnswer() {
  const q = questions[index];
  const userAnswer = answerInput.value.trim();

  const correctAnswer = mode === "en-ja" ? q.japanese : q.english;

  if (isCorrectAnswer(userAnswer, q)) {
    feedbackEl.textContent = "正解！";
    feedbackEl.style.color = "var(--main)";
    correctCount++;
  } else {
    feedbackEl.textContent = `不正解：正解は「${correctAnswer}」`;
    feedbackEl.style.color = "var(--accent)";
    wrongList.push({
      question: mode === "en-ja" ? q.english : q.japanese,
      correct: correctAnswer,
      user: userAnswer
    });
  }

  // 次の問題へ
  index++;

  if (index < questions.length) {
    setTimeout(renderQuestion, 600);
  } else {
    setTimeout(showResult, 600);
  }
}

/* ---------------------------------------------------------
   結果表示
--------------------------------------------------------- */
function showResult() {
  testArea.style.display = "none";
  resultArea.style.display = "block";

  const total = questions.length;
  const rate = Math.floor((correctCount / total) * 100);

  scoreEl.textContent = `得点：${correctCount} / ${total}`;
  rateEl.textContent = `正答率：${rate}%`;

  // LocalStorageに正答率保存
  Storage.set("accuracy", rate);

  // 間違えた問題一覧
  wrongListEl.innerHTML = "";
  wrongList.forEach(w => {
    const li = document.createElement("li");
    li.textContent = `${w.question} → 正解: ${w.correct} / あなた: ${w.user}`;
    wrongListEl.appendChild(li);
  });
}

/* ---------------------------------------------------------
   テスト開始
--------------------------------------------------------- */
startBtn.addEventListener("click", () => {
  index = 0;
  correctCount = 0;
  wrongList = [];

  generateQuestions();

  testArea.style.display = "block";
  resultArea.style.display = "none";

  renderQuestion();
});

/* ---------------------------------------------------------
   回答ボタン
--------------------------------------------------------- */
submitBtn.addEventListener("click", checkAnswer);

/* ---------------------------------------------------------
   もう一度テスト
--------------------------------------------------------- */
retryBtn.addEventListener("click", () => {
  index = 0;
  correctCount = 0;
  wrongList = [];

  testArea.style.display = "block";
  resultArea.style.display = "none";

  renderQuestion();
});

/* ---------------------------------------------------------
   キーボード操作
   Enter → 回答
   ArrowRight → 次の問題（回答後）
--------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    submitBtn.click();
  }
});

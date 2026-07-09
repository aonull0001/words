/* =========================================================
   English Notebook - unit.js
   Unitページ専用ロジック
   単語表示 / 発音 / 苦手登録 / ナビゲーション
   ========================================================= */

/* ---------------------------------------------------------
   URLパラメータから unit を取得
--------------------------------------------------------- */
function getUnitNumber() {
  const params = new URLSearchParams(location.search);
  const unit = Number(params.get("unit"));
  return unit >= 1 && unit <= 9 ? unit : 1;
}

/* ---------------------------------------------------------
   Unit内の単語一覧を取得
--------------------------------------------------------- */
function getWordsInUnit(unit) {
  return words.filter(w => w.unit === unit);
}

/* ---------------------------------------------------------
   DOM取得
--------------------------------------------------------- */
const numEl = document.getElementById("wordNumber");
const enEl = document.getElementById("wordEnglish");
const jaEl = document.getElementById("wordJapanese");

const showMeaningBtn = document.getElementById("showMeaningBtn");
const pronounceBtn = document.getElementById("pronounceBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* ---------------------------------------------------------
   状態
--------------------------------------------------------- */
const unit = getUnitNumber();
const unitWords = getWordsInUnit(unit);
let index = 0;

/* ---------------------------------------------------------
   単語表示
--------------------------------------------------------- */
function renderWord() {
  const w = unitWords[index];

  numEl.textContent = `No.${w.id}`;
  enEl.textContent = w.english;
  jaEl.textContent = w.japanese;
  jaEl.style.display = "none"; // 初期は非表示

  // 苦手登録済みならボタン文言変更
  const favorites = Storage.get("favorites", []);
  favoriteBtn.textContent = favorites.includes(w.id)
    ? "苦手から削除"
    : "苦手に追加";
}

/* ---------------------------------------------------------
   意味表示
--------------------------------------------------------- */
showMeaningBtn.addEventListener("click", () => {
  jaEl.style.display = "block";
});

/* ---------------------------------------------------------
   発音（SpeechSynthesis API）
--------------------------------------------------------- */
pronounceBtn.addEventListener("click", () => {
  const text = enEl.textContent;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
});

/* ---------------------------------------------------------
   苦手登録
--------------------------------------------------------- */
favoriteBtn.addEventListener("click", () => {
  const w = unitWords[index];
  let favorites = Storage.get("favorites", []);

  if (favorites.includes(w.id)) {
    favorites = favorites.filter(id => id !== w.id);
    favoriteBtn.textContent = "苦手に追加";
  } else {
    favorites.push(w.id);
    favoriteBtn.textContent = "苦手から削除";
  }

  Storage.set("favorites", favorites);
});

/* ---------------------------------------------------------
   前へ / 次へ
--------------------------------------------------------- */
prevBtn.addEventListener("click", () => {
  if (index > 0) {
    index--;
    renderWord();
  }
});

nextBtn.addEventListener("click", () => {
  if (index < unitWords.length - 1) {
    index++;
    renderWord();
  }
});

/* ---------------------------------------------------------
   学習数カウント（1単語表示につき1加算）
--------------------------------------------------------- */
function countLearning() {
  let learned = Storage.get("learnedCount", 0);
  learned++;
  Storage.set("learnedCount", learned);

  // 今日の学習数
  addDailyLearning();
}

/* ---------------------------------------------------------
   キーボード操作
   ← → : 前へ / 次へ
   Enter / Space : 意味表示
--------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    prevBtn.click();
  } else if (e.key === "ArrowRight") {
    nextBtn.click();
  } else if (e.key === "Enter" || e.key === " ") {
    showMeaningBtn.click();
  }
});

/* ---------------------------------------------------------
   初期化
--------------------------------------------------------- */
function initUnitPage() {
  renderWord();
  countLearning();
}

document.addEventListener("DOMContentLoaded", initUnitPage);

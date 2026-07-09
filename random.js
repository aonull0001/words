/* =========================================================
   English Notebook - random.js
   ランダム学習ロジック
   ========================================================= */

/* ---------------------------------------------------------
   DOM取得
--------------------------------------------------------- */
const rangeRadios = document.querySelectorAll("input[name='range']");
const unitSelect = document.getElementById("unitSelect");
const unitSelectBox = document.getElementById("randomUnitSelect");

const startBtn = document.getElementById("startRandomBtn");

const card = document.getElementById("randomCard");
const numEl = document.getElementById("randomNumber");
const enEl = document.getElementById("randomEnglish");
const jaEl = document.getElementById("randomJapanese");

const showMeaningBtn = document.getElementById("showMeaningBtn");
const pronounceBtn = document.getElementById("pronounceBtn");
const nextBtn = document.getElementById("nextRandomBtn");

/* ---------------------------------------------------------
   状態
--------------------------------------------------------- */
let mode = "all";       // all / unit / favorites
let selectedUnit = 1;
let list = [];          // 出題リスト
let index = 0;

/* ---------------------------------------------------------
   ラジオボタン監視
--------------------------------------------------------- */
rangeRadios.forEach(r => {
  r.addEventListener("change", () => {
    mode = r.value;
    unitSelectBox.style.display = (mode === "unit") ? "block" : "none";
  });
});

unitSelect.addEventListener("change", () => {
  selectedUnit = Number(unitSelect.value);
});

/* ---------------------------------------------------------
   シャッフル
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
   出題リスト生成
--------------------------------------------------------- */
function generateList() {
  if (mode === "all") {
    list = shuffle(words);
  } else if (mode === "unit") {
    list = shuffle(words.filter(w => w.unit === selectedUnit));
  } else if (mode === "favorites") {
    const fav = Storage.get("favorites", []);
    list = shuffle(words.filter(w => fav.includes(w.id)));
  }

  if (list.length === 0) {
    alert("対象の単語がありません。");
    return false;
  }

  return true;
}

/* ---------------------------------------------------------
   単語表示
--------------------------------------------------------- */
function renderWord() {
  const w = list[index];

  numEl.textContent = `No.${w.id}`;
  enEl.textContent = w.english;
  jaEl.textContent = w.japanese;
  jaEl.style.display = "none"; // 初期は非表示
}

/* ---------------------------------------------------------
   意味表示
--------------------------------------------------------- */
showMeaningBtn.addEventListener("click", () => {
  jaEl.style.display = "block";
});

/* ---------------------------------------------------------
   発音
--------------------------------------------------------- */
pronounceBtn.addEventListener("click", () => {
  const utter = new SpeechSynthesisUtterance(enEl.textContent);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
});

/* ---------------------------------------------------------
   次の単語へ
--------------------------------------------------------- */
nextBtn.addEventListener("click", () => {
  index++;
  if (index >= list.length) {
    index = 0; // ループ
  }
  renderWord();
  addDailyLearning();
});

/* ---------------------------------------------------------
   スタート
--------------------------------------------------------- */
startBtn.addEventListener("click", () => {
  if (!generateList()) return;

  index = 0;
  card.style.display = "block";
  renderWord();
  addDailyLearning();
});

/* ---------------------------------------------------------
   キーボード操作
   Enter / Space → 意味表示
   → → 次の単語
--------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    showMeaningBtn.click();
  } else if (e.key === "ArrowRight") {
    nextBtn.click();
  }
});

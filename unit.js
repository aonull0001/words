/* =========================================================
   Unit学習：順番通り＋最後はホームへ戻る
========================================================= */

const card = document.getElementById("card");
const enEl = document.getElementById("wordEnglish");
const jaEl = document.getElementById("wordJapanese");
const numEl = document.getElementById("wordNumber");

const showMeaningBtn = document.getElementById("showMeaningBtn");
const pronounceBtn = document.getElementById("pronounceBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

/* -----------------------------
   Unitデータ取得（ランダムなし）
----------------------------- */
const params = new URLSearchParams(location.search);
const unit = Number(params.get("unit") || 1);
let unitWords = words.filter(w => w.unit === unit);

let index = 0;

/* -----------------------------
   単語表示
----------------------------- */
function renderWord() {
  const w = unitWords[index];
  enEl.textContent = w.english;
  jaEl.textContent = w.japanese;
  numEl.textContent = `No.${w.id}`;
  jaEl.style.display = "none";

  const fav = Storage.get("favorites", []);
  favoriteBtn.textContent = fav.includes(w.id)
    ? "苦手から削除"
    : "苦手に追加";
}

/* -----------------------------
   スライドアニメーション
----------------------------- */
function slideToNext() {
  card.style.transition = "0.3s";
  card.style.transform = "translateX(300px)";
  card.style.opacity = "0";

  setTimeout(() => {
    index++;

    // ★ Unitの最後まで来たらホームへ戻る
    if (index >= unitWords.length) {
      location.href = "index.html"; // ← ホームへ戻る
      return;
    }

    renderWord();

    card.style.transition = "";
    card.style.transform = "translateX(-300px)";
    card.style.opacity = "0";

    setTimeout(() => {
      card.style.transition = "0.3s";
      card.style.transform = "translateX(0px)";
      card.style.opacity = "1";
    }, 20);
  }, 300);
}

/* -----------------------------
   キーボード操作
----------------------------- */
document.addEventListener("keydown", (e) => {
  // → 次の単語（スライド）
  if (e.key === "ArrowRight") {
    slideToNext();
  }

  // Enter / Space → 意味表示
  if (e.key === "Enter" || e.key === " ") {
    jaEl.style.display = "flex";
  }

  // P → 発音
  if (e.key.toLowerCase() === "p") {
    const utter = new SpeechSynthesisUtterance(enEl.textContent);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  }

  // F → 苦手追加/解除
  if (e.key.toLowerCase() === "f") {
    const w = unitWords[index];
    let fav = Storage.get("favorites", []);

    if (fav.includes(w.id)) {
      fav = fav.filter(id => id !== w.id);
      favoriteBtn.textContent = "苦手に追加";
    } else {
      fav.push(w.id);
      favoriteBtn.textContent = "苦手から削除";
    }

    Storage.set("favorites", fav);
  }
});

/* -----------------------------
   初期化
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderWord();
});

/* =========================================================
   Unit学習：順番通り＋スマホタップ/スワイプ対応
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
let dragStartX = 0;
let dragCurrentX = 0;
let isDragging = false;

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

function showMeaning() {
  jaEl.style.display = "flex";
}

function speakWord() {
  const utter = new SpeechSynthesisUtterance(enEl.textContent);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

function toggleFavorite() {
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

function resetCardPosition() {
  card.style.transition = "transform 0.25s ease, opacity 0.25s ease";
  card.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
  card.style.opacity = "1";
}

/* -----------------------------
   スライドアニメーション
----------------------------- */
function slideToNext() {
  card.style.transition = "transform 0.25s ease, opacity 0.25s ease";
  card.style.transform = "translate3d(320px, 0, 0)";
  card.style.opacity = "0";

  setTimeout(() => {
    index++;

    if (index >= unitWords.length) {
      location.href = "index.html";
      return;
    }

    renderWord();
    card.style.transition = "transform 0.25s ease, opacity 0.25s ease";
    card.style.transform = "translate3d(-320px, 0, 0)";
    card.style.opacity = "0";

    requestAnimationFrame(() => {
      card.style.transform = "translate3d(0, 0, 0)";
      card.style.opacity = "1";
    });
  }, 240);
}

/* -----------------------------
   タッチ / マウス操作
----------------------------- */
function handlePointerStart(e) {
  isDragging = true;
  dragStartX = e.clientX;
  dragCurrentX = 0;
  card.style.transition = "none";
}

function handlePointerMove(e) {
  if (!isDragging) return;
  dragCurrentX = e.clientX - dragStartX;
  const delta = Math.max(-220, Math.min(220, dragCurrentX));
  card.style.transform = `translate3d(${delta}px, 0, 0) rotate(${delta / 20}deg)`;
  card.style.opacity = String(Math.max(0.72, 1 - Math.abs(delta) / 360));
}

function handlePointerEnd() {
  if (!isDragging) return;
  isDragging = false;

  if (dragCurrentX > 80) {
    slideToNext();
    return;
  }

  if (Math.abs(dragCurrentX) < 8) {
    showMeaning();
  }

  resetCardPosition();
}

/* -----------------------------
   ボタン処理
----------------------------- */
showMeaningBtn.addEventListener("click", showMeaning);
pronounceBtn.addEventListener("click", speakWord);
favoriteBtn.addEventListener("click", toggleFavorite);

/* -----------------------------
   カード操作
----------------------------- */
card.addEventListener("pointerdown", handlePointerStart);
card.addEventListener("pointermove", handlePointerMove);
card.addEventListener("pointerup", handlePointerEnd);
card.addEventListener("pointerleave", handlePointerEnd);
card.addEventListener("pointercancel", handlePointerEnd);

/* -----------------------------
   キーボード操作
----------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    slideToNext();
  }

  if (e.key === "Enter" || e.key === " ") {
    showMeaning();
  }

  if (e.key.toLowerCase() === "p") {
    speakWord();
  }

  if (e.key.toLowerCase() === "f") {
    toggleFavorite();
  }
});

/* -----------------------------
   初期化
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderWord();
});

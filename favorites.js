/* =========================================================
   English Notebook - favorites.js
   苦手単語一覧ページのロジック
   ========================================================= */

/* ---------------------------------------------------------
   DOM取得
--------------------------------------------------------- */
const listEl = document.getElementById("favoritesList");

/* ---------------------------------------------------------
   苦手単語一覧を取得
--------------------------------------------------------- */
function getFavoriteWords() {
  const favIds = Storage.get("favorites", []);
  return words.filter(w => favIds.includes(w.id));
}

/* ---------------------------------------------------------
   苦手解除
--------------------------------------------------------- */
function removeFavorite(id) {
  let fav = Storage.get("favorites", []);
  fav = fav.filter(f => f !== id);
  Storage.set("favorites", fav);
  renderFavorites(); // 再描画
}

/* ---------------------------------------------------------
   発音
--------------------------------------------------------- */
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

/* ---------------------------------------------------------
   一覧描画
--------------------------------------------------------- */
function renderFavorites() {
  const favWords = getFavoriteWords();
  listEl.innerHTML = "";

  if (favWords.length === 0) {
    listEl.innerHTML = `<p style="color:var(--text-sub);">苦手単語は登録されていません。</p>`;
    return;
  }

  favWords.forEach(w => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.marginTop = "12px";

    card.innerHTML = `
      <strong>No.${w.id} ${w.english}</strong><br>
      <span>${w.japanese}</span>

      <div style="margin-top:12px; display:flex; gap:10px;">
        <button class="secondary-button pronounce-btn">発音</button>
        <button class="primary-button remove-btn">苦手解除</button>
      </div>
    `;

    // 発音ボタン
    card.querySelector(".pronounce-btn").addEventListener("click", () => {
      speak(w.english);
    });

    // 苦手解除ボタン
    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFavorite(w.id);
    });

    listEl.appendChild(card);
  });
}

/* ---------------------------------------------------------
   キーボード操作
   Enter → 最初のカードの意味表示（今回は発音）
   → → 次のカードへ（スクロール）
--------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  const cards = document.querySelectorAll("#favoritesList .card");
  if (cards.length === 0) return;

  if (e.key === "Enter") {
    // 最初のカードの発音
    const firstPronounce = cards[0].querySelector(".pronounce-btn");
    if (firstPronounce) firstPronounce.click();
  }

  if (e.key === "ArrowRight") {
    // 次のカードへスクロール
    const nextCard = cards[1];
    if (nextCard) {
      nextCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});

/* ---------------------------------------------------------
   初期化
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderFavorites();
});

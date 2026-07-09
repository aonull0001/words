/* =========================================================
   English Notebook - settings.js
   設定ページのロジック
   ========================================================= */

/* ---------------------------------------------------------
   DOM取得
--------------------------------------------------------- */
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const resetLearningBtn = document.getElementById("resetLearningBtn");
const resetFavoritesBtn = document.getElementById("resetFavoritesBtn");
const resetLastPageBtn = document.getElementById("resetLastPageBtn");

/* ---------------------------------------------------------
   ダークモード切り替え
--------------------------------------------------------- */
toggleThemeBtn.addEventListener("click", () => {
  const current = document.body.dataset.theme;
  const next = current === "light" ? "dark" : "light";
  document.body.dataset.theme = next;
  Storage.set("theme", next);
});

/* ---------------------------------------------------------
   学習履歴リセット
   learnedCount / accuracy / daily
--------------------------------------------------------- */
resetLearningBtn.addEventListener("click", () => {
  if (!confirm("学習履歴をすべてリセットしますか？")) return;

  Storage.set("learnedCount", 0);
  Storage.set("accuracy", 0);

  const today = new Date().toISOString().slice(0, 10);
  Storage.set("daily", { date: today, count: 0 });

  alert("学習履歴をリセットしました。");
});

/* ---------------------------------------------------------
   苦手単語リセット
--------------------------------------------------------- */
resetFavoritesBtn.addEventListener("click", () => {
  if (!confirm("苦手単語をすべて削除しますか？")) return;

  Storage.set("favorites", []);
  alert("苦手単語をリセットしました。");
});

/* ---------------------------------------------------------
   最後に開いたページリセット
--------------------------------------------------------- */
resetLastPageBtn.addEventListener("click", () => {
  if (!confirm("最後に開いたページの記録を削除しますか？")) return;

  Storage.set("lastPage", "");
  alert("最後に開いたページをリセットしました。");
});

/* ---------------------------------------------------------
   初期化（特になし）
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // 設定ページは特別な初期化は不要
});

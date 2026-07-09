/* =========================================================
   English Notebook - progress.js
   学習状況ページのロジック
   ========================================================= */

/* ---------------------------------------------------------
   DOM取得
--------------------------------------------------------- */
const totalEl = document.getElementById("statTotalLearned");
const unitRateEl = document.getElementById("statUnitRate");
const accuracyEl = document.getElementById("statAccuracy");
const favoritesEl = document.getElementById("statFavorites");
const dailyEl = document.getElementById("statDaily");

const unitBar = document.getElementById("unitProgressBar");
const accuracyBar = document.getElementById("accuracyProgressBar");

/* ---------------------------------------------------------
   統計データ取得
--------------------------------------------------------- */
function loadStats() {
  const learned = Storage.get("learnedCount", 0);
  const accuracy = Storage.get("accuracy", 0);
  const favorites = Storage.get("favorites", []);
  const daily = Storage.get("daily", { date: "", count: 0 }).count;

  // Unit達成率（学習数 / 102）
  const unitRate = Math.floor((learned / 102) * 100);

  return {
    learned,
    unitRate,
    accuracy,
    favoritesCount: favorites.length,
    daily
  };
}

/* ---------------------------------------------------------
   統計表示
--------------------------------------------------------- */
function renderStats() {
  const stats = loadStats();

  totalEl.textContent = stats.learned;
  unitRateEl.textContent = stats.unitRate + "%";
  accuracyEl.textContent = stats.accuracy + "%";
  favoritesEl.textContent = stats.favoritesCount;
  dailyEl.textContent = stats.daily;

  // バー反映
  unitBar.style.width = stats.unitRate + "%";
  accuracyBar.style.width = stats.accuracy + "%";
}

/* ---------------------------------------------------------
   初期化
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderStats();
});

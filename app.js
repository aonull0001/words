/* =========================================================
   English Notebook - app.js
   共通ロジック（全ページで使用）
   LocalStorage / ダークモード / 検索 / 統計
   ========================================================= */

/* ---------------------------------------------------------
   LocalStorageラッパー
--------------------------------------------------------- */
const Storage = {
  get(key, defaultValue) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error("Storage get error:", e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage set error:", e);
    }
  }
};

/* ---------------------------------------------------------
   ダークモード
--------------------------------------------------------- */
function initTheme() {
  const savedTheme = Storage.get("theme", "light");
  document.body.dataset.theme = savedTheme;

  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.body.dataset.theme;
      const next = current === "light" ? "dark" : "light";
      document.body.dataset.theme = next;
      Storage.set("theme", next);
    });
  }
}

/* ---------------------------------------------------------
   最後に開いたページを保存
--------------------------------------------------------- */
function saveLastPage() {
  Storage.set("lastPage", location.pathname);
}

/* ---------------------------------------------------------
   今日の学習数（毎日リセット）
--------------------------------------------------------- */
function initDailyLearning() {
  const today = new Date().toISOString().slice(0, 10);
  const saved = Storage.get("daily", { date: today, count: 0 });

  if (saved.date !== today) {
    Storage.set("daily", { date: today, count: 0 });
    return 0;
  }
  return saved.count;
}

function addDailyLearning() {
  const today = new Date().toISOString().slice(0, 10);
  const saved = Storage.get("daily", { date: today, count: 0 });
  saved.count++;
  Storage.set("daily", saved);
}

/* ---------------------------------------------------------
   Unit一覧生成（index.html）
--------------------------------------------------------- */
function renderUnitList() {
  const container = document.getElementById("unitList");
  if (!container) return;

  for (let i = 1; i <= 9; i++) {
    const a = document.createElement("a");
    a.href = `unit.html?unit=${i}`;
    a.textContent = `Unit ${i}`;
    container.appendChild(a);
  }
}

/* ---------------------------------------------------------
   検索機能（英語・日本語）
--------------------------------------------------------- */
function initSearch() {
  const inputEn = document.getElementById("searchEnglish");
  const inputJa = document.getElementById("searchJapanese");
  const results = document.getElementById("searchResults");

  if (!inputEn || !inputJa || !results) return;

  function updateSearch() {
    const en = inputEn.value.trim().toLowerCase();
    const ja = inputJa.value.trim();

    const filtered = words.filter(w => {
      const matchEn = en ? w.english.toLowerCase().includes(en) : true;
      const matchJa = ja ? w.japanese.includes(ja) : true;
      return matchEn && matchJa;
    });

    results.innerHTML = "";

    filtered.forEach(w => {
      const div = document.createElement("div");
      div.className = "card";
      div.style.marginTop = "8px";
      div.innerHTML = `
        <strong>${w.id}. ${w.english}</strong><br>
        <span>${w.japanese}</span>
      `;
      results.appendChild(div);
    });
  }

  inputEn.addEventListener("input", updateSearch);
  inputJa.addEventListener("input", updateSearch);
}

/* ---------------------------------------------------------
   統計表示（index.html）
--------------------------------------------------------- */
function renderStats() {
  const statTotal = document.getElementById("statTotalLearned");
  const statUnitRate = document.getElementById("statUnitRate");
  const statAccuracy = document.getElementById("statAccuracy");
  const statFavorites = document.getElementById("statFavorites");

  const learned = Storage.get("learnedCount", 0);
  const accuracy = Storage.get("accuracy", 0);
  const favorites = Storage.get("favorites", []);

  if (statTotal) statTotal.textContent = learned;
  if (statAccuracy) statAccuracy.textContent = accuracy + "%";
  if (statFavorites) statFavorites.textContent = favorites.length;

  // Unit達成率（学習数 / 102）
  if (statUnitRate) {
    const rate = Math.floor((learned / 102) * 100);
    statUnitRate.textContent = rate + "%";
  }
}

/* ---------------------------------------------------------
   今日の学習数表示
--------------------------------------------------------- */
function renderDailyCount() {
  const el = document.getElementById("todayLearnedCount");
  if (!el) return;
  el.textContent = initDailyLearning();
}

/* ---------------------------------------------------------
   フッターの年
--------------------------------------------------------- */
function renderFooterYear() {
  const y = document.getElementById("footerYear");
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   ページ共通初期化
--------------------------------------------------------- */
function initApp() {
  initTheme();
  saveLastPage();
  renderFooterYear();

  // index.html 専用
  renderUnitList();
  initSearch();
  renderStats();
  renderDailyCount();
}

/* ---------------------------------------------------------
   実行
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", initApp);

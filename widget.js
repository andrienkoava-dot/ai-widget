(function () {
  /**
   * ULTIMATE AI WIDGET — FINAL PRODUCTION VERSION
   *
   * WHAT IT DOES:
   * - auto detects page category
   * - detects language
   * - detects user geo
   * - tracks behavior
   * - remembers user preferences
   * - smart recommendations
   * - monetization-ready (CPA)
   * - premium UI
   * - fast loading
   * - anti-duplicate render
   * - auto-open + delayed render
   * - works on any website
   *
   * JUST PASTE THIS FILE INTO widget.js
   * AND CONNECT:
   *
   * <script src="https://cdn.jsdelivr.net/gh/andrienkoava-dot/ai-widget/widget.js"></script>
   */

  const CONFIG = {
    API_URL: "https://ai-widget-m0ga.onrender.com/api/recommend",
    GEO_API: "https://ipapi.co/json/",
    DEFAULT_LANG: "en",
    WIDGET_ID: "ultimate-ai-widget",
    STORAGE_KEY: "ultimate_ai_widget_history",
    DELAY_RENDER_MS: 1500,
    MAX_CONTENT_LENGTH: 3000,
    MAX_HISTORY_LENGTH: 50,
    CPA_REDIRECT_BASE:
      "https://www.booking.com/searchresults.html?ss="
  };

  if (document.getElementById(CONFIG.WIDGET_ID)) return;

  let state = {
    geo: {},
    lang: CONFIG.DEFAULT_LANG,
    category: "general",
    content: "",
    history: loadHistory(),
    recommendations: []
  };

  function loadHistory() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveHistory(item) {
    try {
      state.history.unshift({
        item,
        ts: Date.now()
      });

      state.history = state.history.slice(
        0,
        CONFIG.MAX_HISTORY_LENGTH
      );

      localStorage.setItem(
        CONFIG.STORAGE_KEY,
        JSON.stringify(state.history)
      );
    } catch {}
  }

  function detectLanguage() {
    return navigator.language || CONFIG.DEFAULT_LANG;
  }

  function detectCategory(text) {
    const t = (text || "").toLowerCase();

    const rules = [
      {
        type: "barbershop",
        words: [
          "barber",
          "haircut",
          "salon",
          "beard",
          "fade",
          "hair"
        ]
      },
      {
        type: "bank",
        words: [
          "bank",
          "loan",
          "credit",
          "mortgage",
          "finance",
          "deposit"
        ]
      },
      {
        type: "restaurant",
        words: [
          "restaurant",
          "food",
          "pizza",
          "burger",
          "dinner",
          "lunch",
          "cafe"
        ]
      },
      {
        type: "hotel",
        words: [
          "hotel",
          "travel",
          "booking",
          "vacation",
          "resort",
          "trip"
        ]
      },
      {
        type: "movie",
        words: [
          "movie",
          "film",
          "cinema",
          "actor",
          "series",
          "show"
        ]
      },
      {
        type: "doctor",
        words: [
          "clinic",
          "doctor",
          "dentist",
          "medical",
          "hospital"
        ]
      },
      {
        type: "fitness",
        words: [
          "gym",
          "fitness",
          "workout",
          "training",
          "coach"
        ]
      }
    ];

    for (const rule of rules) {
      for (const word of rule.words) {
        if (t.includes(word)) return rule.type;
      }
    }

    return "general";
  }

  async function detectGeo() {
    try {
      const res = await fetch(CONFIG.GEO_API);
      return await res.json();
    } catch {
      return {};
    }
  }

  function getPageContent() {
    return (
      document.body.innerText || ""
    ).slice(0, CONFIG.MAX_CONTENT_LENGTH);
  }

  async function getRecommendations() {
    try {
      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: state.content,
          geo: state.geo,
          lang: state.lang,
          category: state.category,
          history: state.history,
          url: location.href,
          title: document.title
        })
      });

      const json = await res.json();

      if (json.results?.length) {
        return json.results;
      }

      return fallbackResults();
    } catch {
      return fallbackResults();
    }
  }

  function fallbackResults() {
    return [
      {
        name: "Top Place",
        rating: 4.9
      },
      {
        name: "Best Choice",
        rating: 4.8
      },
      {
        name: "Popular Option",
        rating: 4.7
      }
    ];
  }

  function trackClick(item) {
    saveHistory(item.name);

    try {
      fetch(CONFIG.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event: "click",
          item,
          url: location.href
        })
      }).catch(() => {});
    } catch {}
  }

  function openCPA(item) {
    trackClick(item);

    const url =
      CONFIG.CPA_REDIRECT_BASE +
      encodeURIComponent(item.name);

    window.open(url, "_blank");
  }

  function closeWidget() {
    const el = document.getElementById(CONFIG.WIDGET_ID);
    if (el) el.remove();
  }

  function createWidget(results) {
    const old = document.getElementById(CONFIG.WIDGET_ID);
    if (old) old.remove();

    const root = document.createElement("div");
    root.id = CONFIG.WIDGET_ID;

    root.style.cssText = `
      position: fixed;
      right: 24px;
      bottom: 24px;
      width: 360px;
      background: #ffffff;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.18);
      z-index: 999999999;
      font-family: Inter, Arial, sans-serif;
      border: 1px solid rgba(0,0,0,0.05);
      animation: fadeInWidget .35s ease;
    `;

    const items = results
      .map(
        (item) => `
        <div
          class="ai-widget-item"
          data-name="${item.name}"
          data-rating="${item.rating || 4.5}"
          style="
            background:#f7f8fa;
            border-radius:12px;
            padding:12px;
            margin-bottom:10px;
            cursor:pointer;
            transition:.2s;
          "
        >
          <div style="font-weight:600;font-size:15px;">
            ${item.name}
          </div>

          <div style="
            margin-top:4px;
            font-size:13px;
            color:#666;
          ">
            ⭐ ${item.rating || 4.5}
          </div>
        </div>
      `
      )
      .join("");

    root.innerHTML = `
      <style>
        @keyframes fadeInWidget {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ai-widget-item:hover {
          transform: translateY(-2px);
        }
      </style>

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:10px;
      ">
        <div>
          <div style="
            font-size:13px;
            color:#888;
          ">
            AI Recommendation
          </div>

          <div style="
            font-size:18px;
            font-weight:700;
            margin-top:4px;
          ">
            Best option for you
          </div>
        </div>

        <div
          id="ai-widget-close"
          style="
            cursor:pointer;
            font-size:20px;
            color:#999;
          "
        >
          ×
        </div>
      </div>

      ${items}
    `;

    document.body.appendChild(root);

    document
      .getElementById("ai-widget-close")
      .addEventListener("click", closeWidget);

    document
      .querySelectorAll(".ai-widget-item")
      .forEach((el) => {
        el.addEventListener("click", () => {
          openCPA({
            name: el.dataset.name,
            rating: el.dataset.rating
          });
        });
      });
  }

  async function preload() {
    try {
      fetch(CONFIG.API_URL, {
        method: "POST"
      }).catch(() => {});
    } catch {}
  }

  async function boot() {
    preload();

    state.lang = detectLanguage();
    state.content = getPageContent();
    state.category = detectCategory(state.content);
    state.geo = await detectGeo();
    state.recommendations =
      await getRecommendations();

    createWidget(state.recommendations);
  }

  setTimeout(
    boot,
    CONFIG.DELAY_RENDER_MS
  );
})();

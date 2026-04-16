(function () {
  const API = "https://ai-widget-m0ga.onrender.com/api/recommend";

  let userHistory = JSON.parse(localStorage.getItem("ai_history") || "[]");

  async function init() {
    try {
      const geo = await getGeo();
      const content = document.body.innerText.slice(0, 2000);
      const category = detectCategory(content);
      const lang = detectLanguage();

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content,
          geo,
          category,
          lang,
          history: userHistory
        })
      });

      const data = await res.json();
      render(data.results);
    } catch (e) {
      console.error("Widget error:", e);
    }
  }

  function detectLanguage() {
    return navigator.language || "en";
  }

  function detectCategory(text) {
    text = text.toLowerCase();

    if (text.includes("barber") || text.includes("hair")) return "barbershop";
    if (text.includes("bank") || text.includes("loan")) return "bank";
    if (text.includes("movie") || text.includes("film")) return "movie";
    if (text.includes("restaurant") || text.includes("food")) return "restaurant";
    if (text.includes("hotel") || text.includes("travel")) return "hotel";

    return "general";
  }

  async function getGeo() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      return await res.json();
    } catch {
      return {};
    }
  }

  function trackClick(name) {
    userHistory.push(name);
    localStorage.setItem("ai_history", JSON.stringify(userHistory));
  }

  function render(results) {
    const existing = document.getElementById("ai-widget");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.id = "ai-widget";

    box.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 340px;
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, Arial;
      animation: fadeIn 0.4s ease;
    `;

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-size:14px;color:#888">AI Recommendation</div>
        <div style="cursor:pointer;font-size:18px" onclick="this.parentElement.parentElement.remove()">×</div>
      </div>

      <div style="font-weight:600;margin-bottom:12px">
        Best option for you
      </div>

      ${results.map(r => `
        <div style="
          margin-bottom:10px;
          padding:10px;
          border-radius:10px;
          background:#f7f7f7;
          cursor:pointer;
          transition:0.2s;
        "
        onclick="
          window.open('https://www.booking.com/searchresults.html?ss=${r.name}');
          (function(){
            let h = JSON.parse(localStorage.getItem('ai_history')||'[]');
            h.push('${r.name}');
            localStorage.setItem('ai_history', JSON.stringify(h));
          })();
        "
        >
          <div style="font-weight:600">${r.name}</div>
          <div style="font-size:13px;color:#666">
            ⭐ ${r.rating || 4.5}
          </div>
        </div>
      `).join("")}
    `;

    document.body.appendChild(box);
  }

  function preload() {
    fetch(API, { method: "POST" }).catch(() => {});
  }

  preload();
  setTimeout(init, 1200);
})();

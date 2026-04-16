(function () {
  const API = "https://ai-widget-m0ga.onrender.com/api/recommend";

  async function init() {
    const geo = await getGeo();
    const content = document.body.innerText.slice(0, 1500);
    const category = detectCategory(content);

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content,
        geo,
        category
      })
    });

    const data = await res.json();
    render(data.results);
  }

  function detectCategory(text) {
    text = text.toLowerCase();

    if (text.includes("barber") || text.includes("hair")) return "barbershop";
    if (text.includes("bank") || text.includes("loan")) return "bank";
    if (text.includes("movie") || text.includes("film")) return "movie";
    if (text.includes("restaurant") || text.includes("food")) return "restaurant";

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

  function render(results) {
    const box = document.createElement("div");

    box.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 320px;
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont;
      animation: fadeIn 0.4s ease;
    `;

    box.innerHTML = `
      <div style="font-size:14px;color:#888;margin-bottom:5px">
        AI Recommendation
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
        onclick="window.open('https://google.com/search?q=${r.name}')"
        >
          <div style="font-weight:600">${r.name}</div>
          <div style="font-size:13px;color:#666">
            ⭐ ${r.rating}
          </div>
        </div>
      `).join("")}
    `;

    document.body.appendChild(box);
  }

  init();
})();

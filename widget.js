(function () {
  const API = "https://ai-widget-m0ga.onrender.com"

  async function init() {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: document.body.innerText.slice(0, 1000)
        })
      })

      const data = await res.json()

      showWidget(data.results)
    } catch (e) {
      console.error("Widget error:", e)
    }
  }

  function showWidget(results) {
    const box = document.createElement('div')

    box.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      background: white;
      border-radius: 12px;
      padding: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 99999;
      font-family: Arial;
    `

    box.innerHTML = `
      <div style="font-weight:bold;margin-bottom:10px">
        🔥 Recommended for you
      </div>
      ${results.map(r => `
        <div style="margin-bottom:10px;padding:8px;border-radius:8px;background:#f5f5f5;cursor:pointer">
          <b>${r.name}</b><br/>
          ⭐ ${r.rating}
        </div>
      `).join('')}
    `

    document.body.appendChild(box)
  }

  init()
})()

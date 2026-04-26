(function () {
  if (window.vlanWidgetLoaded) return;
  window.vlanWidgetLoaded = true;

  const style = document.createElement("style");
  style.innerHTML = `
    .vlan-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 340px;
      background: #ffffff;
      border-radius: 22px;
      box-shadow: 0 18px 60px rgba(0,0,0,0.12);
      z-index: 999999;
      overflow: hidden;
      font-family: Inter, Arial, sans-serif;
      animation: vlanFadeIn 0.4s ease;
    }

    @keyframes vlanFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .vlan-header {
      background: #111;
      color: white;
      padding: 18px 20px;
      font-size: 16px;
      font-weight: 700;
    }

    .vlan-body {
      padding: 20px;
    }

    .vlan-badge {
      display: inline-block;
      background: #f5f5f5;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 13px;
      margin-bottom: 12px;
      margin-right: 8px;
    }

    .vlan-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .vlan-text {
      color: #666;
      line-height: 1.6;
      font-size: 14px;
      margin-bottom: 18px;
    }

    .vlan-rating {
      font-size: 15px;
      margin-bottom: 18px;
      font-weight: 600;
    }

    .vlan-btn {
      width: 100%;
      background: #111;
      color: white;
      border: none;
      padding: 14px;
      border-radius: 14px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
    }

    .vlan-footer {
      margin-top: 14px;
      font-size: 12px;
      color: #888;
      text-align: center;
    }

    @media (max-width: 500px) {
      .vlan-widget {
        width: calc(100% - 24px);
        right: 12px;
        left: 12px;
        bottom: 12px;
      }
    }
  `;

  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.className = "vlan-widget";

  widget.innerHTML = `
    <div class="vlan-header">
      Recommended for You
    </div>

    <div class="vlan-body">

      <div class="vlan-badge">
        ⭐ Top Place
      </div>

      <div class="vlan-badge">
        🔥 Best Choice
      </div>

      <div class="vlan-title">
        Customers choose this option 3x more often
      </div>

      <div class="vlan-text">
        Trusted by high-converting businesses to improve sales,
        confidence and revenue performance.
      </div>

      <div class="vlan-rating">
        ★ 4.9/5 based on 2,184 reviews
      </div>

      <button class="vlan-btn" id="vlanActionBtn">
        View Recommendation
      </button>

      <div class="vlan-footer">
        Smart recommendations powered by VLAN AI
      </div>

    </div>
  `;

  document.body.appendChild(widget);

  document
    .getElementById("vlanActionBtn")
    .addEventListener("click", function () {
      window.location.href = "https://ai-startup-iota.vercel.app/checkout.html";
    });
})();

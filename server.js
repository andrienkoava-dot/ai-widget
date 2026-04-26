const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();

/*
ENV REQUIRED:

STRIPE_SECRET_KEY=sk_live_xxx
CLIENT_URL=https://ai-startup-iota.vercel.app
PORT=10000
*/

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/*
HEALTH CHECK
*/
app.get("/", (req, res) => {
  res.status(200).send("VLAN AI Backend Running");
});

/*
CREATE CHECKOUT SESSION
Plans:
starter = $99/month
growth = $299/month
enterprise = manual sales
*/
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    let priceData = null;

    if (plan === "starter") {
      priceData = {
        currency: "usd",
        product_data: {
          name: "Starter Plan"
        },
        unit_amount: 9900,
        recurring: {
          interval: "month"
        }
      };
    }

    if (plan === "growth") {
      priceData = {
        currency: "usd",
        product_data: {
          name: "Growth Plan"
        },
        unit_amount: 29900,
        recurring: {
          interval: "month"
        }
      };
    }

    if (!priceData) {
      return res.status(400).json({
        error: "Invalid plan selected"
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "subscription",

      line_items: [
        {
          price_data: priceData,
          quantity: 1
        }
      ],

      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard.html`,

      billing_address_collection: "required",

      allow_promotion_codes: true
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (error) {
    console.error("Checkout Error:", error.message);

    return res.status(500).json({
      error: error.message
    });
  }
});

/*
STRIPE BILLING PORTAL
Customer can:
- cancel subscription
- update card
- invoices
- upgrade
- downgrade
*/
app.post("/create-billing-portal", async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        error: "Customer ID required"
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/dashboard.html`
    });

    return res.status(200).json({
      url: portalSession.url
    });

  } catch (error) {
    console.error("Billing Portal Error:", error.message);

    return res.status(500).json({
      error: error.message
    });
  }
});

/*
Webhook placeholder
for:
- successful payment
- failed payment
- churn detection
- analytics
- retention flows
*/
app.post("/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    return res.status(200).json({
      received: true
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
});

/*
START SERVER
*/
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`VLAN Backend running on port ${PORT}`);
});

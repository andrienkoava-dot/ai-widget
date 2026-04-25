const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Widget Backend Running");
});

/*
CREATE CHECKOUT SESSION
*/
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    let priceData;

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
        error: "Invalid plan"
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
      cancel_url: `${process.env.CLIENT_URL}/dashboard.html`
    });

    res.json({
      url: session.url
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

/*
STRIPE BILLING PORTAL
*/
app.post("/create-billing-portal", async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        error: "Customer ID required"
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/dashboard.html`
    });

    res.json({
      url: session.url
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("Server running");
});
        

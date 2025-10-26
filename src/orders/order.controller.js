const { BASE_URL } = require("../utils/baseURL");
const { errorResponse } = require("../utils/responseHandler");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const makePaymentReq = async (req, res) => {
  const { products, userId } = req.body;
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        images: [product.image],
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity,
  }));
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cancel`,
    });
    res.json({ url: session.url });
  } catch (error) {
    return errorResponse(res, 500, "Failed to Make Payment Request", error);
  }
};

module.exports = {
  makePaymentReq,
};

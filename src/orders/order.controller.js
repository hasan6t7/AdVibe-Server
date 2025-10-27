const { BASE_URL } = require("../utils/baseURL");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const Order = require("./order.model");

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

const confirmPayment = async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });
    const paymentIntentId = session.payment_intent.id;
    let order = await Order.findOne({ orderId: paymentIntentId });
    if (!order) {
      const lineItems = session.line_items.data.map((item) => ({
        productId: item.price.product,
        quantity: item.quantity,
      }));
      const amount = session.amount_total / 100;
      order = new Order({
        orderId: paymentIntentId,
        products: lineItems,
        amount: amount,
        email: session.customer_details.email,
        status:
          session.payment_intent.status === "succeeded" ? "Pending" : "Failed",
      });
    } else {
      order.status =
        session.payment_intent.status === "succeeded" ? "Pending" : "Failed";
    }
    await order.save();
    return successResponse(res, 200, "Order Confirmed Successfully", order);
  } catch (error) {
    return errorResponse(res, 500, "Error on confirm payment", error);
  }
};

const getOrdersByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    if (!email) {
      return errorResponse(res, 400, "Email is required");
    }
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    if (orders.length === 0 || !orders) {
      return errorResponse(res, 404, "Orders Not Found");
    }
    return successResponse(res, 200, "Orders Get Successfully", orders);
  } catch (error) {
    errorResponse(res, 500, "Failed to get orders by email", error);
  }
};

module.exports = {
  makePaymentReq,
  confirmPayment,
  getOrdersByEmail,
};

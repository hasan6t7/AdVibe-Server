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
      expand: ["line_items.data.price", "payment_intent"],
    });

    const paymentIntent = session.payment_intent;
    const paymentIntentId = paymentIntent?.id;

    if (!paymentIntentId) {
      return errorResponse(res, 400, "Payment Intent not found in session");
    }

    const lineItems = await Promise.all(
      session.line_items.data.map(async (item) => {
        const productId = item.price.product;
        let name = "Unknown Product";
        let image = null;

        try {
          const product = await stripe.products.retrieve(productId);
          console.log(product)
          name = product.name;
          image = product.images?.[0] || null;
        } catch (err) {
          console.log("Failed to fetch product details for:", productId);
        }

        return {
          productId,
          name,
          image,
          quantity: item.quantity,
        };
      })
    );

    const amount = session.amount_total / 100;
    const email = session.customer_details?.email || "unknown@example.com";
    const status = paymentIntent.status === "succeeded" ? "Pending" : "Failed";
    const order = await Order.findOneAndUpdate(
      { orderId: paymentIntentId },
      {
        $set: {
          products: lineItems,
          amount,
          email,
          status,
        },
      },
      { new: true, upsert: true }
    );

    return successResponse(res, 200, "Order confirmed successfully!", order);
  } catch (error) {
    console.error("Error confirming payment:", error);
    return errorResponse(res, 500, "Error confirming payment", error);
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

const getOrdersByOrderId = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return errorResponse(res, 400, "Order id is required");
    }
    const order = await Order.findById(id);
    if (!order) {
      return errorResponse(res, 404, "Order not found by order id");
    }
    return successResponse(
      res,
      200,
      "Order get successfully by order id",
      order
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to get Orders by order id", error);
  }
};

const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    if (!orders) {
      return errorResponse(res, 404, "No orders Found");
    }
    return successResponse(res, 200, "Successfully get all orders", orders);
  } catch (error) {
    return errorResponse(res, 500, "Failed to get All Orders", error);
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return errorResponse(res, 400, "Status is Required");
  }
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return successResponse(
      res,
      200,
      "Order Successfully Updated",
      updatedOrder
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to update order status", error);
  }
};

const deleteOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return errorResponse(res, 404, "Order Not Found");
    }
    return successResponse(
      res,
      200,
      "Order Deleted Successfully",
      deletedOrder
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to Delete Order", error);
  }
};

module.exports = {
  makePaymentReq,
  confirmPayment,
  getOrdersByEmail,
  getOrdersByOrderId,
  getAllOrder,
  updateOrderStatus,
  deleteOrderById,
};

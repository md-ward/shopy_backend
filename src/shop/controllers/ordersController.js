const Order = require("../models/ordersModel");
const productsModel = require("../models/productsModel");
// const Products = require("../models/productsModel");

//!Admin : Get all  orders  with user and product details
exports.getOrders = async (req, res) => {
  try {
    let orders = await Order.find()
      .select("customer totalPrice orderStatus date")
      .populate("customer", "name -_id")
      .lean();

    orders = orders.map((order) => {
      return {
        ...order,
        customer: order.customer ? order.customer.name : null,
      };
    });
    orders.reverse();

    res.status(200).send(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? user Functions .....................................................................................

exports.createOrder = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const orderFormData = req.body;
    console.log(orderFormData);

    const products = JSON.parse(orderFormData.products);

    if (products.length === 0) {
      return res.status(500).send({
        message:
          "No products in the order. Add some products and then proceed to checkout.",
      });
    }

    const order = new Order({
      customer: userId,
      products: products,
      phone: orderFormData.phone,
      address: orderFormData.address,
      city: orderFormData.city,
      zip: orderFormData.zip || "NA",
    });

    const populatedOrder = await Order.populate(order, {
      path: "products.productId",
    });

    const insufficientStockProducts = [];

    for (const product of populatedOrder.products) {
      const inStock = await productsModel.findById(product.productId);
      if (inStock.quantity_in_stock < product.quantity) {
        insufficientStockProducts.push(product.productId.product_name);
      }
    }

    if (insufficientStockProducts.length > 0) {
      return res.status(400).send({
        message: `Insufficient stock for the following products: ${insufficientStockProducts.join(
          ", "
        )}`,
      });
    }

    let totalPrice = 0;

    populatedOrder.products.forEach((product) => {
      totalPrice += product.productId.price * product.quantity;
    });

    order.totalPrice = totalPrice;

    await order.save();

    res.status(201).send(order);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};
//! get all placed orderes by a user.....

exports.getUserOrders = async (req, res) => {
  const userId = res.locals.userId;
  try {
    let orders = await Order.find({
      customer: userId,
      orderStatus: { $ne: "Cancelled" },
    })
      .select("customer totalPrice orderStatus date")
      .populate("customer", "name -_id")
      .lean();

    orders = orders.map((order) => {
      return {
        ...order,
        customer: order.customer ? order.customer.name : null,
      };
    });
    orders.reverse();

    res.status(200).send(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//! get order details ...........
exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    //! excluded canCancel from respons for admin requists
    const order = await Order.findById(
      orderId,
      `-__v ${!res.locals.userId ? "-canCancel" : ""}`
    )
      .populate("customer", "name email -_id")
      .populate("products.productId", "product_name price sale_price ");

    if (res.locals.userId) {
      const twelveHoursAgo = new Date();
      twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 8);
      const orderDate = new Date(order.date);
      order.canCancel =
        order.orderStatus === "Processing" &&
        orderDate >= twelveHoursAgo &&
        orderDate.getDate() === twelveHoursAgo.getDate();

      // console.log(orderDate, twelveHoursAgo);
    }

    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//! update the status of an ordere
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderStatus = req.body.status;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus,
      },
      { new: true, runValidators: true }
    )
      .populate("customer", "name email -_id")
      .populate("products.productId", "product_name price sale_price ");
    if (orderStatus == "Shipped") {
      order.products.forEach((product) => {
        const orderedQuantity = product.quantity;
        const productId = product.productId;

        productsModel
          .findByIdAndUpdate(productId, {
            $inc: { quantity_in_stock: -orderedQuantity },
          })
          .exec();
      });
    }
    console.log(order);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete an order by ID
exports.deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }
    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

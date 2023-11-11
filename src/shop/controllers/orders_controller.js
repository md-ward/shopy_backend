const Order = require('../models/ordersModel');
const Product = require('../models/productsModel');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customer, products, totalPrice, paymentMethod, paymentStatus, date } = req.body;

    // Check if all products exist in the database
    const productIds = products.map(p => p.product);

    const existingProducts = await Product.find({ _id: { $in: productIds } });
    if (existingProducts.length !== productIds.length) {
      return res.status(400).json({ message: 'One or more products do not exist!' });
    }

    // Calculate the total price of the order
    const orderPrice = products.reduce((acc, p) => {
      const product = existingProducts.find(ep => ep._id.toString() === p.product);
      return acc + product.price * p.quantity;
    }, 0);

    // Save the new order to the database
    const newOrder = new Order({
      customer,
      products,
      totalPrice: orderPrice,
      paymentMethod,
      paymentStatus: 'Pending'
    });


    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
    console.log(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all orders with user and product details
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'fname lname email')
      .populate({
        path: 'products.product',
        model: 'Products',
        select: 'product_name price'
      });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an order by ID
exports.deleteOrderById = async (req, res) => {
  try {

    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found!' });
    }
    res.status(200).json({ message: 'Order deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
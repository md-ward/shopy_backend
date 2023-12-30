const User = require("../../registeration/models/registeringModel");
const Comments = require("../../comments/models/commentsModel");
const Order = require("../../shop/models/ordersModel");
const Products = require("../../shop/models/productsModel");
const getStatistics = async (req, res) => {
  try {
    const registeredUsers = await User.countDocuments();

    const totalComments = await Comments.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalProducts = await Products.countDocuments();

    const totalSalesRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const averageProductRating = await Products.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rate" },
        },
      },
    ]);

    const popularProducts = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.productId",
          count: { $sum: "$products.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },

      {
        $lookup: {
          from: "uploaded images",
          localField: "productDetails.image",
          foreignField: "_id",
          as: "images",
        },
      },
      {
        $unwind: "$images",
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          count: 1,
          productName: "$productDetails.product_name",
          productPrice: "$productDetails.price",
          thumbnailUrl: "$images.thumbnailUrl",
          image_alt: "$images.image_alt",
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 6,
      },
    ]);

    const statistics = {
      registeredUsers,
      totalComments,
      totalOrders,
      totalProducts,
      totalSalesRevenue: totalSalesRevenue[0]?.total || 0,
      averageProductRating: averageProductRating[0]?.averageRating || 0,
      popularProducts,
    };

    res.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

module.exports = { getStatistics };

async function getCartItems(req, res) {
  // console.log("get ");
  // Retrieve the cart from the session
  const cart = req.session.cart || [];

  res.status(200).send({cart});
}

// Add item to cart
async function addToCart(req, res) {
  const { productId, quantity } = req.body;

  console.log(productId, quantity);
  console.log(req.session.cart);
  try {
    // Retrieve the cart from the session or create a new one if it doesn't exist
    const cart = req.session.cart || [];

    // Check if the item already exists in the cart
    const existingItem = cart.find(
      (product) => product.productId === productId
    );

    if (existingItem) {
      // If the item already exists, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.push({ productId, quantity });
    }

    // Update the session with the modified cart
    req.session.cart = cart;

    res.status(201).send("Item added to cart successfully");
  } catch (error) {
    res.status(500).send("An error occurred while adding the item to the cart");
  }
}

// Remove item from cart
async function removeItem(req, res) {
  const { productId } = req.body;

  try {
    // Retrieve the cart from the session
    const cart = req.session.cart || [];

    // Find the index of the item in the cart
    const itemIndex = cart.findIndex(
      (product) => product.productId === productId
    );

    // Remove the item from the cart if found
    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
    }

    // Update the session with the modified cart
    req.session.cart = cart;

    res.status(201).send("Item removed from cart successfully");
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while removing the item from the cart");
  }
}

// Clear cart
async function clearCart(req, res) {
  try {
    // Clear the cart in the session
    req.session.cart = [];

    res.send("Cart cleared successfully");
  } catch (error) {
    res.status(500).send("An error occurred while clearing the cart");
  }
}
module.exports = { getCartItems, addToCart, removeItem, clearCart };

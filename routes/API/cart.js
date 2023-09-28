const express = require('express');
const router= express.Router();
const passport = require('passport');
const Cart = require('../../model/Cart');

//@route GET api/users/test
//@desc tests users route
//@access public
router.get('/test',(req , res) => res.json({msg: 'cart works'})
);
 


// GET /api/cart - Get the user's cart (requires authentication)
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/cart - Add a product to the user's cart (requires authentication)
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart for the user if it doesn't exist
      const newCart = new Cart({
        user: userId,
        products: [{ productId, quantity, price }],
      });
      await newCart.save();
    } else {
      // Update the existing cart by adding the product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // If the product already exists in the cart, update the quantity and price
        cart.products[existingProductIndex].quantity += quantity;
        cart.products[existingProductIndex].price = price;
      } else {
        // If the product is new, add it to the products array
        cart.products.push({ productId, quantity, price });
      }

      await cart.save();
    }

    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/cart/:productId - Remove a product from the user's cart (requires authentication)
router.delete('/:productId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const updatedProducts = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    cart.products = updatedProducts;
    await cart.save();

    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
 
const express = require('express');
const router= express.Router();
const passport = require('passport');
const Order = require('../../model/Order'); 
const Product = require('../../model/product');
const User = require('../../model/User');
//@route GET api/users/test
//@desc tests users route
//@access public
router.get('/test',(req , res) => res.json({msg: 'order  works'})
);
// @route   GET api/order
// @desc    Get current user's order
// @access  Private
//to get the current users order..after they logged in
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Order.findOne({user: req.user.id })
    //.populate('user', ['name', 'avatar'])
    .then(order => {
      if (!order) {
        errors.noorder = 'There is no order for this user';
        console.log(errors)
        return res.status(404).json(errors);
      }
      res.json(order);
    })
    .catch(err => res.status(404).json(err));
}); 


// GET /api/orders - Fetch all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 // GET /orders/:id - Fetch a specific product
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


 // POST /api/orders
router.post('/', async (req, res) => {

  try {

    const { user, products, shippingAddress } = req.body;

    // Get product IDs from products array
    const productIds = products.map(p => p.productId);

    // Fetch product documents 
    const productDocs = await Product.find({ _id: { $in: productIds } });

    // Create map of productId -> product doc 
    const productMap = productDocs.reduce((acc, p) => {
      acc[p._id] = p;
      return acc;
    }, {});

    // Populate price from product map
    products.forEach(p => {
      p.price = productMap[p.productId].price; 
    });

    // Calculate total amount
    let totalAmount = 0;
    products.forEach(p => {
      totalAmount += p.quantity * p.price; 
    });

    const order = new Order({
      user,
      products,
      totalAmount, 
      shippingAddress
    });

    await order.save();
    
    res.status(201).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error'});
  }

});
// PUT /api/orders/:id - Update a specific order
router.put('/orders/:id', async (req, res) => {
  try {
    const { user, products, totalAmount, shippingAddress, orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {
      user,
      products,
      totalAmount,
      shippingAddress,
      orderStatus
    }, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/orders/:id - Delete a specific order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
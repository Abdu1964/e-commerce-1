const express = require('express');
const router= express.Router();

//@route GET api/users/test
//@desc tests users route
//@access public
router.get('/test',(req , res) => res.json({msg: 'order  works'})
);

 
const Order = require('../../model/Order');

// GET /api/orders - Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/orders/:id - Fetch a specific order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name');
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
router.put('/:id', async (req, res) => {
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

module.exports = router;
const express = require('express');
const router= express.Router();
const passport = require('passport');
const Review = require('../../model/Review');
const User = require ('./../../model/User')
const Product = require ('./../../model/product')

//@route GET api/users/test
//@desc tests users route
//@access public
router.get('/test',(req , res) => res.json({msg: 'review  works'})
);

// GET /api/reviews - Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user').populate('product');
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/reviews - Create a new review (requires authentication)
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const userId = req.user.id;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required fields' });
    }

    const newReview = new Review({
      user: userId,
      product: productId,
      rating:rating,
      comment:comment
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/reviews/:id - Delete a specific review
router.delete('/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
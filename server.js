const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI; // Assuming you have a separate file with the MongoDB URI

// importing all API to the server.js

const User = require('./routes/API/user');
const Product = require('./routes/API/product');
const Order = require('./routes/API/Order');
const Cart = require('./routes/API/Cart');
const Review = require('./routes/API/Review');
const bodyParser = require('body-parser');

// Connect to Mongodb
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
  
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// for route use
app.use('/api/user', User);
app.use('/api/cart', Cart);
app.use('/api/order', Order);
app.use('/api/product', Product);
app.use('/api/review', Review);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
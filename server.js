const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI; // Assuming you have a separate file with the MongoDB URI
//const connection_url= 'mongodb+srv://abdum14:Abtayd.rum@cluster0.ixyf4u9.mongodb.net/'
// Connect to MongoDB
 mongoose
   .connect(db)
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err));

  //mongoose.connect(connection_url, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
     
  //});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
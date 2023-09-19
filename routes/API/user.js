const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
 

const User = require('./../../model/User'); // Import the User model
const  jwt = require('jsonwebtoken');//for web token JWT
const keys = require('./../../config/keys');//to access the secret key

const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login')
 


// @route GET api/users/test
// @desc tests users route
// @access public
router.get('/test', (req, res) => res.json({ msg: 'user works' }));

router.post('/register', (req, res) => {

  const {errors, isValid} = validateRegisterInput(req.body)
//check validation
  if (!isValid){
    return  res.status(400).json(errors)
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});
 // @route   GET api/users/login   
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {

  const {errors, isValid} = validateLoginInput(req.body)
  //check validation
    if (!isValid){
      return  res.status(400).json(errors)
    }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email })
    .then(user => {
      // checking for the user
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }
      
      // Check Password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //res.json({ msg: 'Success' });
            //*************** */
            //JWT 
       //****************
       //user match
       const payload = {id:user.id,name:user.name}
       //sign token
       jwt.sign(
         payload,
         keys.secret,
        {expiresIn: 3600},
        (err,token)=> {
         res.json({ 
  success: true,
  token: 'Bearer ' + token
});
        }
        );

          } else {
            return res.status(400).json({ password: 'Incorrect password' });
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});


const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
 
const passport = require('passport');
require('../../config/passport')(passport);
//Protected Route
//********************** */
//@route GET api/users/current
//@desc return current user
//@access private

 
const { json } = require('body-parser');
router.get ('/current',passport.authenticate('jwt',{session:false}),
(req,res)=>{
  
 // res.json({msg : 'success'}) //res.json(200).send('success')
 //res.json(req.user) //i shouldn't use this as a resposnse because i don want to show all my private information
 res.json({
  id: req.user.id,
  name:req.user.name,
  email:req.user.email
 })

}
)

module.exports = router;
 
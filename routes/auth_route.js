const express = require('express');
const router = express.Router();
console.log('auth_route.js: Requiring SignUp');


const { SignUp,SignIn} = require('../controllers/auth/auth_controller');

console.log('auth_route.js: SignUp', SignUp);

router.post('/signup', SignUp);
router.post('/signin', SignIn);


module.exports = router;
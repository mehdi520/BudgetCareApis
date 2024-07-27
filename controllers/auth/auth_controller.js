const AsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { SuccessResponse, ErrorResponse } = require('../../common/common');
const User = require('../../models/user/user_model');
const generateToken = require('../../utils/jwt');


const SignUp = AsyncHandler(async (req, res) => {

    const { name, email, password, image, phone } = req.body;

    if (!name) {
        return ErrorResponse(req, res, null, 'Name is required');
    }
    else if (!phone) {
        return ErrorResponse(req, res, null, 'Phone is required');
    }
    else if (!email) {
        return ErrorResponse(req, res, null, 'Email is required');
    }
    else if (!password) {
        return ErrorResponse(req, res, null, 'Password is required');
    }
    else {
        try {

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return ErrorResponse(req, res, null, 'Email already exists');
            }
            else {
                const hashPassword = await bcrypt.hash(password, 10);
                const user = new User({ name, phone, email, password: hashPassword });
                const newUser = await User.create(user);
                const token = generateToken(newUser._id);
                return SuccessResponse(req, res, token, 'Signup successfully');
            }
        }
        catch (error) {
            console.log(error);
            return ErrorResponse(req, res, null, 'Something went wrong.Please try again');
        }
    }
});

const SignIn = AsyncHandler(async (req, res) => {
   
    const { email, password } = req.body;

    if (!email) {
        return ErrorResponse(req, res, null, 'Email is required');
    }
    else if (!password) {
        return ErrorResponse(req, res, null, 'Password is required');
    }
    else {
        try {

            const findUser = await User.findOne({ email });

            if (!findUser) {
                return ErrorResponse(req, res, null, 'Email is incorrect');
            } else {
              if (await bcrypt.compare(password, findUser.password)) {
                const token = generateToken(findUser._id);
              
                return SuccessResponse(req, res, token, 'Signin successfully');
              } else {
                return ErrorResponse(req, res, null, 'Password is incorrect');
              }
            }
        }
        catch (error) {
            return ErrorResponse(req, res, null, 'Something went wrong.Please try again');
        }
    }
});

module.exports = {
    SignUp,
    SignIn
};
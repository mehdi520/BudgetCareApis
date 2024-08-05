const AsyncHandler = require('express-async-handler');
const User = require('../../models/user/user_model');
const bcrypt = require('bcryptjs');

const { SuccessResponse, ErrorResponse } = require('../../common/common');

const UserById = AsyncHandler(
    async (req, res) => {
        try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
           
            return ErrorResponse(req, res, null, 'User not found');

        }
        else {
            return SuccessResponse(req, res, user, 'Success');

        }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
            return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

        }
    }
);

const UpdateUser = AsyncHandler(
    async (req, res) => {
        try {
        const userId = req.user.id;
        const { name, phone } = req.body;

        if (!name) {
            return ErrorResponse(req, res, null, 'Name is required');

        }
        else if (!phone) {
            return ErrorResponse(req, res, null, 'Phone is required');

        }
        else {
            const user = await User.findByIdAndUpdate(userId, { name, phone }, { new: true });
            if (!user) {
                return ErrorResponse(req, res, null, 'User not found');

            }
            else {
                return SuccessResponse(req, res, user, 'User updated successfully');

            }
        }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
            return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

        }
    });

const chnagePasswords = AsyncHandler( async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword) {
            return ErrorResponse(req, res, null, 'oldPassword is required');

        }
        if (!newPassword) {
            return ErrorResponse(req, res, null, 'newPassword is required');

        }
        const user = await User.findById(userId);
        if (!user) {
            return ErrorResponse(req, res, null, 'User not found');

        }
    
        else {

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return ErrorResponse(req, res, null, 'Incorrect old password');
            }
            user.password = await bcrypt.hash(newPassword, 10);

              await user.save();
            return SuccessResponse(req, res, null, 'Password updated successfully');

        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        return ErrorResponse(req, res, null, 'Something went wrong! Please try again');

    }
});
module.exports = {
    UserById,
    UpdateUser,
    chnagePasswords
};
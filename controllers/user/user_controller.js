const AsyncHandler = require('express-async-handler');
const User = require('../../models/user/user_model');
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

module.exports = {
    UserById
};

const SuccessResponse = (req,res,data,message) => {
    return res.json(
        {
            status : true,
            data,
            message
        }
    );
};

const ErrorResponse = (req,res,data,message) => {
    return res.json(
        {
            status : false,
            data,
            message
        }
    );
};

module.exports = {
    SuccessResponse,
    ErrorResponse
};
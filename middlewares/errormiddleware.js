const handler = (err,req,res,next) => {
    res.json(
        {
            status: false,
            message: err.message || 'Something went wrong'
        }
    )
};


module.exports = handler;
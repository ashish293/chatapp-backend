const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
export default errorMiddleware;
const TryCatch = (fn) => async (req, res, next) => {
    try {
        console.log('he');
        await fn(req, res, next);
    }
    catch (error) {
        console.log('h2');
        console.log(error);
        next(error);
    }
};
export { errorMiddleware, TryCatch };

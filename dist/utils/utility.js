import jwt from 'jsonwebtoken';
class ErrorHandler extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true, // set to true to prevent client-side access to the cookie
        secure: true, // use secure cookies in production
        sameSite: 'none'
    };
    res.status(code).cookie(process.env.JWT_COOKIE_NAME, token, options).json({
        success: true,
        user,
        token,
        message
    });
};
const sendSuccess = ({ res, status = 200, ...keys }) => {
    const response = { success: true };
    Object.entries(keys).forEach(([key, value]) => {
        if (value)
            response[key] = value;
    });
    res.status(status).json(response);
};
const emitEvent = (event, to, data) => {
    console.log("Event emitted", data);
};
export { ErrorHandler, sendToken, emitEvent, sendSuccess };

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.log({ statusCode, message });
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

module.exports = errorHandler;

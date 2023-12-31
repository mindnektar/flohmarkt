export default (error, request, _response, next) => {
    if (error.code === 'invalid_token') {
        if (error.inner.name === 'TokenExpiredError') {
            request.tokenExpired = true;
        }

        return next();
    }

    return next(error);
};

export default (error, _request, response, next) => {
    if (error.type === 'stream.not.readable') {
        response.status(499);
        response.send('Client Closed Request');

        return;
    }

    next(error);
};

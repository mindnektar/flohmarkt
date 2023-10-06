import asyncHandler from 'express-async-handler';
import authorize from 'auth';

export default asyncHandler(async (request, _response, next) => {
    request.auth = await authorize(request.auth);
    next();
});

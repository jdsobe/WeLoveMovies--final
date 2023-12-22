const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const review = await service.read(request.params.reviewId);
     if (Object.keys(review).length === 0) {
      return next({ status: 404, message: `Review cannot be found.` });
    }
    response.locals.review = review;
    next();
}

async function destroy(request, response) {
    await service.destroy(request.params.reviewId);
  response.sendStatus(204);

}

async function list(request, response) {
  const data = await service.list(request.params.movieId);
  response.json({ data });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const review = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review[0].review_id,
  };
  const data = await service.update(review);
  response.json({ data :data[0] });

}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};

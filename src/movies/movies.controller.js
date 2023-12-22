const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  res.locals.movie = movie;
  if (Object.keys(movie).length === 0) {
    return next({ status: 404, message: `Movie cannot be found.` });
  }
  next();
}

async function read(req, res) {
  const data = res.locals.movie
  res.json({ data :data[0]});
}

async function moviePlaying(req, res) {
  const data = await service.moviePlaying(req.params.movieId)
  res.json({ data });
}

async function list(request, response) {
  const data = await service.list(request.query);
  response.json({ data});
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  movieExists,
  moviePlaying,
};

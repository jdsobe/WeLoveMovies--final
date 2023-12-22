const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");
const tableName = "reviews";

async function destroy(reviewId) {
  return db(tableName).where({ "review_id":reviewId }).del();
  
}


async function list(movieId) {
  return db("reviews as r")
  .join("critics as c", "c.critic_id", "r.critic_id")
  .where({"r.movie_id" : movieId})
  .then(setMovieCritic);
}

async function setMovieCritic(movieIds) {
  for (const movieId of movieIds) {
    const { critic_id } = movieId;
    const critic = await readCritic(critic_id);
    movieId.critic = critic;
  }
  return movieIds;
}

async function read(reviewId) {
  return db("reviews")
  .select("reviews.*")
  .where({ "review_id": reviewId })
  
}

async function readCritic(critic_id) {
  return db("critics")
  .select("preferred_name","surname", "organization_name")
  .where({ critic_id: critic_id }).first();
}

async function setCritic(review) {
  const { critic_id} = review[0];
  critic = await readCritic(critic_id);
  review[0].critic = critic;
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update({
      score: review.score,
      content: review.content,
    })
    .then(() => read(review[0].review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};

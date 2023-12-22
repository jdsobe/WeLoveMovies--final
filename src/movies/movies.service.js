const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}
async function moviePlaying(movie_id) {
  return db("movies_theaters as mt")
    .select("t.*","mt.*")
    .join("theaters as t","mt.theater_id", "t.theater_id" )
    .where({ "mt.movie_id": movie_id })
    .where({"mt.is_showing" : true})
  
}

async function read(movie_id) {
  return db("movies")
    .select("movies.*")
    .where({ "movies.movie_id": movie_id })
  
}

module.exports = {
  list,
  read,
  moviePlaying,
};

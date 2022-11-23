const yearlyStatsFunction = (deathCountData) => {
  const yearSummary = {};
  const resultset = [];

  for (let death of deathCountData) {
    const year = death.year;
    if (year !== 1949 && year !== 2013) {
      if (!(year in yearSummary)) {
        yearSummary[year] = { 'total_film': 0, 'body_count': 0, 'total_length': 0, 'total_rating': 0 }
      }
      yearSummary[year]['total_film'] += 1;
      yearSummary[year]['body_count'] += death.bodyCount;
      yearSummary[year]['total_length'] += death.length;
      yearSummary[year]['total_rating'] += death.imdbRating;
    }

  }
  for (let year in yearSummary) {
    const currentobj = {
      'year': +year,
      'total_film': yearSummary[year]['total_film'],
      'body_count': yearSummary[year]['body_count'],
      'total_length': yearSummary[year]['total_length'],
      'total_rating': yearSummary[year]['total_rating'],
      'averageBody': yearSummary[year]['body_count'] / yearSummary[year]['total_film'],
      'averageLength': yearSummary[year]['total_length'] / yearSummary[year]['total_film'],
      'averageRating': yearSummary[year]['total_rating'] / yearSummary[year]['total_film'],

    };

    resultset.push(currentobj);
  }

  return resultset
}


const decadeStatsFunction = (yearly_stats) => {
  const result = []
  for (let year = 1951; year <= yearly_stats[yearly_stats.length - 1].year; year += 10) {
    let decade = { 'year': year, 'end': year + 9, 'total_film': 0, 'body_count': 0, 'total_length': 0, 'total_rating': 0 }
    for (let each of yearly_stats) {
      // result.push(each)
      if (each.year >= year && each.year < year + 10) { //1951 - 1960
        decade.total_film += each.total_film;
        decade.body_count += each.body_count;
        decade.total_length += each.total_length;
        decade.total_rating += each.total_rating;
      }
    }
    decade.averageBody = decade.body_count / decade.total_film;
    decade.averageLength = decade.total_length / decade.total_film;
    decade.averageRating = decade.total_rating / decade.total_film;
    result.push(decade);
  }
  return result
}

const getGenreList = (deathCountData) => {
  const genres = []
  for (let death of deathCountData) {
    death.genre.forEach(gen => {
      // genres.push(gen)
      if (!genres.includes(gen)) {
        genres.push(gen)
      }
    })
    // genres.push(splitGenre)
  }
  return genres
}


// counting movies based on genres
const getGenresObj = (genreList, deathCountData) => {
  let result = []
  let eachGenre = {}
  let genreCheckList = [];
  for (let aGenre of genreList) {
    if (!genreCheckList.includes(aGenre)) {
      eachGenre[aGenre] = { "genre": aGenre, "total_film": 0, "body_count": 0, "averageBody": 0 }
      genreCheckList.push(aGenre)
    }
    for (let death of deathCountData) {
      // result.push(death.genre.includes(aGenre))
      if (death.genre.includes(aGenre)) {
        eachGenre[aGenre]["total_film"] += 1;
        eachGenre[aGenre]["body_count"] += death.bodyCount;
      }
    }
    eachGenre[aGenre]["averageBody"] = eachGenre[aGenre]["body_count"] / eachGenre[aGenre]["total_film"];

  }

  for (let each in eachGenre) {
    const currentobj = {
      'genre': eachGenre[each]['genre'],
      'total_film': eachGenre[each]['total_film'],
      'body_count': eachGenre[each]['body_count'],
      'averageBody': eachGenre[each]['body_count'] / eachGenre[each]['total_film']
    };

    result.push(currentobj);
  }
  // result.push(eachGenre) 

  return result
}


// counting movies based on mpaa ratings
const gerMpaaRatingsCounts = () => {

  // data structures
  let result = []
  let eachRating = {}
  let ratingCheckList = [];

  // loop through each rating
  for (let aRating of mpaaRatings) {

    // if the rating is not a part of the checklist
    if (!ratingCheckList.includes(aRating)) {

      // add it as a key of eachRating with a dictionary attached
      eachRating[aRating] = { "mpaa_rating": aRating, "count": 0 }

      // add to the ratings checlist
      ratingCheckList.push(aRating)
    }

    // loop through each film selected by the brush
    for (let aFilm of mpaaData) {

      // if the current film has a rating of the current rating
      if (aFilm.mpaaRating === aRating) {

        // add to the count of its count key
        eachRating[aRating]["count"] += 1;
      }
    }
  }

  // add to current object which will be pushed to the returned result array
  for (let each in eachRating) {
    const currentobj = {
      'mpaa_rating': eachRating[each]['mpaa_rating'],
      'count': eachRating[each]['count']
    };

    // add to result array
    result.push(currentobj);
  }
  // return the array containing mpaa ratings and how many of each there are
  return result
}
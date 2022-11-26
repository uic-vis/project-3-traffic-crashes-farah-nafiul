function init() {
    d3.csv('./data/filmdeathcounts.csv').then((data) => {
        let deathCountData = data.map(d => ({
            film: d['Film'],
            year: +d['Year'],
            bodyCount: +d['Body_Count'],
            mpaaRating: d['MPAA_Rating'],
            genre: d['Genre'].split("|"),
            director: d['Director'],
            length: +d['Length_Minutes'],
            imdbRating: +d['IMDB_Rating']
        }));

        topRight();

        // console.log(deathCountData)

        let yearly_stats = yearlyStatsFunction(deathCountData);
        // console.log(yearly_stats);

        let decade_stats = decadeStatsFunction(yearly_stats);
        // console.log(decade_stats)

        topLeft(yearly_stats, decade_stats);

        let genreList = getGenreList(deathCountData);
        // console.log(genreList)

        let genresObj = getGenresObj(genreList, deathCountData);
        // console.log(genresObj)

        let mpaaRatings = Array.from(new Set(deathCountData.map(d => d.mpaaRating)));
        bottomLeftVis2(genreList, genresObj, deathCountData, mpaaRatings);

        let mpaaRatingsCounts = getMpaaRatingsCounts(mpaaRatings, deathCountData)

        let radioButtonValue = d3.select('input[name="toggleVis23"]:checked').node().value;

        if (radioButtonValue === 'Genres') {
            bottomLeftVis2(genreList, genresObj, deathCountData, mpaaRatings);
        } else {
            bottomLeftVis3(mpaaRatings, deathCountData, mpaaRatingsCounts);
        }

        d3.selectAll(("input[name='toggleVis23']")).on("change", function () {
            console.log(this.value)
            if (this.value === 'Genres') {
                d3.select('#vis3').style('display', 'none')
                d3.select('#vis2').style('display', 'block')
                d3.select("#seconTitle").selectAll("*").remove();
                d3.select("#seconTitle").append('h5')
                    .text('Movie Death Trends by Genres')
                bottomLeftVis2(genreList, genresObj, deathCountData, mpaaRatings);
            } else {
                d3.select('#vis3').style('display', 'block')
                d3.select('#vis2').style('display', 'none')
                d3.select("#genreAttrib").selectAll("*").remove();
                d3.select("#seconTitle").selectAll("*").remove();
                d3.select("#seconTitle").append('h5')
                    .text('Body Count vs. IMDB Rating vs. MPAA Rating')
                bottomLeftVis3(mpaaRatings, deathCountData, mpaaRatingsCounts);
            }
        });
    })

    bottomRight();

}

window.onload = () => {
    init();
}

window.onresize = () => {
    init();
}
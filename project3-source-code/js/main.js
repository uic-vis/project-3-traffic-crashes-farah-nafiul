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

        console.log(deathCountData)

        let yearly_stats = yearlyStatsFunction(deathCountData);
        console.log(yearly_stats);

        let decade_stats = decadeStatsFunction(yearly_stats);
        console.log(decade_stats)

        topLeft(yearly_stats, decade_stats);
    })

    topRight();
    bottomLeft();
    bottomRight();

}

window.onload = () => {
    init();
}
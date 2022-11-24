let genAttr = ["averageBody", "body_count", "total_film"];
let selectedAttrib = 'averageBody'
let scatterPlotData;
const bottomLeftVis2 = (genreList, genresObj, deathCountData, mpaaRatings) => {
    d3.select("#genreAttrib").selectAll("*").remove();

    scatterPlotData = deathCountData.filter(death => death.genre.includes("War"));
    d3.select('#genreAttrib')
        .append('label')
        .attr('for', 'genAttrSelect')
        .attr('class', 'form-label')
        .text('Select Attribute')
        .append('select')
        .attr('class', 'form-select')
        .attr('id', 'genAttrSelect')
        .on('change', (d) => {
            let value = d3.select('#genAttrSelect').property('value');

            selectedAttrib = value;
            BarChartForScatter(genresObj, {
                x: d => d.genre,
                y: d => d[selectedAttrib],
                xDomain: d3.groupSort(genresObj, ([d]) => -d[selectedAttrib], d => d.genre), // sort by descending frequency
                yLabel: selectedAttrib,
                xLabel: 'Genres',
                width: d3.select('#barchart1').node().parentNode.clientWidth,
                height: d3.select('#barchart1').node().parentNode.clientHeight,
                color: "steelblue",
                title1: 'Genre',
                title2: selectedAttrib,
                title3: selectedAttrib === 'total_film' ? 'body_count' : 'total_film',
                deathCountData: deathCountData,
                mpaaRatings: mpaaRatings
            })

        })
        .selectAll('option')
        .data(genAttr)
        .enter()
        .append('option')
        .attr('value', (d) => {
            return d;
        }).text((d) => d)

    BarChartForScatter(genresObj, {
        x: d => d.genre,
        y: d => d[selectedAttrib],
        xDomain: d3.groupSort(genresObj, ([d]) => -d[selectedAttrib], d => d.genre), // sort by descending frequency
        yLabel: selectedAttrib,
        xLabel: 'Genres',
        width: d3.select('#barchart1').node().parentNode.clientWidth,
        height: d3.select('#barchart1').node().parentNode.clientHeight,
        color: "steelblue",
        title1: 'Genre',
        title2: selectedAttrib,
        title3: selectedAttrib === 'total_film' ? 'body_count' : 'total_film',
        deathCountData: deathCountData,
        mpaaRatings: mpaaRatings
    })

    Scatterplot1(scatterPlotData, {
        x: d => d.year,
        y: d => d.imdbRating,
        radius: d => d.bodyCount,
        colors: d => d.mpaaRating,
        title: d => d.film,
        ratings: d => d.mpaaRating,
        xLabel: "Year →",
        yLabel: "↑ Death Count",
        stroke: "steelblue",
        width: d3.select('#scatter1').node().parentNode.clientWidth,
        height: d3.select('#scatter1').node().parentNode.clientHeight,
        title1: 'Year',
        title2: 'IMDB',
        title3: 'Name',
        title4: 'Body Count',
        mpaaRatings: mpaaRatings
    })
}



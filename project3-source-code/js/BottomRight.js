
const bottomRight = (countries, countryName, movieData) =>{

    //d3.select('#bottomRight').text("Bottom Right")

    // display the vis
    // call the linechart function
    lineChart(countries, movieData);

    scatterPlotForGross(countryName, movieData)
}


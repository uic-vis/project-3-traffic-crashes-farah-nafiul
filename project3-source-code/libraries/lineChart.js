// function to generate a dictionary per country
function dictGenerator(country, data, name) {

    // have a checklist to ensure no duplicates
    let yearChecklist = [];

    // loop through each line of the data
    for (let i = 0; i < data.length; i++) {

        // make sure it is the right country
        if (data[i].country == name) {
           
            // if the year has not been seen
            if (!yearChecklist.includes(data[i].year)) {
            
                // add to the dictionary
                country[data[i].year] = {"gross": [], "avgGross": 0};

                // push
                country[data[i].year].gross.push(data[i].gross);

                // add to the checklist
                yearChecklist.push(data[i].year);
            }

            // if the year has been seen
            else {

                // push the new gross to that year
                country[data[i].year].gross.push(data[i].gross);
            }
        }
    }

    // variable to calculate the average per year
    let theAverage = 0;

    // for each year, calculate the average gross
    for (let aYear of Object.entries(country)) {

        // each element of the gross array
        for (let aGross of aYear[1].gross) {

            // add up all the grosses
            theAverage = theAverage + aGross;
        }

        // find the average by dividing by the number of movies for each year
        theAverage = theAverage / aYear[1].gross.length;

        // make the average for each year the value of the avgGross key
        aYear[1].avgGross = theAverage;
    }

    // return the dictionary of years for the specified country
    return country;
}

// load movies_refined csv file
d3.csv('./data/movies_refined.csv').then((data => {

    // store countries, years, gross, film names, and IMDB scores
    let movieData = data.map(d => ({
        film: d['name'],
        year: +d['year'],
        score: +d['score'],
        country: d['country'],
        gross: +d['gross']
    }));

    // make a dictionary of years for each country
    let US = {};
    let UK = {};

    // generate years dictionaries for the US and the UK
    US = dictGenerator(US, movieData, "United States");
    UK = dictGenerator(UK, movieData, "United Kingdom");

    // place them all in a single dictionary
    countries = {"United States": US, "United Kingdom": UK};

    // for debugging
    // console.log(countries);

    // call the linechart function
    lineChart(countries);

}))

// function to create the line chart
function lineChart(data) {

    // set the margins and dimensions of the graoh
    var margin = {top: 20, right: 0, bottom: 30, left: 40},
        width = 344,
        height = 242.883;

    // append the svg object to the body of the page
    var svg = d3.select("#lineChart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // countries for comparison
    var compCountries = ["United States", "United Kingdom"];

    // reformat given data for an array of arrays of {x, y}
    // appropriate format:
    //{
        //0: {name: 0, values:[{Year,Avg},{Year,Avg},{Year,Avg}]}
        //1: {name: 1, values:[{Year,Avg},{Year,Avg},{Year,Avg}]}
    //}

    // container for new manipulated data
    var manip = {};

    // for each country
    for (let aCountry of Object.entries(data)) {
        
        // add country values to the new container
        manip[aCountry[0]] = {"name": aCountry[0], "values": []};

        // for each year of the current country       
        for (let aYear of Object.entries(aCountry[1])) {

            // push a disctionary with year and average gross
            manip[aCountry[0]].values.push({"year": aYear[0], "avgGross": aYear[1].avgGross});
        }
    }

    // for debugging
    console.log(manip);

    // add to array
    let newData = [manip['United States'], manip['United Kingdom']];

    // color scale for countries
    var colorScale = d3.scaleOrdinal()
        .domain(compCountries)
        .range(d3.schemeTableau10);

    // add the x axis
    var x = d3.scaleLinear()
        .domain([1980, 2020])
        .range([0, width - 20]);
    
    // append the svg element
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y axis
    var y = d3.scaleLinear()
        .domain([0, 220000000])
        .range([height, 0]);
    
    // append the svg element
    svg.append("g")
        .call(d3.axisLeft(y));

    // add the lines
    var line = d3.line()
        .x(function(d) {return x(+d.year)})
        .y(function(d) {return y(+d.avgGross)})
    
        // select lines
        svg.selectAll("theLines")
            .data(newData)
            .enter()
            .append("path")
                .attr("class", function(d){return d.name})
                .attr("d", function(d){return line(d.values)})
                .attr("stroke", function(d){return colorScale(d.name)})
                .style("stroke-width", 4)
                .style("fill", "none")
                .on("click", function(d){

                    // get the Name of the current label
                    Name = d.target.__data__.name.replace(" ",".")

                    // get the path from d3 to get the line
                    Path = d3.select('path.'+Name)

                    // get current opacity
                    curOpacity = Path.style('opacity')

                    // Sif opacity is 1 change to .25, if .25 change to 1
                    Path.style('opacity',curOpacity == 1 ? .25:1)
                    })

            // add a legend in the top left corner
            svg
                .selectAll("theLegend")
                .data(newData)
                .enter()
                    .append('g')
                    .append("text")
                        .attr('x', 30)
                        .attr('y', function(d, i){return 30 + i * 20})
                        .text(function(d) {return d.name;})
                        .style("fill", function(d){return colorScale(d.name)})
                        .style("font-size", 15)

                    // clicking functionality changes opacity
                    .on()
}
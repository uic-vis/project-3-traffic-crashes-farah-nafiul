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


// function to create the line chart
function lineChart(data, movieData) {
    d3.select('#lineChart').select('svg').remove()
    // set the margins and dimensions of the graoh
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = d3.select('#lineChart').node().clientWidth,
        height = d3.select('#lineChart').node().parentNode.clientHeight;

    // append the svg object to the body of the page
    var svg = d3.select("#lineChart")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        // .append("g")
        //     .attr("transform",
        //     "translate(" + margin.left + "," + 0 + ")");

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
    // console.log(manip);

    // add to array
    let newData = [manip['United States'], manip['United Kingdom']];

    // color scale for countries
    var colorScale = d3.scaleOrdinal()
        .domain(compCountries)
        .range(d3.schemeTableau10);

    // add the x axis
    var x = d3.scaleLinear()
        .domain([1980, 2020])
        .range([margin.left, width - margin.right]);
    
    // append the svg element and fix the years to have no commas
    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .call(g => g.append("text")
            .attr("x", width - margin.left)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text('Year →'));

    // add the y axis
    var y = d3.scaleLinear()
        .domain([0, 360000000])
        .range([height - margin.bottom, margin.top]);
    
    // append the svg element and format with M
    var g = svg.append("g").attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(10, "s"))
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text('↑ Average Gross'));

    // add the lines
    var line = d3.line()
        .x(function(d) {return x(+d.year)})
        .y(function(d) {return y(+d.avgGross)})
    
        // select lines
        svg.selectAll("theLines")
            .data(newData)
            .enter()
            .append("path")
            .on('mouseover', (event, d) => {  
                // console.log(d.name)    
                let name = d.name.replace(" ","")   
                // console.log(name)     
                d3.selectAll('#grossLine').style('opacity', 0.5)        
                d3.select(`.gross${name}`).style('opacity', 1)                        

            })
            .on('mouseleave', (event, d) => {      
                // console.log('left')                  
                // d3.select(`.gross${d.name}`).style('opacity', 1)
                d3.selectAll('#grossLine').style('opacity', 1)

            })
                .attr('id', 'grossLine')
                .attr("class", function(d){
                    let name = d.name.replace(" ","")
                    return `gross${name}`})
                .attr("d", function(d){return line(d.values)})
                .attr("stroke", function(d){return colorScale(d.name)})
                .style("stroke-width", 4)
                .style("fill", "none")
                .on("click", function(event, d){
                    scatterPlotForGross(d.name, movieData)
                })

            // add a legend in the top left corner
            svg
                .selectAll("theLegend")
                .data(newData)
                .enter()
                    .append('g')
                    .on('mouseover', (event, d) => {  
                        // console.log(d.name)    
                        let name = d.name.replace(" ","")   
                        // console.log(name)     
                        d3.selectAll('#grossLine').style('opacity', 0.5)        
                        d3.select(`.gross${name}`).style('opacity', 1)                        

                    })
                    .on('mouseleave', (event, d) => {      
                        // console.log('left')                  
                        // d3.select(`.gross${d.name}`).style('opacity', 1)
                        d3.selectAll('#grossLine').style('opacity', 1)

                    })
                    .on('click', (event, d)=>{
                        scatterPlotForGross(d.name, movieData)
                    })
                    .append("text")
                        .attr('x', margin.top + margin.left)
                        .attr('y', function(d, i){return 30 + i * 20})
                        .text(function(d) {return d.name;})
                        .style("fill", function(d){return colorScale(d.name)})
                        .style("font-size", 15)
                        

}
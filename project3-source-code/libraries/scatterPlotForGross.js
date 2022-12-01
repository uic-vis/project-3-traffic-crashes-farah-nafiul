const grossinset = 6
function scatterPlotForGross(countryName, movieData) {
    d3.select('#grossScatter').select('svg').remove()
    var filteredCountries = movieData.filter(data => {
        return data.country === countryName;
    });

    var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = d3.select('#grossScatter').node().clientWidth,
        height = d3.select('#grossScatter').node().parentNode.clientHeight;


    // console.log(filteredCountries)
    // append the svg object to the body of the page
    const svg = d3.select('#grossScatter').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // add the x axis
    var x = d3.scaleLinear()
        .domain([1980, 2020])
        .range([margin.left + grossinset, width - margin.right - grossinset - 75]);

    // append the svg element and fix the years to have no commas
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .call(g => g.append("text")
            .attr("x", width - margin.left - 75)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text('Year →'));

    // add the y axis
    var y = d3.scaleLinear()
        .domain([0, 450000000])
        .range([height - margin.bottom - grossinset, margin.top + grossinset]);

    // append the svg element and format with M
    var g = svg.append("g").attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(10, "s"))
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text('↑ Gross'));

    // const radiusScale = d3.scaleLinear().domain([1, 10]).range([1, 10]);
    let ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // console.log(ratings)
    const colorScale = d3.scaleOrdinal().domain(ratings).range(d3.schemeCategory10);
    svg.append("g")
        // .attr("fill", fill)
        // .attr("stroke", stroke)
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(filteredCountries)
        .join("circle")
        .attr('class', 'grossCircle')
        .attr('id', (d, i) => `gross${d.score}`)
        .attr("cx", (d, i) => x(d.year))
        .attr("cy", (d, i) => y(d.gross))
        .attr("r", (d, i) => 5)
        .attr("fill", (d, i) => colorScale(d.score))
        .append('title').text((d) => {
            return (`Country: ${d.country}\nfilm: ${d.film}\nyear: ${d.year}\ngross: ${d3.format(".2s")(d.gross)}`)
        });



    let group = svg.append("g")
        .style('font-size', '0.75em')
        .style('font-family', 'sans-serif')
        .attr("transform", `translate(${margin.left + margin.right}, ${height - (margin.bottom * inset)})`)
        .attr('id', 'legends')

    group.append('g')
        .append('text')
        .attr('x', width - margin.right - inset - 125)
        .attr('y', -120)
        .attr('dy', '1em')
        .text(() => `Country:`)

    group.append('g')
        .append('text')
        .attr('x', width - margin.right - inset - 125)
        .attr('y', -105)
        .attr('dy', '1em')
        .text(() => `${countryName}`)

    group.append('g')
        .append('text')
        .attr('x', width - margin.right - inset - 125)
        .attr('y', (d, i) => (i * 10) - 78)
        .attr('dy', '1em')
        .text("Score")


    group.selectAll("legends")
        .data(ratings)
        .join('circle')
        .attr("id", d => d)
        .attr('cx', width - margin.right - inset - 125 + 10)
        .attr('cy', (d, i) => (i * 10) - 55)
        .attr("fill", (d, i) => colorScale(d))
        .attr("r", 4)
        .on('mouseover', (d, i) => {
            // console.log('mouse over', i)
            d3.selectAll('.grossCircle').attr('opacity', 0.1)
            d3.selectAll(`#gross${i}`).attr('opacity', 1)
        })
        .on('mouseout', (d) => {
            d3.selectAll('.grossCircle').attr('opacity', 1)
        })
    group.selectAll('legendText')
        .data(ratings)
        .join('text')
        .attr('x', width - margin.right - inset - 125 + 20)
        .attr('y', (d, i) => (i * 10) - 64)
        .attr('dy', '1em')
        .text(d => d)
        .on('mouseover', (d, i) => {
            // console.log('mouse over', i)
            d3.selectAll('.grossCircle').attr('opacity', 0.1)
            d3.selectAll(`#gross${i}`).attr('opacity', 1)
        })
        .on('mouseout', (d) => {
            d3.selectAll('.grossCircle').attr('opacity', 1)
        })
}


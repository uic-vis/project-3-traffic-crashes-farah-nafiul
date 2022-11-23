function BarChartForScatter(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    marginTop = 20, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 30, // the bottom margin, in pixels
    marginLeft = 40, // the left margin, in pixels
    width = 640, // the outer width of the chart, in pixels
    height = 400, // the outer height of the chart, in pixels
    xDomain, // an array of (ordinal) x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // y-scale type
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    color = "currentColor", // bar fill color
    title1,
    title2,
    title3,
    title4,
    deathCountData, mpaaRatings
} = {}) {
    d3.select('#barchart1').select('svg').remove();
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);

    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    xDomain = new d3.InternSet(xDomain);

    // Omit any data not present in the x-domain.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // Compute titles.
    if (title === undefined) {
        const formatValue = yScale.tickFormat(100, yFormat);
        if (title4) {
            const film = d3.map(data, d => d[title3])
            const totals = d3.map(data, d => d[title4])
            title = i => `${title1}: ${X[i]}
                      \n${title2}: ${formatValue(Y[i])}
                      \n${title3}: ${formatValue(film[i])}
                      \n${title4}: ${formatValue(totals[i])}`;
        } else if (title3) {
            const film = d3.map(data, d => d[title3])
            title = i => `${title1}: ${X[i]}
                      \n${title2}: ${formatValue(Y[i])}
                      \n${title3}: ${formatValue(film[i])}`;
        } else {
            title = i => `${title1}: ${X[i]}\n${title2}: ${formatValue(Y[i])}`;
        }
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    const svg = d3.select('#barchart1').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    const bar = svg.append("g")
        // .attr("fill", color)
        .selectAll("rect")
        .data(I)
        .join("rect")
        .attr('class', 'genreBar')
        .attr('id', i => X[i])
        .attr("x", i => xScale(X[i]))
        .attr("y", i => yScale(Y[i]))
        .attr("height", i => yScale(0) - yScale(Y[i]))
        .attr("width", xScale.bandwidth())
        .attr("fill", (d, i) => {
            // console.log(X[i])
            if (X[i] === 'War') {
                return '#b2df8a'
            } else {
                return color
            }
        })
        .on('click', (d, i) => {
            d3.selectAll('.genreBar').attr('fill', color)
            d3.select(`#${X[i]}`).attr('fill', '#b2df8a')

            let scatterPlotData = deathCountData.filter(death => death.genre.includes(X[i]))
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
        })
        ;

    if (title) bar.append("title")
        .text(title);

    svg.append("g")
        .style('font-size', '0.4em')
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

    // mutable scatterPlotData = deathCountData.filter(death => death.genre.includes("War"))
}
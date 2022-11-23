function Scatterplot1(data, {
    x = ([x]) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    radius = ([, radius]) => radius,
    colors = ([, colors]) => colors,
    ratings = ([, ratings]) => ratings,
    r = 3, // (fixed) radius of dots, in pixels
    title, // given d in data, returns the title
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = r * 2, // inset the default range, in pixels
    insetTop = inset, // inset the default y-range
    insetRight = inset, // inset the default x-range
    insetBottom = inset, // inset the default y-range
    insetLeft = inset, // inset the default x-range
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft + insetLeft, width - marginRight - insetRight - 100], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
    xLabel, // a label for the x-axis
    yLabel, // a label for the y-axis
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    fill = "currentcolor", // fill color for dots
    stroke = "currentColor", // stroke color for the dots
    strokeWidth = 1.5, // stroke width for dots
    halo = "#fff", // color of label halo 
    haloWidth = 3, // padding around the labels
    title1,
    title2,
    title3,
    title4,
    tooltip = true,
    mpaaRatings
} = {}) {
    // Compute values.
    d3.select('#scatter1').select('svg').remove();
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Radius = d3.map(data, radius);
    const Colors = d3.map(data, colors);
    const Ratings = d3.map(data, ratings);
    const T = title == null ? null : d3.map(data, title);
    const I = d3.range(X.length).filter(i => !isNaN(X[i]) && !isNaN(Y[i]));

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = d3.extent(Y);

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat);
    const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);

    const radiusScale = d3.scaleLinear().domain(d3.extent(Radius)).range([3, 10]);
    const colorScale = d3.scaleOrdinal().domain(mpaaRatings).range(d3.schemeCategory10);

    let toolText;
    if (tooltip === true) {
        const formatValue = yScale.tickFormat(100, yFormat);

        toolText = i => `${title3}: ${T[i]}\n${title1}: ${X[i]}\n${title2}: ${formatValue(Y[i])}\n${title4}: ${Radius[i]}`;
    }

    const svg = d3.select('#scatter1').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", marginTop + marginBottom - height)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));

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



    svg.append("g")
        // .attr("fill", fill)
        // .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .selectAll("circle")
        .data(I)
        .join("circle")
        .attr('class', 'gnCircle')
        .attr('id', i => Ratings[i])
        .attr("cx", i => xScale(X[i]))
        .attr("cy", i => yScale(Y[i]))
        .attr("r", i => radiusScale(Radius[i]))
        .attr("fill", i => colorScale(Colors[i]))
        .attr("stroke", i => colorScale(Colors[i]))
        .append('title').text(toolText);

    let group = svg.append("g")
        .style('font-size', '0.45em')
        .style('font-family', 'sans-serif')
        .attr("transform", `translate(${marginLeft + marginRight}, ${height - (marginBottom * inset)})`)
        .attr('id', 'legends')

    group.selectAll("legends")
        .data(mpaaRatings)
        .join('circle')
        .attr("id", d => d)
        .attr('cx', width - marginRight - insetRight - 125)
        .attr('cy', (d, i) => (i * 10) + 50)
        .attr("fill", (d, i) => colorScale(d))
        .attr("r", 4)
        .on('mouseover', (d, i) => {
            // console.log('mouse over', i)
            d3.selectAll('.gnCircle').attr('opacity', 0.2)
            d3.selectAll(`#${i}`).attr('opacity', 1)
        })
        .on('mouseout', (d) => {
            d3.selectAll('.gnCircle').attr('opacity', 1)
        })
    group.selectAll('legendText')
        .data(mpaaRatings)
        .join('text')
        .attr('x', width - marginRight - insetRight - 125 + 10)
        .attr('y', (d, i) => (i * 10) + 50)
        .attr('dy', '0.32em')
        .text(d => d)
        .on('mouseover', (d, i) => {
            // console.log('mouse over', i)
            d3.selectAll('.gnCircle').attr('opacity', 0.1)
            d3.selectAll(`#${i}`).attr('opacity', 1)
        })
        .on('mouseout', (d) => {
            d3.selectAll('.gnCircle').attr('opacity', 1)
        })

}
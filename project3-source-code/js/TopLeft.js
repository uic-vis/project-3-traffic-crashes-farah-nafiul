let yearDropdown = ['year', 'decade'];
let attributeDropdown = ["averageBody", "body_count", "averageLength", "averageRating", "total_film"]
let attributeSelection = 'averageBody';
let chooseYearOrDecade;

let titlesForTooltip = { 'averageBody': 'body_count', 'body_count': 'body_count', 'averageLength': 'total_length', 'averageRating': 'total_rating', 'total_film': 'total_film' }

const topLeft = (yearly_stats, decade_stats) => {
    // console.log(d3.select('#firstVis').node().clientWidth)

    chooseYearOrDecade = yearly_stats;

    d3.select('#year')
        .append('label')
        .attr('for', 'yearSelect')
        .attr('class', 'form-label')
        .text('Select Year/Decade')
        .append('select')
        .attr('class', 'form-select')
        .attr('id', 'yearSelect')
        .on('change', (d) => {
            let value = d3.select('#yearSelect').property('value');
            if (value === 'year') {
                chooseYearOrDecade = yearly_stats;
            } else {
                chooseYearOrDecade = decade_stats;
            }

            attributeSelection = d3.select('#attributeSelect').property('value')
            createFirstVis(chooseYearOrDecade, {
                x: d => d.year,
                y: d => d[attributeSelection],
                xDomain: chooseYearOrDecade.map(d => d.year), // sort by descending frequency
                yLabel: attributeSelection,
                width: d3.select('#firstVis').node().clientWidth,
                height: d3.select('#firstVis').node().clientHeight,
                color: "steelblue",
                title1: 'year',
                title2: attributeSelection,
                title3: 'total_film',
                title4: titlesForTooltip[attributeSelection]
            })

        })
        .selectAll('option')
        .data(yearDropdown)
        .enter()
        .append('option')
        .attr('value', (d) => {
            return d;
        }).text((d) => d)


    d3.select('#attribute')
        .append('label')
        .attr('for', 'attributeSelect')
        .attr('class', 'form-label')
        .text('Select Attribute')
        .append('select')
        .attr('class', 'form-select')
        .attr('id', 'attributeSelect')
        .on('change', (d) => {
            let value = d3.select('#yearSelect').property('value');
            if (value === 'year') {
                chooseYearOrDecade = yearly_stats;
            } else {
                chooseYearOrDecade = decade_stats;
            }

            attributeSelection = d3.select('#attributeSelect').property('value')
            createFirstVis(chooseYearOrDecade, {
                x: d => d.year,
                y: d => d[attributeSelection],
                xDomain: chooseYearOrDecade.map(d => d.year), // sort by descending frequency
                yLabel: attributeSelection,
                width: d3.select('#firstVis').node().clientWidth,
                height: d3.select('#firstVis').node().clientHeight,
                color: "steelblue",
                title1: 'year',
                title2: attributeSelection,
                title3: 'total_film',
                title4: titlesForTooltip[attributeSelection]
            })
        })
        .selectAll('option')
        .data(attributeDropdown)
        .enter()
        .append('option')
        .attr('value', (d) => {
            return d;
        }).text((d) => d)


    createFirstVis(chooseYearOrDecade, {
        x: d => d.year,
        y: d => d[attributeSelection],
        xDomain: chooseYearOrDecade.map(d => d.year), // sort by descending frequency
        yLabel: attributeSelection,
        width: d3.select('#firstVis').node().clientWidth,
        height: d3.select('#firstVis').node().clientHeight,
        color: "steelblue",
        title1: 'year',
        title2: attributeSelection,
        title3: 'total_film',
        title4: titlesForTooltip[attributeSelection]
    })
}


function createFirstVis(data, {
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
    title4
} = {}) {
    d3.select('#firstVis').select('svg').remove();
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
    const xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0)
        .tickSize(0)
        .tickFormat((d, i) => {
            return `'${String(d).slice(-2)}`
        });
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

    const svg = d3.select('#firstVis').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
    // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

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
        .attr("fill", color)
        .selectAll("rect")
        .data(I)
        .join("rect")
        .attr("x", i => xScale(X[i]))
        .attr("y", i => yScale(Y[i]))
        .attr("height", i => yScale(0) - yScale(Y[i]))
        .attr("width", xScale.bandwidth());

    if (title) bar.append("title")
        .text(title);

    svg.append("g")
        .style('font-size', '0.6em')
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);


    const lineXScale = d3.scaleLinear()
        .domain(d3.extent(chooseYearOrDecade, (d) => d.year))
        .range([marginLeft, width - marginRight])

    const lineYScale = d3.scaleLinear()
        .domain([0, d3.max(Y)])
        .range([height - marginBottom, marginTop])

    const lineI = d3.range(X.length);
    let defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

    // Construct a line generator.
    const line = d3.line()
        .defined(i => D[i])
        .curve(d3.curveLinear)
        .x(i => xScale(X[i]) + xScale.bandwidth() / 2)
        .y(i => yScale(Y[i]));

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", 'red')
        .attr("stroke-width", 2)
        .attr("stroke-linecap", 'round')
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", 1)
        .attr("d", line(lineI));

}
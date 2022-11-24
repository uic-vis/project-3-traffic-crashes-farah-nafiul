// function for donut chart; based on the work of Mike Bostock
// https://observablehq.com/@d3/donut-chart
function donutChart(data, {

    // given d in data, returns the (ordinal) label
    name = ([x]) => x,

    // given d in data, returns the (quantitative) value
    value = ([, y]) => y,

    // given d in data, returns the title text
    title,

    // outer width, in pixels
    width = 640,

    // outer height, in pixels
    height = 400,

    // inner radius of pie, in pixels (non-zero for donut)
    innerRadius = Math.min(width, height) / 3,

    // outer radius of pie, in pixels
    outerRadius = Math.min(width, height) / 2,

    // center radius of labels
    labelRadius = (innerRadius + outerRadius) / 2,

    // a format specifier for values (in the label)
    format = ",",

    // array of names (the domain of the color scale)
    names,

    // stroke separating widths
    stroke = innerRadius > 0 ? "none" : "white",

    // width of stroke separating wedges
    strokeWidth = 1,

    // line join of stroke separating wedges
    strokeLinejoin = "round",

    // angular separation between wedges
    padAngle = stroke === "none" ? 1 / outerRadius : 0,

} = {}) {

    d3.select('#donut').select("svg").remove()

    // Compute values.
    const N = d3.map(data, name);
    const V = d3.map(data, value);
    const I = d3.range(N.length).filter(i => !isNaN(V[i]));

    // Unique the names.
    if (names === undefined) names = N;
    names = new d3.InternSet(names);

    // Compute titles.
    if (title === undefined) {
        const formatValue = d3.format(format);

        // variable to store total number of films represented
        var totalFilms = 0;

        // determine the total films represented
        for (let aCount of data) {
            totalFilms = totalFilms + aCount.count;
        }

        // text to display
        title = i => `${N[i]}\n${formatValue(V[i])}\n${Math.round(((V[i] * 100) / totalFilms) * 100) / 100}%`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    // create svg
    const svg = d3.select('#donut').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // append g
    svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin)
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => mpaaColorCoding(N[d.data]))
        .attr("d", arc)
        .append("title")
        .text(d => title(d.data))

    // create legend inside of donut
    var legendRectSize = 3;
    var legendSpacing = 12;
    var legend = svg.selectAll('.legend')
        .data(mpaaColorCoding.domain())
        .enter()
        .append('g')
        .attr('class', 'circle-legend')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * mpaaColorCoding.domain().length / 2;
            var horz = -2 * legendRectSize - 13;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    // keys
    legend.append('circle')
        .style('fill', mpaaColorCoding)
        .style('stroke', mpaaColorCoding)
        .attr('cx', 0)
        .attr('cy', 10)
        .attr('r', '.35rem');

    // labels
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize + 10)
        .text(function (d) {
            return d;
        });

}
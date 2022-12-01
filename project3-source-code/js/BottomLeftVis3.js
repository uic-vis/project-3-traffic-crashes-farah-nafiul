let margin, visWidth, visHeight, x, y, mpaaColorCoding, mpaaRatingsCounts, mpaaRatings
let inset = 6;
const bottomLeftVis3 = (ratings, deathCountData, ratingCounts) => {
    mpaaRatings = ratings;
    mpaaRatingsCounts = ratingCounts;
    // console.log(d3.select('#scatter2').node().parentNode)
    // define the margins
    margin = ({ top: 20, right: 30, bottom: 30, left: 40 });
    // define the width of the visualization
    visWidth = d3.select('#scatter2').node().clientWidth;
    // define the height of the visualization
    visHeight = d3.select('#scatter2').node().parentNode.clientHeight;
    // define x using IMDB ratings
    // console.log(visHeight, visWidth)
    x = d3.scaleLinear()
        .domain(d3.extent(deathCountData, d => d.imdbRating)).nice()
        .range([margin.left + inset, visWidth - margin.right - inset])
    // define y using body count
    y = d3.scaleLinear()
        .domain(d3.extent(deathCountData, d => d.bodyCount)).nice()
        .range([visHeight - margin.bottom - inset, margin.top + inset])

    // map colors to MPAA rating category using standard color scheme
    mpaaColorCoding = d3.scaleOrdinal().domain(mpaaRatings).range(d3.schemeCategory10);

    brush(deathCountData);

    donutChart(mpaaRatingsCounts, {
        name: d => d.mpaa_rating,
        value: d => d.count,
        width: d3.select('#donut').node().clientWidth,
        height: d3.select('#donut').node().parentNode.clientHeight
    })
}

function xAxis(g, scale, label) {
    g.attr("transform", `translate(0,${visHeight - margin.bottom})`)
        .call(d3.axisBottom(scale))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", margin.top + margin.bottom - visHeight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", visWidth - margin.left - inset)
            .attr("y", margin.bottom - inset)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(label));
}

function yAxis(g, scale, label) {
    g.attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(scale))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", visWidth - margin.left - margin.right)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(label));
}
function brush(deathCountData) {
    d3.select('#scatter2').select('svg').remove()

    // value for when there is no brush
    const initialValue = deathCountData;

    // create the svg
    const svg = d3.select('#scatter2').append('svg')
        .attr('width', visWidth)
        .attr('height', visHeight)
        .attr("viewBox", [0, 0, visWidth, visHeight])
        .property('value', initialValue);

    // append the g element
    const g = svg.append('g')
    // .attr('transform', `translate(${margin.left}, 0)`);

    // define the x and y axes titles
    g.append("g").call(xAxis, x, 'IMDB Rating');
    g.append("g").call(yAxis, y, 'Body Count');

    // draw points
    const dots = g.selectAll('circle')
        .data(deathCountData)
        .join('circle')
        .attr('cx', d => x(d.imdbRating))
        .attr('cy', d => y(d.bodyCount))
        .attr('fill', d => mpaaColorCoding(d.mpaaRating))
        .attr('opacity', 1)
        .attr('r', 3);

    // brush functionality
    const brush = d3.brush()

        // set the space that the brush can take up
        .extent([[0, 0], [visWidth, visHeight]])

        // handle events
        .on('brush', onBrush)
        .on('end', onEnd);

    // append
    g.append('g')
        .call(brush);

    // onBrush event handler
    function onBrush(event) {

        // use event.selection to get the coordinates of the top left
        // and the bottom right of the brush box
        const [[x1, y1], [x2, y2]] = event.selection;

        // is the dot is in the brush box, return true; else, return false
        function isBrushed(d) {
            const cx = x(d.imdbRating);
            const cy = y(d.bodyCount)
            return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
        }

        // style the dots so the ones not selected are gray
        dots.attr('fill', d => isBrushed(d) ? mpaaColorCoding(d.mpaaRating) : 'gray');

        // update the data that appears in the variable for the vis
        // svg.property('value', deathCountData.filter(isBrushed)).dispatch('input');
        // console.log(deathCountData.filter(isBrushed))

        mpaaRatingsCounts = getMpaaRatingsCounts(mpaaRatings, deathCountData.filter(isBrushed))
        donutChart(mpaaRatingsCounts, {
            name: d => d.mpaa_rating,
            value: d => d.count,
            width: d3.select('#donut').node().clientWidth,
            height: d3.select('#donut').node().parentNode.clientHeight
        })
    }

    // the onEnd event handler
    function onEnd(event) {

        // if the brush is cleared
        if (event.selection === null) {

            // reset the color of all of the dots
            dots.attr('fill', d => mpaaColorCoding(d.mpaaRating));
            // svg.property('value', initialValue).dispatch('input');
            // console.log(initialValue)
            mpaaRatingsCounts = getMpaaRatingsCounts(mpaaRatings, initialValue)
            donutChart(mpaaRatingsCounts, {
                name: d => d.mpaa_rating,
                value: d => d.count,
                width: d3.select('#donut').node().clientWidth,
                height: d3.select('#donut').node().parentNode.clientHeight
            })
        }
    }

}
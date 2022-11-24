let margin, visWidth, visHeight, x, y, mpaaColorCoding
const bottomLeftVis3 = (mpaaRatings, deathCountData) => {
    // define the margins
    margin = ({ top: 10, right: 20, bottom: 50, left: 105 });
    // define the width of the visualization
    visWidth = 600;
    // define the height of the visualization
    visHeight = 500;
    // define x using IMDB ratings
    x = d3.scaleLinear()
        .domain(d3.extent(deathCountData, d => d.imdbRating)).nice()
        .range([0, visWidth])
    // define y using body count
    y = d3.scaleLinear()
        .domain(d3.extent(deathCountData, d => d.bodyCount)).nice()
        .range([visHeight, 0])

    // map colors to MPAA rating category using standard color scheme
    mpaaColorCoding = d3.scaleOrdinal().domain(mpaaRatings).range(d3.schemeCategory10);

    brush(deathCountData);
}

function xAxis(g, scale, label) {
    g.attr('transform', `translate(0, ${visHeight})`)
        // add axis
        .call(d3.axisBottom(scale))
        // remove baseline
        .call(g => g.select('.domain').remove())
        // add grid lines
        // references https://observablehq.com/@d3/connected-scatterplot
        .call(g => g.selectAll('.tick line')
            .clone()
            .attr('stroke', '#d3d3d3')
            .attr('y1', -visHeight)
            .attr('y2', 0))
        // add label
        .append('text')
        .attr('x', visWidth / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text(label)
}

function yAxis(g, scale, label) {
    // add axis
    g.call(d3.axisLeft(scale))
        // remove baseline
        .call(g => g.select('.domain').remove())
        // add grid lines
        // refernces https://observablehq.com/@d3/connected-scatterplot
        .call(g => g.selectAll('.tick line')
            .clone()
            .attr('stroke', '#d3d3d3')
            .attr('x1', 0)
            .attr('x2', visWidth))
        // add label
        .append('text')
        .attr('x', -40)
        .attr('y', visHeight / 2)
        .attr('fill', 'black')
        .attr('dominant-baseline', 'middle')
        .text(label)
}
function brush(deathCountData) {

    // value for when there is no brush
    const initialValue = deathCountData;

    // create the svg
    const svg = d3.select('#scatter2').append('svg')
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom)
        .property('value', initialValue);

    // append the g element
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

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
        svg.property('value', deathCountData.filter(isBrushed)).dispatch('input');
    }

    // the onEnd event handler
    function onEnd(event) {

        // if the brush is cleared
        if (event.selection === null) {

            // reset the color of all of the dots
            dots.attr('fill', d => mpaaColorCoding(d.mpaaRating));
            svg.property('value', initialValue).dispatch('input');
        }
    }

}
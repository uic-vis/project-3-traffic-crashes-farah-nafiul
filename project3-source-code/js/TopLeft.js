let yearDropdown = ['year', 'decade'];
let attributeDropdown = ["averageBody", "body_count", "averageLength", "averageRating", "total_film"]
let attributeSelection = 'averageBody';
let chooseYearOrDecade;

let titlesForTooltip = { 'averageBody': 'body_count', 'body_count': 'body_count', 'averageLength': 'total_length', 'averageRating': 'total_rating', 'total_film': 'total_film' }

const topLeft = (yearly_stats, decade_stats) => {
    // console.log(d3.select('#firstVis').node().parentNode.clientHeight)
    // console.log(d3.select('#firstVis').node().clientWidth)
    // console.log(d3.select('#firstVis').node().parentNode.clientHeight)

    chooseYearOrDecade = yearly_stats;

    d3.select("#year").selectAll("*").remove();
    d3.select("#attribute").selectAll("*").remove();

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
                height: d3.select('#firstVis').node().parentNode.clientHeight,
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
                height: d3.select('#firstVis').node().parentNode.clientHeight,
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
        height: d3.select('#firstVis').node().parentNode.clientHeight,
        color: "steelblue",
        title1: 'year',
        title2: attributeSelection,
        title3: 'total_film',
        title4: titlesForTooltip[attributeSelection]
    })
}



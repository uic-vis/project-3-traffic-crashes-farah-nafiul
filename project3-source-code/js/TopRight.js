let domains = {
    'totalMovies': [0, 10, 50, 100, 500, 5366],
    'avgRating': [0, 2, 4, 6, 8, 10],
    'avgGross': [0, 10000000, 50000000, 90000000, 100000000, 360000000],
    'avgRuntime': [0, 40, 80, 120, 140, 160]
}

let mapDropdown = ['totalMovies', 'avgRating', 'avgGross', 'avgRuntime']
let dataValue = 'totalMovies'
let range = ['#f7fbff', '#c6dbef', '#9ecae1', '#6baed6', '#2171b5', '#08306b']
var svg, width, height, projection, data, domain, legendOffset;
const topRight = (movieData) => {
    // The svg
    d3.select('#map').select('svg').remove()
    d3.select('#mapdropdown').selectAll('*').remove();
    

    d3.select('#mapdropdown')
        .append('label')
        .attr('for', 'mapDropdownSelect')
        .attr('class', 'form-label')
        .text('Select Attribute')
        .append('select')
        .attr('class', 'form-select')
        .attr('id', 'mapDropdownSelect')
        .on('change', (d) => {
            let value = d3.select('#mapDropdownSelect').property('value');
            // console.log(value)
            dataValue = value;
            domain = domains[dataValue]
            // console.log(domain)
            let colorScale = d3.scaleThreshold()
                .domain(domain)
                .range(range);
            d3.select('#map').select('svg').remove()
            createMap(margin, colorScale, movieData)
        })
        .selectAll('option')
        .data(mapDropdown)
        .enter()
        .append('option')
        .attr('value', (d) => {
            return d;
        }).text((d) => d)


    legendOffset = 40;
    var margin = { top: 20, right: 10, bottom: 40, left: 100 };
    width = d3.select('#map').node().clientWidth - margin.left - margin.right - legendOffset;
    height = d3.select('#map').node().parentNode.clientHeight - margin.top - margin.bottom;


    // Map and projection
    // var path = d3.geoPath();
    projection = d3.geoMercator()
        .scale(70)
        .center([0, 20])
        .translate([width / 2 - margin.left, height / 2]);

    // Data and color scale
    // console.log(new Map())
    data = new Map();
    domain = domains.totalMovies
    // range = ["#deebf7", "#c6dbef", "#6baed6", "#2171b5", "#08306b"]
    let colorScale = d3.scaleThreshold()
        .domain(domain)
        .range(range);


    createMap(margin, colorScale, movieData)

}

function createMap(margin, colorScale, movieData) {

    svg = d3.select("#map").append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Load external data and boot
    var promises = []
    promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
    promises.push(d3.csv("./data/mapData.csv", function (d) { data.set(d.code, +d[dataValue]); }))

    Promise.all(promises).then(function (topo) {
        // console.log(topo)
        let mouseOver = function (d) {
            d3.selectAll(".topo")
                // .transition()
                // .duration(200)
                .style("opacity", .5)
                .style('stroke-width', 0.5)

            d3.select(this)
                //.filter(function(d){d.total = data.get(d.id) || 0; return d.total <= max_pop && d.total >= min_pop})
                // .transition()
                // .duration(200)
                .style("opacity", 0.7)
                .style("stroke", "black")
                .style('stroke-width', 1)
        }

        let mouseLeave = function (d) {
            d3.selectAll(".topo")
                // .transition()
                // .duration(200)
                .style("opacity", .7)

            d3.selectAll(".topo")
                // .transition()
                // .duration(200)
                .style("stroke", "black")
                .style('stroke-width', 0.5)
        }

        var topo = topo[0]

        var g = svg.append('g')
        // Draw the map
        g.selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("class", "topo")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                // console.log(data.get(d.id))
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })
            .on('click', function (d, i) {
                // console.log(i.properties)
                // console.log(topo.features)
                // console.log(movieData)
                let name;
                if(i.properties.name == 'USA'){
                    name = "United States"
                }else if(i.properties.name === 'England'){
                    name = "United Kingdom"
                }else{
                    name = i.properties.name
                }
                scatterPlotForGross(name, movieData)
            })
            .style("opacity", 0.7)
            .style("stroke", "black")
            .style('stroke-width', 0.5)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .append('title')
            .text((d) => d.id + ": " + d3.format(",.2r")(d.total))


        var zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', function(event) {
                g.selectAll('path')
                .attr('transform', event.transform);
        });

        svg.call(zoom);

        // const handleZoom = (e) => g.selectAll('path').attr('transform', e.transform);

        // const zoom = d3.zoom().on('zoom', handleZoom);

        // svg.call(zoom);

        // legend
        var legend_x = width - margin.left - margin.right
        var legend_y = height - margin.top - margin.bottom - legendOffset * 1.5
        svg.append("g")
            .attr("class", "legendQuant")
            .attr("transform", "translate(" + legend_x + "," + legend_y + ")");

        var legend = d3.legendColor()
            // .shapePadding(0)
            // .shapeWidth(5)
            .labels(domains[dataValue])
            .title(dataValue)
            .scale(colorScale)


        svg.select(".legendQuant")
            .call(legend);
    })
}
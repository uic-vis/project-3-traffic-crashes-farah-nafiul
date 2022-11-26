const topRight = () => {
    // The svg
    d3.select('#topRight').select('svg').remove()
    var legendOffset = 25;
    var margin = { top: 20, right: 10, bottom: 40, left: 100 },
        width = d3.select('#topRight').node().clientWidth - margin.left - margin.right - legendOffset,
        height = d3.select('#topRight').node().clientHeight - margin.top - margin.bottom;
    var svg = d3.select("#topRight").append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Map and projection
    // var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(70)
        .center([0, 20])
        .translate([width / 2 - margin.left, height / 2]);

    // Data and color scale
    // console.log(new Map())
    var data = new Map();
    var domain = [100000000, 500000000]
    var labels = ["< 100 M", "100 M - 500 M", "> 500 M"]
    var range = ["#F8CAEE", "#BF76AF", "#852170"]
    var colorScale = d3.scaleThreshold()
        .domain(domain)
        .range(range);

    // Load external data and boot
    var promises = []
    promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
    promises.push(d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function (d) { data.set(d.code, +d.pop); }))

    myDataPromises = Promise.all(promises).then(function (topo) {
        console.log(topo)



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

        // Draw the map
        svg.append("g")
            .selectAll("path")

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
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })
            .style("opacity", 0.7)
            .style("stroke", "black")
            .style('stroke-width', 0.5)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .append('title')
            .text((d) => d.id + ": " + d3.format(",.2r")(d.total))

        // legend
        var legend_x = width - margin.left - margin.right - legendOffset
        var legend_y = height - margin.top - margin.bottom - legendOffset
        svg.append("g")
            .attr("class", "legendQuant")
            .attr("transform", "translate(" + legend_x + "," + legend_y + ")");

        var legend = d3.legendColor()
            .labels(labels)
            .title("Population")
            .scale(colorScale)


        svg.select(".legendQuant")
            .call(legend);
    })

}
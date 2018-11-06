// CHART 1: MAP OF LONGITUDE AND LATITUDE OF EARTHQUAKES

// API needed to use the maps, I registered an account with Mapbox and recieved a public key
mapboxgl.accessToken = 'pk.eyJ1Ijoic2JpZW56IiwiYSI6ImNqbjB6MDA3ZDR1ZGIza255czJsbDJoa28ifQ.8VYFsHV8mrc0Ui410y81Ug';

// create map using library
var map = new mapboxgl.Map({
    container: 'map_view',
    style: 'mapbox://styles/mapbox/bright-v9',
    center: [0,0],
    zoom: 0.15
});

// disable function where user scrolls down and map zooms in/out (can be annoying)
map.scrollZoom.disable()

// allow user to zoom in and out of map
map.addControl(new mapboxgl.Navigation());

// add data attribute layer
var container = map.getCanvasContainer();
var svg = d3.select(container).append("svg");

// learned how to parse data input from http://learnjsdata.com/read_data.html
d3.csv("https://stephanie-bienz.github.io/cse578/SignificantEarthquakes.csv", function(d) {
    return {
        date : d.Date,
        time : d.Time,
        latitude : +d.Latitude,
        longitude : +d.Longitude,
        type : d.Type,
        depth: +d.Depth,
        depth_error : +d["Depth Error"],
        depth_seismic_stations : +d["Depth Seismic Stations"],
        magnitude : +d.Magnitude,
        magnitude_type : d["Magnitude Type"],
        magnitude_error : +d["Magnitude Error"],
        magnitude_seismic_stations : +d["Magnitude Seismic Stations"],
        azimuthal_gap : +d["Azimuthal Gap"],
        horizontal_distance : +d["Horizontal Distance"],
        horizontal_error : +d["Horizontal Error"],
        root_mean_square : +d["Root Mean Square"],
        id : d.ID,
        source : d.Source,
        location_source : d["Location Source"],
        magnitude_source : d["Magnitude Source"],
        status: d.Status
    };
}, function(data) {
    // append dots to data attribute layer
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d,i) { return "mapview" + i; })
        .attr("r", 2)
        .style({
            fill: "indigo",
            "fill-opacity": 0.3
        })
        .on("mouseover", function(d, i) { // emphasize dot on both charts
            d3.selectAll("circle.mapview" + i)
                .attr("r", 10)
                .style({
                    fill: "aquamarine",
                    "fill-opacity": 1,
                    stroke: "black",
                    "stroke-width": 1
                })
            d3.selectAll("circle.detailview" + i)
                .attr("r", 10)
                .style({
                    fill: "aquamarine",
                    "fill-opacity": 1,
                    stroke: "black",
                    "stroke-width": 1
                });
        })
        .on("mouseout", function(d, i) { // un-emphasize dot on both charts
            d3.selectAll("circle.mapview" + i)
                .attr("r", 2)
                .style({
                    fill: "indigo",
                    "fill-opacity": 0.4,
                    stroke: "black",
                    "stroke-width": 0
            })
            d3.selectAll("circle.detailview" + i)
                .attr("r", 2)
                .style({
                    fill: "indigo",
                    "fill-opacity": 1,
                    stroke: "black",
                    "stroke-width": 0
            });
        });
    // create the initial map centered at lng=0, lat=0 and 0.15 zoom to show all data points
    createMap();

    // Whenever the map is dragged by the user, recreate the map and data attribute layer
    map.on("move", function() {
        createMap();
    })

    // Whenever the map is zoomed in/out by the user, recreate the map and data attribute layer
    map.on("viewreset", function() {
        createMap();
    })

    // create the map with the points plotted at the lng and lat locations
    function createMap() {
        svg.selectAll("circle")
            .data(data)
            .attr({
                cx: 
                    function(d) { 
                        var x = projectPoints(d).x;
                        return x;
                    },
                cy: 
                    function(d) { 
                        var y = projectPoints(d).y;
                        return y;
                    }
            })
    }
});

// helper function to add points to the data attribute layer
function projectPoints(d) {
    return map.project(getLngLat(d));
}

// helper function to the project points function to get the lng and lat
function getLngLat(d) {
    return new mapboxgl.LngLat(+d.longitude, +d.latitude);
}

// CHART 2: DEPTH VS. MAGNITUDE //

// set margins for padding
var margin = {top: 5, right: 20, bottom: 30, left: 50},
    width = 575 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// x and y axis scaled linearly
var x1 = d3.scale.linear().range([0, width]);
var y1 = d3.scale.linear().range([height, 0]);

// create x axis
var xAxis = d3.svg.axis()
    .scale(x1)
    .orient("bottom")
    .ticks(12)
    .tickSize(1);

// create y axis
var yAxis = d3.svg.axis()
    .scale(y1)
    .orient("left")
    .ticks(10)
    .tickSize(1);

// append x and y axis to detail view container
var detail_view = d3.select("#detail_view")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top +")");

// learned how to parse data input from http://learnjsdata.com/read_data.html
d3.csv("https://stephanie-bienz.github.io/cse578/SignificantEarthquakes.csv", function(d) {
    return {
        date : d.Date,
        time : d.Time,
        latitude : +d.Latitude,
        longitude : +d.Longitude,
        type : d.Type,
        depth: +d.Depth,
        depth_error : +d["Depth Error"],
        depth_seismic_stations : +d["Depth Seismic Stations"],
        magnitude : +d.Magnitude,
        magnitude_type : d["Magnitude Type"],
        magnitude_error : +d["Magnitude Error"],
        magnitude_seismic_stations : +d["Magnitude Seismic Stations"],
        azimuthal_gap : +d["Azimuthal Gap"],
        horizontal_distance : +d["Horizontal Distance"],
        horizontal_error : +d["Horizontal Error"],
        root_mean_square : +d["Root Mean Square"],
        id : d.ID,
        source : d.Source,
        location_source : d["Location Source"],
        magnitude_source : d["Magnitude Source"],
        status: d.Status
    };
}, function(data) {
    // x domain is depth measure
    x1.domain(d3.extent(data, function(d) { return d.depth; }));

    // y domain is magnitude measure
    y1.domain(d3.extent(data, function(d) { return d.magnitude; }));

    // x axis label
    detail_view.append("text")             
        .attr("x", width / 2 )
        .attr("y",  443 )
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .text("Depth (km)");
    detail_view.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // y axis label
    detail_view.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 5)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .text("Magnitude");
    detail_view.append("g")
        .call(yAxis);

    // append dots to the detail view container chart
    detail_view.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 2)
        .attr("cx", function(d) { return x1(d.depth); })
        .attr("cy", function(d) { return y1(d.magnitude); })
        .attr("class", function(d,i) { return "detailview" + i; })
        .style("fill", "indigo")
        .style("fill-opacity", 1)
        .on("mouseover", function(d, i) { // emphasize dot on both charts
            d3.selectAll("circle.detailview" + i)
                .attr("r", 10)
                .style({
                    fill: "aquamarine",
                    "fill-opacity": 1,
                    stroke: "black",
                    "stroke-width": 1
                })
            d3.selectAll("circle.mapview" + i)
                .attr("r", 10)
                .style({
                    fill: "aquamarine",
                    "fill-opacity": 1,
                    stroke: "black",
                    "stroke-width": 1
                });
        })
        .on("mouseout", function(d, i) { // un-emphasize dot on both charts
            d3.selectAll("circle.detailview" + i)
                .attr("r", 2)
                .style({
                    fill: "indigo",
                    "fill-opacity": 1,
                    stroke: "black",
                    "stroke-width": 0
            })
            d3.selectAll("circle.mapview" + i)
                .attr("r", 2)
                .style({
                    fill: "indigo",
                    "fill-opacity": 0.4,
                    stroke: "black",
                    "stroke-width": 0
            });
        });
});
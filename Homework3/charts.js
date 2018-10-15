mapboxgl.accessToken = 'pk.eyJ1Ijoic2JpZW56IiwiYSI6ImNqbjB6MDA3ZDR1ZGIza255czJsbDJoa28ifQ.8VYFsHV8mrc0Ui410y81Ug';
var map = new mapboxgl.Map({
    container: 'map_view',
    style: 'mapbox://styles/mapbox/bright-v9',
    center: [0,0],
    zoom: 0.15
});

map.scrollZoom.disable()
map.addControl(new mapboxgl.Navigation());

var container = map.getCanvasContainer()
var svg = d3.select(container).append("svg")

var cValue = function(d) { return d.type; },
    color = d3.scale.category10();

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
}, function (data) {
    var dots = svg.selectAll("circle")
        .data(data)
      
    dots.enter()
        .append("circle")
        .attr("class", function(d,i) { return "mapview" + i; })
        .attr("r", 2)
        .style({
            fill: "slateblue",
            "fill-opacity": 0.4
        })
        .on("mouseover", function(d, i) {
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
        .on("mouseout", function(d, i) {
            d3.selectAll("circle.mapview" + i)
                .attr("r", 2)
                .style({
                    fill: "slateblue",
                    "fill-opacity": 0.4,
                    stroke: "black",
                    "stroke-width": 0
            })
            d3.selectAll("circle.detailview" + i)
                .attr("r", 2)
                .style({
                    fill: "slateblue",
                    "fill-opacity": 1,
                    stroke: "black",
                    "stroke-width": 0
            });
        });
      
      function render() {
        dots.attr({
            cx: function(d) { 
                var x = project(d).x;
                return x
            },
            cy: function(d) { 
                var y = project(d).y;
                return y
            }
        })
      }

    // re-render our visualization whenever the view changes
    map.on("viewreset", function() {
        render()
    })
    map.on("move", function() {
        render()
    })

    // render our initial visualization
    render()
});

function project(d) {
    return map.project(getLL(d));
}
function getLL(d) {
    return new mapboxgl.LngLat(+d.longitude, +d.latitude)
}

// Chart 2 - depth and type
var indexOfSelection = 0; 

var margin = {top: 5, right: 20, bottom: 30, left: 50},
    width = 575 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var x1 = d3.scale.linear().range([0, width]);
var y1 = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x1)
    .orient("bottom")
    .ticks(12)
    .tickSize(1);

var yAxis = d3.svg.axis()
    .scale(y1)
    .orient("left")
    .ticks(10)
    .tickSize(1);

var detail_view = d3.select("#detail_view").append("svg")
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
}, function (data) {
    x1.domain(d3.extent(data, function(d) { return d.depth; }));
    y1.domain(d3.extent(data, function(d) { return d.magnitude; }));

    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    detail_view.append("text")             
        .attr("x", width / 2 )
        .attr("y",  443 )
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .text("Depth (km)");
    detail_view.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

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

    detail_view.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 2)
        .attr("cx", function(d) { return x1(d.depth); })
        .attr("cy", function(d) { return y1(d.magnitude); })
        .attr("class", function(d,i) { return "detailview" + i; })
        .style("fill", "slateblue")
        .style("fill-opacity", 1)
        .on("mouseover", function(d, i) {
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
        .on("mouseout", function(d, i) {
            d3.selectAll("circle.detailview" + i)
                .attr("r", 2)
                .style({
                    fill: "slateblue",
                    "fill-opacity": 1,
                    stroke: "black",
                    "stroke-width": 0
            })
            d3.selectAll("circle.mapview" + i)
                .attr("r", 2)
                .style({
                    fill: "slateblue",
                    "fill-opacity": 0.4,
                    stroke: "black",
                    "stroke-width": 0
            });
        });
});
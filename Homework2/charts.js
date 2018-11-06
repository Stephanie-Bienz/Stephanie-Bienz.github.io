// NOTE!!!!
// Both charts were inspired from the simple code outlined in the online book "D3 Tips and Tricks v4"

/****************************************************************
 *********************** OVERVIEW CHART *************************
 ** Scatter Plot of Total Points of a Match for Winner & Loser **
 ****************************************************************/

// Tracking item selected on overview chart
// *Note that indexOfSelection = 0 starts at column 2 of the csv file
var indexOfSelection = 0; 

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 575 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var overview = d3.select("#overview").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top +")");

function make_x_gridlines() { return d3.axisBottom(x)
    .ticks(10)
}

function make_y_gridlines() { return d3.axisLeft(y)
    .ticks(10)
}

function make_y_gridlines2() { return d3.axisLeft(y2)
    .ticks(10)
}

// learned how to parse data input from http://learnjsdata.com/read_data.html
d3.csv("https://stephanie-bienz.github.io/cse578/10yearAUSOpenMatches.csv", function(d) {
    return {
        round : d.round, // first, second, third, fourth, quarter, semi, final
        winner : d.winner, // useless - identical to player1
        results : d.results, // set points
        year : +d.year, // year of Australian open professional men's tennis match
        gender : d.gender, // useless - only male players
        player1 : d.player1, // winner
        player2 : d.player2, // loser
        country1 : d.country1, // winner country
        country2 : d.country2, // loser country
        firstServe1 : parseFloat(d.firstServe1)/100.0, // winner - first serve inside the service box percentage
        firstServe2 : parseFloat(d.firstServe2)/100.0, // loser - first serve inside the service box percentage
        ace1 : +d.ace1, // winner - the number of good serves not received by the opponent
        ace2 : +d.ace2, // loser - the number of good serves not received by the opponent
        double1 : +d.double1, // winner - the number of double faults (on a service point, the player fails to serve inside the service box on both chances)
        double2 : +d.double2, // loser - the number of double faults (on a service point, the player fails to serve inside the service box on both chances)
        firstPointWon1 : parseFloat(d.firstPointWon1)/100.0,  // winner - points won on the first serve percentage
        firstPointWon2 : parseFloat(d.firstPointWon2)/100.0, // loser - points won on the first serve percentage
        secPointWon1 : parseFloat(d.secPointWon1)/100.0, // winner - points won on the second serve percentage
        secPointWon2 : parseFloat(d.secPointWon2)/100.0, // loser - points won on the second serve percentage
        fastServe1 : +d.fastServe1, // winner - the fastest serve of the player in KPH
        fastServe2 : +d.fastServe2, // loser - the fastest serve of the player in KPH
        avgFirstServe1 : +d.avgFirstServe1, // winner - the average first serve speed of the player in KPH
        avgFirstServe2 : +d.avgFirstServe2, // loser - the average first serve speed of the player in KPH
        avgSecServe1 : +d.avgSecServe1, // winner - the average second serve speed in KPH
        avgSecServe2 : +d.avgSecServe2, // loser - the average second serve speed in KPH
        break1 : parseFloat(d.break1)/100.0, // winner - break point conversion percentage
        break2 : parseFloat(d.break2)/100.0, // loser - break point conversion percentage
        return1 : parseFloat(d.return1)/100.0, // winner - percentage of return points won
        return2 : parseFloat(d.return2)/100.0, // loser - percentage of return points won
        total1 : +d.total1, // winner - total points won in the game
        total2 : +d.total2, // loser - total points won in the game
        winner1 : +d.winner1, // winner - points won that were not received by the opponent
        winner2 : +d.winner2, // loser - points won that were not received by the opponent
        error1 : +d.error1, // winner - the number of errors committed (hitting out of bounds, etc.)
        error2 : +d.error2, // loser - the number of errors committed (hitting out of bounds, etc.)
        net1 : parseFloat(d.net1)/100.0, // winner - when approaching the net, the percentage of points won
        net2 : parseFloat(d.net2)/100.0 // loser - when approaching the net, the percentage of points won
    };
}).then( function (data) {
    x.domain(d3.extent(data, function(d) { return d.total2; }));
    y.domain(d3.extent(data, function(d) { return d.total1; }));

    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    overview.append("text")             
        .attr("x", width / 2 )
        .attr("y",  480 )
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .text("Loser Total Points Won");
    overview.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    overview.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 2)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .text("Winner Total Points Won");
    overview.append("g")
        .call(d3.axisLeft(y));

    // gridlines will show up behind data points
    overview.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )
    overview.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

    overview.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.total2); })
        .attr("cy", function(d) { return y(d.total1); })
        .style("fill", "blue")
        .style("fill-opacity", .5)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html(d.player1 + " (" + d.total1 + ") vs. " + d.player2 + " (" +  d.total2 + ")")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(d, i) {
            indexOfSelection = i;
            d3.select("detail").remove();
            detail.selectAll("g").remove();
            updateData(data);
        });
});

/****************************************************************
 ************************ DETAIL CHART **************************
 ******* Bar Chart of Stats for Each Player in the Match ********
 ****************************************************************/

// tracking active radio button
var buttonName;

var x2 = d3.scaleBand() 
    .range([0, width])
    .padding(0.1); 
var y2 = d3.scaleLinear()
    .range([height, 0]);

var detail = d3.select("#detail")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// learned how to parse data input from http://learnjsdata.com/read_data.html
d3.csv("https://stephanie-bienz.github.io/cse578/10yearAUSOpenMatches.csv", function(d) {
    return {
        round : d.round, // first, second, third, fourth, quarter, semi, final
        winner : d.winner, // useless - identical to player1
        results : d.results, // set points
        year : +d.year, // year of Australian open professional men's tennis match
        gender : d.gender, // useless - only male players
        player1 : d.player1, // winner
        player2 : d.player2, // loser
        country1 : d.country1, // winner country
        country2 : d.country2, // loser country
        firstServe1 : parseFloat(d.firstServe1)/100.0, // winner - first serve inside the service box percentage
        firstServe2 : parseFloat(d.firstServe2)/100.0, // loser - first serve inside the service box percentage
        ace1 : +d.ace1, // winner - the number of good serves not received by the opponent
        ace2 : +d.ace2, // loser - the number of good serves not received by the opponent
        double1 : +d.double1, // winner - the number of double faults (on a service point, the player fails to serve inside the service box on both chances)
        double2 : +d.double2, // loser - the number of double faults (on a service point, the player fails to serve inside the service box on both chances)
        firstPointWon1 : parseFloat(d.firstPointWon1)/100.0,  // winner - points won on the first serve percentage
        firstPointWon2 : parseFloat(d.firstPointWon2)/100.0, // loser - points won on the first serve percentage
        secPointWon1 : parseFloat(d.secPointWon1)/100.0, // winner - points won on the second serve percentage
        secPointWon2 : parseFloat(d.secPointWon2)/100.0, // loser - points won on the second serve percentage
        fastServe1 : +d.fastServe1, // winner - the fastest serve of the player in KPH
        fastServe2 : +d.fastServe2, // loser - the fastest serve of the player in KPH
        avgFirstServe1 : +d.avgFirstServe1, // winner - the average first serve speed of the player in KPH
        avgFirstServe2 : +d.avgFirstServe2, // loser - the average first serve speed of the player in KPH
        avgSecServe1 : +d.avgSecServe1, // winner - the average second serve speed in KPH
        avgSecServe2 : +d.avgSecServe2, // loser - the average second serve speed in KPH
        break1 : parseFloat(d.break1)/100.0, // winner - break point conversion percentage
        break2 : parseFloat(d.break2)/100.0, // loser - break point conversion percentage
        return1 : parseFloat(d.return1)/100.0, // winner - percentage of return points won
        return2 : parseFloat(d.return2)/100.0, // loser - percentage of return points won
        total1 : +d.total1, // winner - total points won in the game
        total2 : +d.total2, // loser - total points won in the game
        winner1 : +d.winner1, // winner - points won that were not received by the opponent
        winner2 : +d.winner2, // loser - points won that were not received by the opponent
        error1 : +d.error1, // winner - the number of errors committed (hitting out of bounds, etc.)
        error2 : +d.error2, // loser - the number of errors committed (hitting out of bounds, etc.)
        net1 : parseFloat(d.net1)/100.0, // winner - when approaching the net, the percentage of points won
        net2 : parseFloat(d.net2)/100.0 // loser - when approaching the net, the percentage of points won
    };
}).then( function (data) {
    x2.domain([data[indexOfSelection].player1, data[indexOfSelection].player2]);
    y2.domain([0, 1.0]);
    
    detail.selectAll(".bar")
        .data(data.filter(function(d) { return data[indexOfSelection].player1;}))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x2(data[indexOfSelection].player1); }) 
        .attr("width", x2.bandwidth())
        .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].firstServe1)); }) 
        .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].firstServe1)); });
    
    detail.selectAll(".bar2")
        .data(data.filter(function(d) { return data[indexOfSelection].player2;}))
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", function(d) { return x2(data[indexOfSelection].player2); }) 
        .attr("width", x2.bandwidth())
        .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].firstServe2)); }) 
        .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].firstServe2)); });

    detail.append("text")             
        .attr("x", width / 2 )
        .attr("y",  480 )
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .text("Winner/Loser");
    detail.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x2));

    detail.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .text("Percentage");
    detail.append("g")
        .call(d3.axisLeft(y2));
});

function updateData(data) {
    // get currently active radio button
    activeButton();

    x2.domain([data[indexOfSelection].player1, data[indexOfSelection].player2]);
    y2.domain([0, 1.0]);
    
    // i'm really sorry, some very aggressive hard-coding transpired here...
    if( buttonName == "firstServe" ) {
        detail.selectAll(".bar")
            .attr("x", function(d) { return x2(data[indexOfSelection].player1); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].firstServe1)); })
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].firstServe1)); });

        detail.selectAll(".bar2")
            .attr("x", function(d) { return x2(data[indexOfSelection].player2); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].firstServe2)); }) 
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].firstServe2)); });
    }
    else if( buttonName == "firstPointWon" ) {
        detail.selectAll(".bar")
            .attr("x", function(d) { return x2(data[indexOfSelection].player1); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].firstPointWon1)); })
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].firstPointWon1)); });

        detail.selectAll(".bar2")
            .attr("x", function(d) { return x2(data[indexOfSelection].player2); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].firstPointWon2)); }) 
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].firstPointWon2)); });
    }
    else if( buttonName == "secPointWon" ) {
        detail.selectAll(".bar")
            .attr("x", function(d) { return x2(data[indexOfSelection].player1); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].secPointWon1)); })
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].secPointWon1)); });

        detail.selectAll(".bar2")
            .attr("x", function(d) { return x2(data[indexOfSelection].player2); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].secPointWon2)); }) 
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].secPointWon2)); });
    }
    else if( buttonName == "break" ) {
        detail.selectAll(".bar")
            .attr("x", function(d) { return x2(data[indexOfSelection].player1); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].break1)); })
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].break1)); });

        detail.selectAll(".bar2")
            .attr("x", function(d) { return x2(data[indexOfSelection].player2); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].break2)); }) 
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].break2)); });
    }
    else if( buttonName == "return" ) {
        detail.selectAll(".bar")
            .attr("x", function(d) { return x2(data[indexOfSelection].player1); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].return1)); })
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].return1)); });

        detail.selectAll(".bar2")
            .attr("x", function(d) { return x2(data[indexOfSelection].player2); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].return2)); }) 
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].return2)); });
    }
    else if( buttonName == "net" ) {
        detail.selectAll(".bar")
            .attr("x", function(d) { return x2(data[indexOfSelection].player1); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].net1)); })
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].net1)); });

        detail.selectAll(".bar2")
            .attr("x", function(d) { return x2(data[indexOfSelection].player2); }) 
            .attr("y", function(d) { return y2(checkIndex(data[indexOfSelection].net2)); }) 
            .attr("height", function(d) { return height - y2(checkIndex(data[indexOfSelection].net2)); });
    }
    
    // update x axis with new domain
    detail.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x2));
    
    // re-append y axis
    detail.append("g")
        .call(d3.axisLeft(y2));
}

// helper function to avoid errors when null is seen
var checkIndex = function(item) {
    if(item == NaN) {
        item = 0;
    }
    return item;
}

// helper function to sniff active radio button
function activeButton() {
    var form1 = document.getElementById("form");
    for (var i = 0; i < form1.length ;i++) {
        if(form1.elements[i].checked == true)
        {
            buttonName = form1.elements[i].value;
        }
    }
}
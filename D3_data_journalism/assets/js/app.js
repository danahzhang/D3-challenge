var usa ={
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Washington D.C.': 'DC',
    'Federated States Of Micronesia': 'FM',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Marshall Islands': 'MH',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Palau': 'PW',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
  };

    //Retrieving Json file
    var myJSON = JSON.stringify(usa);
    var obj = JSON.parse(myJSON);

  
  function makeResponsive() {
    var svgArea = d3.select("body").select("svg").attr('class', 'chart');

    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window with adjustments
    var svgWidth = window.innerWidth-100;
    var svgHeight = window.innerHeight-100;

    var margin = {
      top: 80,
      right: 100,
      bottom: 80,
      left: 100
    };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Select body, append SVG area to it, and set its dimensions
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    

    // Append a group area, then set its margins
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Create Function to Find Abbreviation
    function statesAb(d){
        for (i = 0; i < usa.length; i++){
            if ( d.state== usa[i].name );{ return usa[i].abbreviation; }}
    };

    

    // Load data from csv
    d3.csv("assets/data/data.csv").then(function(theData) {

        // parse data
        theData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        });

        // Configure two linear scales
        var x = d3.scaleLinear()
        .domain([d3.min(theData, data => data.poverty)-2, d3.max(theData, data => data.poverty)+2])
        .range([0, chartWidth]);

        var y = d3.scaleLinear()
        .domain([d3.min(theData, data => data.smokes)-2, d3.max(theData, data => data.smokes)+2])
        .range([chartHeight, 0]);

        //Create the axes
        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        // Append an SVG group element to the chartGroup, create the axises inside of it
        chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

        chartGroup.append("g")
        .classed("axis", true)
        .call(yAxis);

        //Create scatter points
        var dots = chartGroup.append("g")
        .selectAll("circle")
        .data(theData)
        .enter()
        .append("circle")
        .attr('class', 'stateCircle')
        .attr("cx", d => x(d.poverty))
        .attr("cy", d => y(d.smokes))
        .attr("r", "15")
        .attr("fill", "black")
        .attr("opacity", .5);

        //Tooltip
        var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (d.state+"<br/>Poverty: "+ d.poverty+ "%<br/> Smokes: "+d.smokes+"%");
        });

        chartGroup.call(toolTip);

        dots.on("mouseover", function(d) {
        toolTip.show(d, this);
        })

        .on("mouseout", function(d) {
            toolTip.hide(d);
        });
        
        //Text in Circles
        var text = chartGroup.append("g")
        .selectAll("text")
        .data(theData)
        .enter()
        .append("text")
        .attr("style", "stateText")  
        .attr("text-anchor", "middle")
        .attr("x", d => x(d.poverty))
        .attr("y", d => y(d.smokes)+5)
        .text(function(d) {
            var theState = d.state;
            return obj[d.state];});

        // Add X axis label:
        chartGroup.append("text")
        .attr("text-anchor", "end")
        .attr("class","aText")
        .attr("x", chartWidth/2 )
        .attr("y", chartHeight + .5*(margin.top))
        .text("In Poverty (%)");

        // Y axis label:
        chartGroup.append("text")
        .attr("text-anchor", "end")
        .attr("class","aText")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left/2)
        .attr("x", - chartHeight/2)
        .text("Smokes (%)");


        
        //for (i = 0; i < usa.length; i++){ if (usa[i].name = d.state){ return usa[i].abbreviation }};
    }).catch(function(error) {
      console.log(error);
    });
}
// When the browser loads, makeResponsive() is called.

makeResponsive();

d3.select(window).on("resize", makeResponsive);
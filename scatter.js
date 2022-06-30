var parseDate = d3.timeParse("%d/%m/%Y");


mycolour = d3.rgb("#f7f7f7");
//
// var Doc2 = `Date	number	Owner		Doc
// 6/16/2000	3	molly	3	rat
// 2/25/2002	4	may	2	cat
// 12/05/2004	3	molly	4	fish
// 07/06/2006	1	milly	1	dog
// 09/07/2003	4	may	4	fish
// 12/10/2001	4	may	3	rat
// 6/15/2005	2	maggie	3	rat
// 06/09/2004	1	milly	4	fish
// 10/05/2005	1	milly	3	rat
// 10/07/2003	4	may	1	dog
// 1/19/2009	4	may	2	cat
// 10/30/2007	1	milly	4	fish
// 8/13/2009	4	may	2	cat
// 9/30/2004	3	molly	1	dog
// 1/17/2006	4	may	3	rat
// 12/18/2009	3	molly	1	dog
// 11/02/2007	2	maggie	3	rat
// 4/17/2007	1	milly	4	fish`;

d3.csv("All.csv")
  .row(function(d) {return{
    Owner: d.Owner,
    Date: d.Date,
    ShortNames: d.ShortNames,
    Doc: d.Doc,
    Type: d.Type,
    FileHash: d.FileHash,
    Owner: d.Owner,
    Doc: d.Doc,
    }; })
  .get(function(error,data){



var height = 500;
var width = 1000;



function sortByDateAscending(a, b) {
  return a.Date - b.Date;
}

data = data.sort(sortByDateAscending);


margin = {
  top: 40,
  right: 50,
  bottom: 0,
  left: 200
};

var minDate = new Date(2018, 11, 1);
var maxDate = new Date(2021, 1, 1);



var y = d3.scalePoint()
  .domain(['MUPPET CAPER', 'MUPPET MOVIE', 'MUPPETS TAKE MANHATTAN', 'MUPPET TREASURE ISLAND', 'MUPPETS MOST WANTED', 'MUPPET SHOW'])
  .range([height, 0])
  .padding(0.2);

var x = d3.scaleTime()
  .domain([minDate, maxDate])
  .range([0, width]);

var yAxis = d3.axisLeft(y);
var xAxis = d3.axisBottom(x);

var svg = d3.select("#chart").append("svg").attr("height", height + 100).attr("width", width + 500);

var chartGroup = svg.append("g").attr("transform", "translate(" + margin.left +"," + margin.top + ")")

var line = d3.line()
  .x(function(d) {
    return x(d.Date);
  })
  .y(function(d) {
    return y(d.ShortNames);
  });



// var redBox = chartGroup.append("rect")
//   .attr("y", 0)
//   .attr("width", width)
//   .attr("height", height)
//   .attr("fill", mycolour)
//   .append("g");

var nest = d3.nest()
  .key(function(d) {
    return d.Owner;
  })
  .entries(data);


var cat20 = d3.schemeCategory20

console.log(typeof(cat20))

var colors = d3.scaleOrdinal()
  .domain(function(d) {
    return colors(d.key)
  })
  .range(cat20);

var legend = d3.select("#legend")

.append("svg")
  .attr("class", "legend")
  .attr("width", 125)
  .attr("height", 1000)
  .selectAll("g")
  .data(d3.range(31))
  .enter()
  .append("g")
  .attr("transform", function(d, i) {
    return "translate(0," + i * 25 + ")";
  });

legend.append("rect")
  .data(nest)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d) {return colors(d.key)})
  .style('stroke', "Grey");

legend.append("text")
  .data(nest)
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .text(function(d) {
    return d.key;
  });

var line = d3.line()
  .x(function(d, i) {
    return x(d.Date);
  })
  .y(function(d, i) {
    return y(d.ShortNames);
  });

// var lines = chartGroup.selectAll(".line")
//   .data(nest)
//   .enter()
//   .append("path")
//   .style("opacity", 0)
//   .attr("class", "line")
//   .attr("d", function(d) {
//     return line(d.values)
//   })
//   .attr("stroke", function(d) {
//     return colors(d.key)
//   })
//   .attr("stroke-width", "2px")
//   .style("stroke-dasharray", ("3, 3"));

var circles = chartGroup.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .attr("cx", function(d) {
    return x(parseDate(d.Date));
  })
  .attr("cy", function(d) {
    return y(d.ShortNames);
  })
  .attr("r", 6)
  .attr("fill", function(d,i) {
    return colors(d.Owner);
  });

var textbox = d3.select('#textbox').append("div").append('g')
    .attr("class", "tooltip")
    .style("opacity", 0)
    .attr("width","1000px");

d3.select("button").on("click", function() {
  var txtName = d3.select("#txtName").node().value;
  // var meow = function(frat) {return frat.includes(txtName)};
  circles.style("r", function(d) {
    return d.Doc.toLowerCase().includes(txtName) ? 6 : 0;//where you change the variable that changes the opacity after searchio
  })
  lines.style("opacity", function(d) {
    return d.key === txtName ? 1 : 0;
  })
})

svg.selectAll("circle")
.on('mouseover', function(d, i) {
  d3.select(this)
  // upDateData(d.hash);
  i++
  textbox.transition()
    .style('opacity', 0)
    .on("end", function() {
      d3.select(this)
        .text(d.Doc)//changes what's in the textbox
        .transition()
        .style('opacity', 1)
      })
    })
svg.selectAll("circle")
.on('mouseleave', function(d, i) {
    d3.select(this)
    .style("fill", colors(d.Owner))
})


chartGroup.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(14));
chartGroup.append("g").attr("class", "y axis").call(d3.axisLeft(y).ticks(34).tickSize(-width));

// function upDateData(h)
//    {
//      svg.selectAll("circle").style("fill", function(d, i) {
//        return d.hash == h ?  "blue" : colors(d.Owner);//changes colour
//  })
//  svg.selectAll("circle").style("stroke", function(d, i) {
//    return d.hash == h ?  "yellow": "blue";
// })
   // svg.selectAll("circle").style("stroke-width", function(d, i) {
   //   return d.hash == h ?  "1px": "0px";
   // })
// }

})

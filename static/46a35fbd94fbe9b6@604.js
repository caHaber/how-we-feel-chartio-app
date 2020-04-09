// https://observablehq.com/d/46a35fbd94fbe9b6@604
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Distinct Session Id by Zip_2020-04-07-192620.csv",new URL("./files/0c3b439a81a50ae2c41fc1e72b3ac40041ba7e1cc975cdacf716e732d6cd0e62569339dd8b06e5f41fcfed7c2b6423bd205c523fabda31ebf1de1abdf07adf2e",import.meta.url)],["Zip Code Tabulation Area Boundaries.geojson",new URL("./files/b9ef86c10549f21264cce1bdcd65833896e084f2ff87a093f9cca44d3b03e3af35530e4c79895ca849748d5c51d1596dafd87a984065dfdf854ebd97319819a6",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Cartogram for COVID cases in CT

Scaled to number of users.`
)});
  main.variable(observer("viewof c")).define("viewof c", ["make_map"], function(make_map){return(
make_map()
)});
  main.variable(observer("c")).define("c", ["Generators", "viewof c"], (G, _) => G.input(_));
  main.variable(observer("viewof legend")).define("viewof legend", ["d3","DOM","fill"], function(d3,DOM,fill){return(
(function() {
  const margin = { top: 20, left: 10, right: 10, bottom: 15 };
  const width = 500 - margin.left - margin.right;
  const height = 80 - margin.top - margin.bottom;
  const svg = d3
    .select(
      DOM.svg(
        width + margin.left + margin.right,
        height + margin.top + margin.bottom
      )
    )
    .style("max-width", "100%")
    .style("height", "auto");
  const format = d3.format(".1f");
  const xScale = d3
    .scaleLinear()
    .range([margin.left, width - margin.right])
    .domain(d3.extent(fill.domain()));

  svg
    .selectAll("rect")
    .data(fill.range().map(d => fill.invertExtent(d)))
    .enter()
    .append("rect")
    .attr("height", 20)
    .attr("y", margin.top)
    .attr("x", (d, i) => i * 50)
    .attr("width", d => 50)
    .attr("fill", d => fill(d[0]));

  svg
    .append("text")
    .attr("class", "caption")
    .attr("x", xScale.range()[0])
    .attr("y", 10)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .text(`Unique Users`);

  svg
    .selectAll("text")
    .data(fill.range().map(d => fill.invertExtent(d)[0]))
    .enter()
    .append("text")
    .classed('legend-text', true)
    .attr("text-anchor", "middle")
    .attr("y", height + margin.bottom)
    .attr("x", (d, i) => i * 50)
    .text(d => Math.round(d));

  svg
    .selectAll("circle")
    .data(
      fill
        .range()
        .splice(1)
        .map(d => fill.invertExtent(d)[0])
    )
    .enter()
    .append("circle")
    .classed("legend-circles", true)
    .attr("cy", height - 5)
    .attr("cx", (d, i) => (i + 1) * 50)
    .attr("r", 3);

  return svg.node();
})()
)});
  main.variable(observer("legend")).define("legend", ["Generators", "viewof legend"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`## Code`
)});
  main.variable(observer("make_map")).define("make_map", ["d3","map_width","map_height","counties","geoGenerator","fill","proportion","tippy"], function(d3,map_width,map_height,counties,geoGenerator,fill,proportion,tippy){return(
function make_map() {
  let map = d3
    .create("svg")
    .attr("width", map_width)
    .attr("height", map_height);

  map
    .append("g")
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('d', geoGenerator)
    .style('stroke', 'black')
    .style('stroke-width', '1px')
    .style('opacity', 0.2)
    .style('fill', 'white');

  let county_group = map
    .append("g")
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('d', geoGenerator)
    .style('stroke', 'lightgrey')
    .style('stroke-width', '1px')
    .style('fill', d => fill(proportion(d)))
    .attr('title', function(d) {
      return `${d.properties.ZCTA5CE10}<br /> ${proportion(d)} unique users`;
    });
  // .attr('transform', function(d) {
  //   const [x, y] = geoGenerator.centroid(d);
  //   return `
  // translate(${x},${y})
  // scale(${(25 * proportion(d)) / 0.5})
  // translate(${-x},${-y})`;
  // });

  county_group.nodes().forEach(tippy);

  return map.node();
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html` 
<style>
path {
    shape-rendering: optimizeSpeed;
}
</style>`
)});
  main.variable(observer("geoGenerator")).define("geoGenerator", ["d3","projection"], function(d3,projection){return(
d3.geoPath().projection(projection)
)});
  main.variable(observer("projection")).define("projection", ["d3","map_width","map_height","counties"], function(d3,map_width,map_height,counties){return(
d3
  .geoIdentity()
  .reflectY(true)
  .fitSize([map_width, map_height], counties)
)});
  main.variable(observer("counties")).define("counties", ["nc"], function(nc){return(
nc
)});
  main.variable(observer("nc")).define("nc", ["FileAttachment"], async function(FileAttachment){return(
await FileAttachment("Zip Code Tabulation Area Boundaries.geojson").json()
)});
  main.variable(observer("map_height")).define("map_height", ["map_width"], function(map_width){return(
0.6 * map_width
)});
  main.variable(observer("map_width")).define("map_width", function(){return(
500
)});
  main.variable(observer("tippy")).define("tippy", ["require"], function(require){return(
require("https://unpkg.com/tippy.js@2.5.4/dist/tippy.all.min.js")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  main.variable(observer("formatTime")).define("formatTime", ["d3"], function(d3){return(
d3.timeFormat("%B %d")
)});
  main.variable(observer("counties_and_totals")).define("counties_and_totals", ["counties","nc_covid_data","d3"], function(counties,nc_covid_data,d3){return(
counties.features
  .map(c => c.properties.zcta5ce10)
  .map(function(name) {
    let vv = nc_covid_data.filter(c => c.PostalCode == name);
    return { name: name, data: vv };
  })
  .map(function(c) {
    c.data = d3.sum(c.data.map(t => +t.Session_Id));
    return c;
  })
)});
  main.variable(observer("proportion")).define("proportion", ["counties_and_totals"], function(counties_and_totals){return(
function proportion(d) {
  let name = d.properties.zcta5ce10;
  let cts = counties_and_totals.filter(ct => ct.name == name);
  return cts[0].data;
}
)});
  main.variable(observer()).define(["fill","proportion","counties"], function(fill,proportion,counties){return(
fill(proportion(counties.features[0]))
)});
  main.variable(observer("scheme")).define("scheme", ["d3"], function(d3){return(
d3.schemeBlues
)});
  main.variable(observer("fill")).define("fill", ["d3","colorArr","scheme"], function(d3,colorArr,scheme){return(
d3
  .scaleQuantile()
  .domain(colorArr)
  .range(['#fff', ...scheme[4]])
)});
  main.variable(observer("colorArr")).define("colorArr", function(){return(
[0, 5, 10, 15, 20]
)});
  main.variable(observer("max")).define("max", ["d3","counties","proportion"], function(d3,counties,proportion){return(
d3.max(counties.features.map(proportion))
)});
  main.variable(observer("nc_covid_data")).define("nc_covid_data", ["covid_data"], function(covid_data)
{
  let nc_covid_data = covid_data;
  nc_covid_data.forEach(function(o) {
    let total = (o.Total = o.Session_Id);
  });
  nc_covid_data = nc_covid_data.sort((a, b) => b.Total - a.Total);
  return nc_covid_data;
}
);
  main.variable(observer("covid_data")).define("covid_data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(
  await FileAttachment(
    "Distinct Session Id by Zip_2020-04-07-192620.csv"
  ).text()
)
)});
  return main;
}

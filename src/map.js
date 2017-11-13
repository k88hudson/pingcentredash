function getData() {
  return new Promise(resolve => {
    d3.json(
      "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json",
      json => resolve(json)
    );
  });
}

// DEFINE VARIABLES
// Define size of map group
// Full world map is 2:1 ratio
// Using 12:5 because we will crop top and bottom of map
var w = 700;
var h = 400;
// variables for catching min and max zoom factors
var minZoom;
var maxZoom;

// DEFINE FUNCTIONS/OBJECTS
// Define map projection
var projection = d3
  .geoEquirectangular()
  .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
  .scale([w / (2 * Math.PI)]) // scale to fit group width
  .translate([w / 2, h / 2]) // ensure centred in group
;

// Define map path
var path = d3
  .geoPath()
  .projection(projection)
;

function getTextBox(selection) {
  selection
    .each(function(d) {
      d.bbox = this
        .getBBox();
      })
  ;
}

async function main() {

  // create an SVG
  var svg = d3
    .select("#map-holder")
    .append("svg")
    // set to the same size as the "map-holder" div
    .attr("width", $("#map-holder").width())
    .attr("height", $("#map-holder").height())
    ;

  const json = await getData();
  const countryCount = {};

  // Bind data and create one path per GeoJSON feature
  const countriesGroup = svg.append("g").attr("id", "map");

  // add a background rectangle
  countriesGroup
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", w)
    .attr("height", h)
  ;

  // add paths
  countriesGroup
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "country")
    .attr("opacity", function(d, i) {
      countriesGroup[d.properties.iso_a2] = Math.random();
      return countriesGroup[d.properties.iso_a2];
    })
  ;

  setInterval(() => {
    countriesGroup
      .selectAll("path")
      .attr("opacity", function(d, i) {
        return Math.random();
      })
    ;
  }, 10000);
}

export default main;

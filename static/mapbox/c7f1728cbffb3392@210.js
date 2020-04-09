// https://observablehq.com/d/c7f1728cbffb3392@210
import define1 from "./5c1460cf0f955283@14.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Distinct Session Id by Zip_2020-04-07-192620.csv",new URL("./files/0c3b439a81a50ae2c41fc1e72b3ac40041ba7e1cc975cdacf716e732d6cd0e62569339dd8b06e5f41fcfed7c2b6423bd205c523fabda31ebf1de1abdf07adf2e",import.meta.url)],["counties-albers-10m.json",new URL("./files/50848f0dd4d2d9c84821adba90ca625cb2815694117bbb7b6ae393e788aae9d85f19a6c73d60d642bb04e2f95b87993e8c7312d4d4da6a1431c58460f5ad6c63",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("header")).define("header", ["md"], function(md){return(
md`# Prototype mapbox for how we feel data application. Map of Distinct Session ID by Zip Code for connecticut.`
)});
  main.variable(observer("map")).define("map", ["html","L7","dataWithZip"], function*(html,L7,dataWithZip)
{
  const container = html`<div style="height: 500px;">`;
  yield container; // Give the container dimensions.

  const scene = new L7.Scene({
    id: container,
    map: new L7.Mapbox({
      center: [-72.7, 41.5],
      zoom: 7.8,
      style: "light"
    })
  });

  scene.on("loaded", () => {
    const popup = new L7.Popup({
      offsets: [0, 20]
    })
      .setText('hello')
      .setLnglat([-72.7, 41.5]);

    const lineLayer = new L7.PointLayer({})
      .source(dataWithZip, {
        parser: {
          type: 'json',
          x: 'long',
          y: 'lat',
          value: 'value'
        }
      })
      .shape('circle')
      .size('value', [5, 25])
      .active(true)
      .color('rgb(6, 36, 157)')
      .style({
        opacity: .3,
        strokeWidth: 0
      });

    lineLayer.on('mousemove', e => {
      const popup = new L7.Popup({
        offsets: [0, 0],
        closeButton: false,
        closeOnClick: true
      })
        .setLnglat(e.lngLat)
        .setHTML(
          `<span>Zip code: ${e.feature.zip}</br>Active users: ${e.feature.value}</span>`
        );
      scene.addPopup(popup);
    });

    scene.addLayer(lineLayer);
  });
}
);
  main.variable(observer("us")).define("us", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("counties-albers-10m.json").json()
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<style> .l7-ctrl-logo {display: none}</style>`
)});
  main.variable(observer("fileText")).define("fileText", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(
  await FileAttachment(
    "Distinct Session Id by Zip_2020-04-07-192620.csv"
  ).text()
)
)});
  main.variable(observer("dataWithZip")).define("dataWithZip", ["fileText","mapZipToData"], function(fileText,mapZipToData)
{
  const map = [];
  fileText.forEach(d => {
    const lat_long = mapZipToData[d.PostalCode];
    if (lat_long !== undefined && lat_long.stateCode === 'CT') {
      map.push({
        value: +d.Session_Id,
        zip: d.PostalCode,
        lat: +lat_long.lat,
        long: +lat_long.long
      });
    }
  });

  return map;
}
);
  main.variable(observer("usZipCodes")).define("usZipCodes", ["d3"], function(d3){return(
d3.tsv(
  'https://gist.githubusercontent.com/khxu/fd91f0031d3e8ec4cf0be80fac388565/raw/52126f24f59d88cdd32b2c5e239e71e67929618b/us_zip_codes.tsv'
)
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("topoData")).define("topoData", ["topojson","us"], function(topojson,us){return(
topojson.feature(us, us.objects.states)
)});
  const child1 = runtime.module(define1);
  main.import("mapZipToData", child1);
  main.variable(observer("L7")).define("L7", ["require"], function(require){return(
require("@antv/l7@2")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@v5')
)});
  return main;
}

// https://observablehq.com/@cahaber/zip-to-lat-long@14
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# ZIP TO LAT LONG`
)});
  main.variable(observer("usZipCodes")).define("usZipCodes", ["d3"], function(d3){return(
d3.tsv(
  'https://gist.githubusercontent.com/khxu/fd91f0031d3e8ec4cf0be80fac388565/raw/52126f24f59d88cdd32b2c5e239e71e67929618b/us_zip_codes.tsv'
)
)});
  main.variable(observer("mapZipToData")).define("mapZipToData", ["usZipCodes"], function(usZipCodes)
{
  const map = {};
  usZipCodes.forEach(d => {
    map[d.zipCode] = d;
  });

  return map;
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@v5')
)});
  return main;
}

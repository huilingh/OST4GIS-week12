# Week 12

## Class Outline

- GeoJSON and SQL through CartoDB
  - REMINDER: Always:clap:use:clap:the:clap:SQL:clap:console:clap:
  - You can use a REST client like
    [Postman](https://www.getpostman.com/) or [Advanced REST
Client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?hl=en-US)

- Carto Input/Output
  - [Result formats](https://carto.com/docs/carto-engine/sql-api/making-calls#response-formats)
  - [Carto backed maps](examples/carto)

- [SQL Performance](https://carto.com/docs/carto-engine/sql-api/query-optimizations)
  - Ask for only the columns you need
  - [Geometry simplification](http://www.postgis.org/docs/ST_Simplify.html)
  - [Indices](http://revenant.ca/www/postgis/workshop/indexing.html)
  - [Save work in new tables](https://www.postgresql.org/docs/8.2/static/sql-createtableas.html)
  - [Force CARTO to recognize new tables](https://carto.com/docs/carto-engine/sql-api/creating-tables/)
  - Use the `cartodb_id` in queries (this column is indexed by default). Example:
```SQL
SELECT
  *
FROM
  <TABLE>
WHERE
  cartodb_id = <some_id>
```

- Rasters
  - Tiling for TMS
  - PostGIS analysis (this is painful - I've always avoided it and you should too)
  - Alternatives

- Work on final project preparations + library/carto exploration for the remainder of class

- Extras:
  - [Fast spatial joins on the frontend with rtrees](https://beta.observablehq.com/@jfrankl/spatial-search-with-flatbush-and-leaflet-draw) (demo by Jeff Frankl) Note that these joins work with bounding boxes rather than complex shapes
  - [Working with topojson](https://beta.observablehq.com/@jfrankl/topojson) (demo by Jeff Frankl)
  - [Project work by the creator of Leaflet](https://github.com/mourner/projects) Quoting Jeff: "*rbush* can handle points and rectangles and can be updated, *flatbush* is faster than rbush but is static (can’t be updated with new geoms), *kdbush* is the fastest but is only for points"

[![npm version](https://badge.fury.io/js/geojson-minimum-bounding-rectangle.svg)](https://badge.fury.io/js/geojson-minimum-bounding-rectangle)

# Minimum Bounding Rectangle for GeoJSON

This Javascript/Typescript library provides 2 methods for calculating the Minimum Bounding Rectangle by area and by width for a given GeoJSON feature or feature collection.

This problem it is solving has many names: Minimum Bounding Rectangle, Minimum Bounding Box, Smallest Surrounding Rectangle, Minimum Area Rectangle...

## Example

This is an example of the output of this library. The input GeoJSON is the yellow polygon (outline of the Republic of Ireland).

The blue rectangle was generated by ` smallestSurroundingRectangleByWidth` while the red rectangle is the output of ` smallestSurroundingRectangleByArea`

![example image](https://raw.githubusercontent.com/matthiasfeist/geojson-minimum-bounding-rectangle/main/docs/img/example.png)

## Changes in version 2

The function of the library is **unchanged**, but all dependencies were updated to turf 7.
The library is now also ES-Modules only.

In case you need CommonJS or compatability with older version of TurfJS, use version 1.0.1

## How to use it

### Installation

```sh
npm install geojson-minimum-bounding-rectangle
```

### Usage

```ts
import {
  smallestSurroundingRectangleByWidth,
  smallestSurroundingRectangleByArea,
} from "geojson-minimum-bounding-rectangle";

const boundingRect = smallestSurroundingRectangleByWidth(myGeoJsonInput);
```

## More Information:

- https://en.wikipedia.org/wiki/Minimum_bounding_box_algorithms
- https://gis.stackexchange.com/questions/22895/finding-minimum-area-rectangle-for-given-points

## License

See [LICENSE](https://github.com/matthiasfeist/geojson-minimum-bounding-rectangle/blob/main/LICENSE) for more details.

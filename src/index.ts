import convex from "@turf/convex";
import { AllGeoJSON } from "@turf/helpers";
import { coordAll } from "@turf/meta";
import centroid from "@turf/centroid";
import transformRotate from "@turf/transform-rotate";
import bearing from "@turf/bearing";
import envelope from "@turf/envelope";
import area from "@turf/area";
import distance from "@turf/distance";

export function smallestSurroundingRectangleByArea(geoJsonInput: AllGeoJSON) {
  const convexHull = convex(geoJsonInput);
  const centroidCoords = centroid(convexHull);
  const allHullCoords = coordAll(convexHull);

  let minArea = Number.MAX_SAFE_INTEGER;
  let resultPolygon = null;

  for (let index = 0; index < allHullCoords.length - 1; index++) {
    let angle = bearing(allHullCoords[index], allHullCoords[index + 1]);

    let rotatedHull = transformRotate(convexHull, -1.0 * angle, {
      pivot: centroidCoords,
    });

    let envelopeOfHull = envelope(rotatedHull);
    let envelopeArea = area(envelopeOfHull);
    if (envelopeArea < minArea) {
      minArea = envelopeArea;
      resultPolygon = transformRotate(envelopeOfHull, angle, {
        pivot: centroidCoords,
      });
    }
  }

  return resultPolygon;
}

export function smallestSurroundingRectangleByWidth(geoJsonInput: AllGeoJSON) {
  const convexHull = convex(geoJsonInput);
  const centroidCoords = centroid(convexHull);
  const allHullCoords = coordAll(convexHull);

  let minWidth = Number.MAX_SAFE_INTEGER;
  let resultPolygon = null;

  for (let index = 0; index < allHullCoords.length - 1; index++) {
    let angle = bearing(allHullCoords[index], allHullCoords[index + 1]);

    let rotatedHull = transformRotate(convexHull, -1.0 * angle, {
      pivot: centroidCoords,
    });

    let envelopeOfHull = envelope(rotatedHull);

    let envelopeCoords = coordAll(envelopeOfHull);
    if (envelopeCoords.length > 4) {
      let side1 = distance(envelopeCoords[0], envelopeCoords[1]);
      let side2 = distance(envelopeCoords[1], envelopeCoords[2]);
      let width = Math.min(side1, side2);
      if (width < minWidth) {
        minWidth = width;
        resultPolygon = transformRotate(envelopeOfHull, angle, {
          pivot: centroidCoords,
        });
      }
    }
  }

  return resultPolygon;
}

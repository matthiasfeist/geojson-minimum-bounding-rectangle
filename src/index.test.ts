import {
  smallestSurroundingRectangleByWidth,
  smallestSurroundingRectangleByArea,
} from "./index.js";
import * as fs from "fs";
import * as path from "path";

const getFixture = (name: string) => {
  const fixturePath = path.join("src/fixtures", name) + ".geojson";
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
};

describe("Fixture tests", () => {
  describe.each([
    { name: "Drottningholm castle, Stockholm", testId: "castle" },
    { name: "Republic of Ireland", testId: "ireland" },
    { name: "Spain", testId: "spain" },
  ])('Generates the correct hull for "$name"', ({ testId }) => {
    test("smallest Surrounding Rectangle By Width is correct", () => {
      const input = getFixture(testId + "-input");
      const expectedOutput = getFixture(testId + "-output-width");
      const result = smallestSurroundingRectangleByWidth(input as any);
      expect(result).toMatchObject(expectedOutput);
    });

    test("smallest Surrounding Rectangle By Area is correct", () => {
      const input = getFixture(testId + "-input");
      const expectedOutput = getFixture(testId + "-output-area");
      const result = smallestSurroundingRectangleByArea(input as any);
      expect(result).toMatchObject(expectedOutput);
    });
  });
});

describe("Failiure scenarios", () => {
  test("Throws an Error when given invalid GeoJSON", () => {
    const faultyData = { foo: "bar" };

    expect(() => {
      smallestSurroundingRectangleByArea(faultyData as any);
    }).toThrow("Unknown Geometry Type");

    expect(() => {
      smallestSurroundingRectangleByWidth(faultyData as any);
    }).toThrow("Unknown Geometry Type");
  });

  test("Throws an Error when a point as input", () => {
    const point = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [10, 10],
      },
    };
    expect(() => {
      smallestSurroundingRectangleByArea(point);
    }).toThrow();
    expect(() => {
      smallestSurroundingRectangleByArea(point);
    }).toThrow();
  });

  test("Returns Null for only one straight line as input", () => {
    const line = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.020514, 40.71041],
          [-74.018712, 40.717079],
        ],
      },
    };
    expect(() => {
      smallestSurroundingRectangleByArea(line);
    }).toThrow();
    expect(() => {
      smallestSurroundingRectangleByArea(line);
    }).toThrow();
  });
});

describe("Edge cases", () => {
  test("Returns correct output for a line with 3 points", () => {
    const line = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.020514, 40.71041],
          [-74.01103, 40.71311],
          [-74.018712, 40.717079],
        ],
      },
    };
    expect(smallestSurroundingRectangleByArea(line)).toMatchInlineSnapshot(`
{
  "bbox": [
    -74.01951378255762,
    40.71030829997086,
    -74.01122864008278,
    40.71735512295224,
  ],
  "geometry": {
    "coordinates": [
      [
        [
          -74.018712,
          40.71707899999999,
        ],
        [
          -74.02337820209618,
          40.71188961769072,
        ],
        [
          -74.01569601516172,
          40.707921003841015,
        ],
        [
          -74.0110298997015,
          40.71311011153629,
        ],
        [
          -74.018712,
          40.71707899999999,
        ],
      ],
    ],
    "type": "Polygon",
  },
  "properties": {},
  "type": "Feature",
}
`);

    expect(smallestSurroundingRectangleByWidth(line)).toMatchInlineSnapshot(`
{
  "bbox": [
    -74.01928668086231,
    40.70962137264384,
    -74.01168336823133,
    40.717300458053025,
  ],
  "geometry": {
    "coordinates": [
      [
        [
          -74.01102973830928,
          40.713109471732466,
        ],
        [
          -74.01370262236526,
          40.71850492560466,
        ],
        [
          -74.02318706000682,
          40.71580514273933,
        ],
        [
          -74.02051399999999,
          40.71041,
        ],
        [
          -74.01102973830928,
          40.713109471732466,
        ],
      ],
    ],
    "type": "Polygon",
  },
  "properties": {},
  "type": "Feature",
}
`);
  });
});

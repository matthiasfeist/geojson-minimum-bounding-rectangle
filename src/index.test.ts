import {
  smallestSurroundingRectangleByWidth,
  smallestSurroundingRectangleByArea,
} from "./index";
import * as fs from "fs";
import * as path from "path";

const getFixture = (name: string) => {
  const fixturePath = path.join(__dirname, "fixtures", name) + ".geojson";
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
};

describe("Fixture tests", () => {
  describe.each([
    ["Drottningholm castle, Stockholm", "castle"],
    ["Republic of Ireland", "ireland"],
    ["Spain", "spain"],
  ])('Generates the correct hull for "%s"', (nameOfTest, testId) => {
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

  test("Returns Null for only one point as input", () => {
    const point = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [10, 10],
      },
    };
    expect(smallestSurroundingRectangleByArea(point as any)).toBeNull();
    expect(smallestSurroundingRectangleByWidth(point as any)).toBeNull();
  });

  test("Returns Null for only one straight line as input", () => {
    const point = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.020514, 40.71041],
          [-74.018712, 40.717079],
        ],
      },
    };
    expect(smallestSurroundingRectangleByArea(point as any)).toBeNull();
    expect(smallestSurroundingRectangleByWidth(point as any)).toBeNull();
  });
});

describe("Edge cases", () => {
  test("Returns correct output for a line with 3 points", () => {
    const point = {
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
    expect(smallestSurroundingRectangleByArea(point as any))
      .toMatchInlineSnapshot(`
      Object {
        "geometry": Object {
          "coordinates": Array [
            Array [
              Array [
                -74.018712,
                40.71707899999999,
              ],
              Array [
                -74.02337817348734,
                40.71188958338605,
              ],
              Array [
                -74.01569595440463,
                40.707921005302076,
              ],
              Array [
                -74.01102986753443,
                40.71311014730891,
              ],
              Array [
                -74.018712,
                40.71707899999999,
              ],
            ],
          ],
          "type": "Polygon",
        },
        "properties": Object {},
        "type": "Feature",
      }
    `);

    expect(smallestSurroundingRectangleByWidth(point as any))
      .toMatchInlineSnapshot(`
      Object {
        "geometry": Object {
          "coordinates": Array [
            Array [
              Array [
                -74.01102975566067,
                40.71310950676928,
              ],
              Array [
                -74.01370268047083,
                40.71850493018273,
              ],
              Array [
                -74.02318710074746,
                40.71580511227448,
              ],
              Array [
                -74.02051399999999,
                40.71041,
              ],
              Array [
                -74.01102975566067,
                40.71310950676928,
              ],
            ],
          ],
          "type": "Polygon",
        },
        "properties": Object {},
        "type": "Feature",
      }
    `);
  });
});

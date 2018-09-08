import * as chai from "chai";
const expect = chai.expect;

import * as IDs from "../../src";

const codecSymbol = Symbol.for("id-codec");


describe("TCK tests", () => {
  describe("primitives", () => {
    it("supports string", () => {
      const tck = require("spec/tck/files/primitives/string.json");
      testTck(tck);
    });

    it("supports boolean", () => {
      const tck = require("spec/tck/files/primitives/boolean.json");
      testTck(tck);
    });

    it("supports integer", () => {
      const tck = require("spec/tck/files/primitives/integer.json");
      testTck(tck);
    });

    it("supports float", () => {
      const tck = require("spec/tck/files/primitives/float.json");
      testTck(tck);
    });

    it("supports long", () => {
      const tck = require("spec/tck/files/primitives/long.json");
      testTck(tck);
    });

    it("supports bytes", () => {
      const tck = require("spec/tck/files/primitives/bytes.json");
      testTck(tck);
    });
  });

  describe("semantic", () => {
    it("supports uuid", () => {
      const tck = require("spec/tck/files/semantic/uuid.json");
      testTck(tck);
    });

    it("supports datetime", () => {
      const tck = require("spec/tck/files/semantic/datetime.json");
      testTck(tck);
    });

    it("supports geo", () => {
      const tck = require("spec/tck/files/semantic/geo.json");
      testTck(tck);
    });
  });

  describe.skip("composite", () => {
    it("supports list", () => {
      const tck = require("spec/tck/files/composites/list.json");
      testTck(tck);
    });

    it("supports map", () => {
      const tck = require("spec/tck/files/composites/map.json");
      testTck(tck);
    });
  });
});


interface TCK {
  typeCode: number;
  type: string;
  value: any;
  data: string;
  human: string;
}

function testTck(tck: TCK[]): void {
  tck.forEach(test => {
    roundTripTest(test, test.data);
    roundTripTest(test, test.human, true);
  });
}

function roundTripTest(test: TCK, encoded: string, isHuman?: boolean): void {
  const id = IDs.decodeFromString(encoded);
  expect(id.type).to.equal(test.type);
  // JSON.stringify strips out the functions so we can just compare values.
  expect(JSON.stringify(id.value)).to.equal(JSON.stringify(test.value));

  const toString = isHuman ? id.toHumanString() : id.toDataString();
  expect(toString).to.equal(encoded);

  // @ts-ignore: codec not part of identifier interface
  const codec = id[codecSymbol];
  expect(codec.typeCode).to.equal(test.typeCode);
}
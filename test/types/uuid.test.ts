import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";

import {uuidCodec} from "../../src/types/uuid";

chai.use(jsSpecChai);

describe("uuid codec", () => {
  it("validates good identifier values", () => {
    const strValue = "891290c4-931d-43c1-8f00-7982f267d856";
    expect(strValue).to.conform(uuidCodec.specForIdentifier);
    expect(strValue.toUpperCase()).to.conform(uuidCodec.specForIdentifier);
    const bytes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    expect(bytes).to.conform(uuidCodec.specForIdentifier);
    expect(Uint8Array.of(...bytes)).to.conform(uuidCodec.specForIdentifier);
    expect(new ArrayBuffer(16)).to.conform(uuidCodec.specForIdentifier);
    expect({length: 16, ...bytes}).to.conform(uuidCodec.specForIdentifier);
  });

  it("rejects bad identifier values", () => {
    expect("").to.not.conform(uuidCodec.specForIdentifier);
    expect("Z91290c4-931d-43c1-8f00-7982f267d856").to.not.conform(uuidCodec.specForIdentifier);
    expect(Array.from("891290c4-931d-43c1-8f00-7982f267d856")).to.not.conform(uuidCodec.specForIdentifier);
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).to.not.conform(uuidCodec.specForIdentifier);
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 256]).to.not.conform(uuidCodec.specForIdentifier);
  });

  it("supports encoding", () => {
    const bytes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const actual = uuidCodec.encode({bytes, toJSON: () => ""});
    expect(actual).to.be.an("uint8array");
    expect(actual).to.deep.equal(new Uint8Array(bytes));
  });

  it("validates good decoded values", () => {
    const value = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    expect(value).to.conform(uuidCodec.specForDecoding);
  });

  it("rejects decoding bad values", () => {
    expect("92d716ce-ea62-4ace-aba9-b58fdf7a2df2").to.not.conform(uuidCodec.specForDecoding);
    const value = [0, 255];
    expect(value).to.not.conform(uuidCodec.specForDecoding);
    expect(Uint8Array.from(value)).to.not.conform(uuidCodec.specForDecoding);
  });

  it("supports decoding", () => {
    const bytes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const actual = uuidCodec.decode(Uint8Array.from(bytes));
    expect(actual).to.deep.include({bytes});
  });

  it("produces a value that contains the correct toString() method", () => {
    const hex = "98137765-b72f-480a-bd98-d3be3c2c7e53";
    const actual = uuidCodec.forIdentifier(hex);
    expect(actual.toString()).to.equal(hex);
  });

  it("generates a debug string", () => {
    const hex = "84bf5017-411e-4277-805e-d63addce9ca2";
    const value = uuidCodec.forIdentifier(hex);
    const actual = uuidCodec.toDebugString(value);
    expect (actual).to.equal(hex)
  });
});

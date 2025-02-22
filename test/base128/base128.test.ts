import {expect} from "chai";

import {decode, REGEXP} from "../../src/base128/decode";
import {encode} from "../../src/base128/encode";
import {toCharCode} from "../../src/shared";


describe("base128 round-trip", () => {

  it("handles illegal characters in an encoded string", () => {
    expect(() => decode("a:")).to.throw();
  });

  it("handles empty values", () => {
    const empty = Uint8Array.of();
    const testEnc = encode(empty);
    expect(testEnc).to.equal("");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(empty);
  });

  it("converts a known single-character value to and from base 128", () => {
    const m = Uint8Array.of(toCharCode("m"));
    const testEnc = encode(m);
    expect(testEnc).to.equal("pz");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(m);
  });

  it("converts a known single-character value with a code point > 128 to and from base 128", () => {
    const y = Uint8Array.of(toCharCode("ÿ"));
    const testEnc = encode(y);
    expect(testEnc).to.equal("ýz");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(y);
  });

  it("converts a known string value to and from base 128", () => {
    let bytes = Uint8Array.from(
      Array.from("greener").map(toCharCode));
    let testEnc = encode(bytes);
    expect(testEnc).to.equal("mÚÊÔesÈð");
    let testDec = decode(testEnc);
    expect(testDec).to.deep.equal(bytes);

    bytes = Uint8Array.from(
      Array.from("chartreuse").map(toCharCode));
    testEnc = encode(bytes);
    expect(testEnc).to.equal("kØ@KGÏâãtÚêÎ");
    testDec = decode(testEnc);
    expect(testDec).to.deep.equal(bytes);
  });

  it("converts a higher-value byte array", () => {
    const expected = "ôoZÞ";
    const bytes = Uint8Array.of(236, 213, 54);  //[-20, -43, 54]

    const actualStr = encode(bytes);
    expect(actualStr).to.equal(expected);

    const actualBytes = decode(expected);
    expect(actualBytes).to.deep.equal(bytes);

  });


  it("converts random byte arrays to and from base 128", () => {
    const bytes: Uint8Array[] = [];
    for (let i = 1; i < 500; i++) {
      const byteArray: number[] = [];
      for (let b = 0; b < i; b++) {
        byteArray[b] = Math.floor(Math.random() * 256);
      }
      bytes.push(Uint8Array.from(byteArray));
    }
    bytes.forEach(barr => roundTrip(barr));
  });
});

function roundTrip(bytes: Uint8Array): void {
  const testEnc = encode(bytes);
  const testDec = decode(testEnc);
  // note these expectation checks take up 95% of the time in this test
  expect(testEnc).to.be.a("string");
  expect(testDec).to.be.a("uint8array");
  expect(testEnc).to.match(REGEXP);
  expect(testDec).to.deep.equal(bytes);
}

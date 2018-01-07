import {expect} from "chai";
import * as Long from "long";

import * as ids from "../src";
import {factory} from "../src";
import {Identifier} from "../src/identifier";


function roundTrip<T>(id: Identifier<T>, comparator?: (encoded: Identifier<T>, decoded: Identifier<T>) => boolean) {
  const encoded = ids.encodeToString(id);
  const decoded: Identifier<T> = ids.decodeFromString(encoded);
  if (comparator) {
    expect(comparator(id, decoded)).to.be.true;
  } else {
    expect(decoded).to.deep.equal(id);
  }
}

describe("round-trip identifiers to strings using factory functions", () => {

  it("string", () => {
    const id = factory.string("matt");
    roundTrip(factory.string("hello"));
    roundTrip(factory.string.list("bye", "for", "now"));
  });

  it("boolean", () => {
    roundTrip(factory.boolean(true));
    roundTrip(factory.boolean.list(true, false, true, false));
  });

  it("integer", () => {
    roundTrip(factory.integer(99));
    roundTrip(factory.integer.list(-7483, 0, 448, -9));
  });

  it("float", () => {
    roundTrip(factory.float(0.009));
    roundTrip(factory.float.list(0.08, 67664, -0.009917764));
  });

  it("long", () => {
    roundTrip(factory.long(8700));
    roundTrip(factory.long(2 ** 63));
    roundTrip(factory.long(Long.fromBits(63, 65535)));
    roundTrip(factory.long({low: 766745, high: 2900}));
    roundTrip(factory.long({low: 89, high: 420, unsigned: false}));
    roundTrip(factory.long.list(1987, 2 ** 58, Long.fromNumber(-100), {low: -50, high: 5564}));
  });

  it("bytes", () => {
    roundTrip(factory.bytes([]));
    roundTrip(factory.bytes([255, 0, 127]));
    roundTrip(factory.bytes({length: 1, 0: 250}));
    roundTrip(factory.bytes(Buffer.from([255, 0, 127])));
    roundTrip(factory.bytes(Uint8Array.from([1, 0]).buffer));
    roundTrip(factory.bytes(Uint8Array.from([99, 43])));
    roundTrip(factory.bytes(Uint8ClampedArray.from([100, 200])));
    roundTrip(factory.bytes.list([]));
    roundTrip(factory.bytes.list([1], [2, 3]));
    roundTrip(factory.bytes.list([1], Uint8Array.from([2, 3]), Buffer.from([4, 5, 6]), Uint8Array.from([7, 8]).buffer));
  });

  it("datetime", () => {
    const compareImmutableDates = (id, decoded) => id.value.time === decoded.value.time;
    roundTrip(factory.datetime(7785646), compareImmutableDates);
    roundTrip(factory.datetime(new Date()), compareImmutableDates);
    roundTrip(factory.datetime.list(new Date(), 118275), (idList, decodedList) => {
      const l1 = idList.value.map(id => id.time);
      const l2 = decodedList.value.map(id => id.time);
      return l1.filter(t => l2.indexOf(t) < 0).length === 0;
    });
  });
});

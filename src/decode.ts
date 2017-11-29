import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import * as base128 from "./base128/decode";
import {Identifier, IdentifierCodec} from "./identifier";
import {codecForTypeCode} from "./types/finder";
import {existsPredicate, codecSymbol} from "./shared";


/**
 * Convert an encoded identifier string into an Identifier.
 * @param encoded the encoded string
 * @returns the identifier object
 */
export function decodeFromString<T>(encoded: any): Identifier<T> {

  const bytes = decodeString(encoded);
  const decoded = decodeBytes(bytes);
  const codec = codecForTypeCode(decoded[0]);
  const value = decodeWithCodec(codec, decoded[1]);

  return createIdentifier(codec, value);
}


export function decodeString(encoded: any): Uint8Array {
  S.assert(S.spec.string, encoded);
  return base128.decode(encoded);
}

// decodes int64 to buffer instead of number
const int64Codec = msgpack.createCodec({int64: true});
const arraySpec = S.spec.tuple("decoded identifier array",
  Number.isInteger,
  existsPredicate
);

export function decodeBytes(bytes: Uint8Array): [number, any] {
  const decoded: [number, any] = msgpack.decode(bytes, {codec: int64Codec});
  S.assert(arraySpec, decoded);
  return decoded;
}

export function decodeWithCodec(codec: IdentifierCodec, decoded: any): Identifier<any> {
  codec.validateForDecoding(decoded);
  return codec.decode(decoded);
}

export function createIdentifier(codec: IdentifierCodec, value: any): Identifier<any> {
  return {
    type: codec.type,
    value: value,
    [codecSymbol]: codec
  }
}

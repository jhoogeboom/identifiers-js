import {Identifier} from "../identifier";
import {decodedIdSpec, identifierSpec, IDTuple, TypedObject} from "../shared";
import {LIST_OF} from "./lists";
import * as S from "js.spec";
import {asIsCodec} from "./shared-types";
import {decodeToIdentifier} from "../decode";
import {encodeIdTuple} from "../encode";
import {MAP_OF, mapValues, MapValuesSpec} from "./maps";
import {IdentifierCodec} from "../identifier-codec";

export type CompositeIdList = Identifier<any>[];

export type CompositeIdMap = TypedObject<Identifier<any>>;

const COMPOSITE_TYPE_CODE = 0x18;

const specForListInput = S.spec.and("composite-list forIdentifier",
    S.spec.array, // must be an array, not a Set
    S.spec.collection("identifier item spec", identifierSpec));

const specForDecodingList = S.spec.and("composite-list decode",
    S.spec.array, // must be an array, not a Set
    S.spec.collection("decoded identifier item", decodedIdSpec));

function toDebugStringList(list: CompositeIdList): string {
  const joined = list
      .map((value) => value.toString())
      .join(", ");
  return `[${joined}]`;
}

export const listCodec: IdentifierCodec<CompositeIdList, CompositeIdList, IDTuple<any>[]> = {
  type: "composite-list",
  typeCode: COMPOSITE_TYPE_CODE | LIST_OF,
  specForIdentifier: specForListInput,
  specForDecoding: specForDecodingList,
  forIdentifier: asIsCodec.forIdentifier,
  toDebugString: toDebugStringList,
  encode: (list) => list.map(encodeIdTuple),
  decode: (list) => list.map(decodeToIdentifier)
};

const specForMapInput = S.spec.and("composite-map forIdentifier spec",
    S.spec.object,
    new MapValuesSpec(identifierSpec, "Map identifier values"));

const specForDecodingMap = S.spec.and("composite-map decode spec",
    S.spec.object,
    new MapValuesSpec(decodedIdSpec, "Map identifier values"));

function generateDebugStringMap(map: CompositeIdMap): string {
  const keys = Object.keys(map);
  const joined = keys
      .map((key) => `${key}: ${map[key].toString()}`)
      .join(", ");
  return `{${joined}}`;
}

export const mapCodec: IdentifierCodec<CompositeIdMap, CompositeIdMap, TypedObject<IDTuple<any>>> = {
  type: "composite-map",
  typeCode: COMPOSITE_TYPE_CODE | MAP_OF,
  specForIdentifier: specForMapInput,
  specForDecoding: specForDecodingMap,
  forIdentifier: (map) => mapValues(map, asIsCodec.forIdentifier, true),
  toDebugString: generateDebugStringMap,
  encode: (map) => mapValues(map, encodeIdTuple),
  decode: (map) => mapValues(map, decodeToIdentifier)
};
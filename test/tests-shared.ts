import * as S from "js.spec";

import {codecSymbol, existsPredicate} from "../src/shared";
import {asIsCodec} from "../src/types/shared-types";
import {registerCodec} from "../src/finder";


export const codecSpec = S.spec.map("codec", {
  typeCode: S.spec.integer,
  type: S.spec.string,
  forIdentifier: S.spec.fn,
  encode: S.spec.fn,
  decode: S.spec.fn,
});

function hasCodecSymbol(id: any): boolean {
  return S.valid(codecSpec, id[codecSymbol]);
}

export const identifierSpec = S.spec.and("identifier",
  hasCodecSymbol,
  S.spec.map("identifier structure", {
    type: S.spec.string,
    value: existsPredicate
  }));

export const testCodec = {
  ...asIsCodec,
  type: "test-positive",
  typeCode: 0xf,  // largest reserved primitive type
  specForIdentifier: S.spec.positive,
  specForDecoding: S.spec.positive
}

before("set up test codec", () => {
  registerCodec(testCodec);
});
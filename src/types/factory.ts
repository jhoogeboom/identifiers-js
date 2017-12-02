import {Identifier, IdentifierCodec} from "../identifier";
import {createIdentifier} from "../decode";
import {anyCodec, anyListCodec} from "./any";
import {stringCodec, stringListCodec} from "./string";
import {booleanCodec, booleanListCodec} from "./boolean";
import {integerCodec, integerListCodec} from "./integer";
import {floatCodec, floatListCodec} from "./float";
import {longCodec, LongInput, LongLike, longListCodec} from "./long";
import {datetimeCodec, DatetimeInput, datetimeListCodec} from "./datetime";


type ItemFactory<IN, OUT> = (value: IN) => Identifier<OUT>;
type ListFactory<IN, OUT> = (...values: IN[]) => Identifier<OUT>;
type Factory<IN, OUT, F extends ItemFactory<IN, OUT> = ItemFactory<IN, OUT>> = F & {list: ListFactory<IN, OUT>};


function newFactory<IN, OUT>(itemCodec, listCodec): Factory<IN, OUT> {
  const item = (value: IN): Identifier<OUT> => newIdentifier(itemCodec, value);
  const list = (...values: IN[]): Identifier<OUT> => newIdentifier(listCodec, values);
  item["list"] = list;
  return item as Factory<IN, OUT>;
};

function newIdentifier<T>(codec: IdentifierCodec, value: any): Identifier<T> {
  codec.validateForIdentifier(value);
  return createIdentifier(codec, codec.forIdentifier(value));
};

export const factory = {
  any: newFactory(anyCodec, anyListCodec),
  string: newFactory(stringCodec, stringListCodec),
  boolean: newFactory(booleanCodec, booleanListCodec),
  integer: newFactory(integerCodec, integerListCodec),
  float: newFactory(floatCodec, floatListCodec),
  long: newFactory(longCodec, longListCodec),
  datetime: newFactory(datetimeCodec, datetimeListCodec)
}





export function forAny(value: any): Identifier<any> {
  return newIdentifier(anyCodec, value);
}

export function forString(value: string): Identifier<string> {
  return newIdentifier(stringCodec, value);
}

export function forBoolean(value: boolean): Identifier<boolean> {
  return newIdentifier(booleanCodec, value);
}

export function forInteger(value: number): Identifier<number> {
  return newIdentifier(integerCodec, value);
}

export function forFloat(value: number): Identifier<number> {
  return newIdentifier(floatCodec, value);
}

export function forLong(value: LongInput): Identifier<LongLike> {
  return newIdentifier(longCodec, value);
}

export function forDatetime(value: DatetimeInput): Identifier<Date> {
  return newIdentifier(datetimeCodec, value);
}

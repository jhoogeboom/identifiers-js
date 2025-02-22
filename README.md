## JavaScript implementation of [Identifiers spec](https://github.com/Identifiers/spec)

[![Build Status](https://travis-ci.org/Identifiers/identifiers-js.svg?branch=master)](https://travis-ci.org/Identifiers/identifiers-js)
[![Coverage Status](https://coveralls.io/repos/github/Identifiers/identifiers-js/badge.svg?branch=master)](https://coveralls.io/github/Identifiers/identifiers-js?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/identifiers/identifiers-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/identifiers/identifiers-js?targetFile=package.json)
[![npm download](https://img.shields.io/npm/dt/identifiers-js.svg?maxAge=2592000)](https://www.npmjs.com/package/identifiers-js)
[![MIT License](https://img.shields.io/github/license/Identifiers/identifiers-js.svg)](https://github.com/Identifiers/identifiers-js/blob/master/LICENSE)

### About Identifiers

Identifiers are self-describing strings of data that can be decoded into semantically-meaningful values. Identifiers can define basic data types, like numbers and bytes. They can also describe values like geolocations, date-times and uuids.

Try out an online version at [identifiers.io](https://identifiers.io/id-converter/)

## Installation and Usage

Identifiers-js is published to NPM and includes packaging for TypeScript, node modules and minified JS.

```sh
npm install identifiers-js
```

For yarn:

```sh
yarn add identifiers-js
```

#### TypeScript

```js
import * as ID from "identifiers";
```

#### JavaScript

```js
const ID = require('identifiers');
```

#### Browsers

```html
<script src="https://unpkg.com/identifiers-js/dist/identifiers.bundle.js" crossorigin="anonymous"></script>

<script language="javascript">
var id = ID.factory.string("a string ID");
</script>
```

The `ID` reference comes with methods to parse Identifier strings as well as a factory to create Identifier instances. For further details see the [Factory API Reference](#factory-api-reference) section.

#### Immutability

Identifier instances are immutable. Their values are also immutable.

```js
const integerId = ID.factory.integer(22);
/*
  Identifiers have the following shape:
  {
  	value: data value
  	type: identifier type string
  	toString() -> returns a debug-friendly string of the identifier's type and value
  	toDataString() -> returns base-128 encoded identifier string
  	toHumanString() -> return Crockford base-32 encoded identifier string
  	toJSON() -> called by JSON.stringify() and returns  base-128 encoded identifier string
  }
 */
console.log(integerId.value);
// -> 22

// encode the identifier
const dataString = integerId.toDataString();
const humanString = integerId.toHumanString();

// decode the identifier
const decodedId = ID.parse(dataString);

// parse() can decode either type of encoded string
const decodedId2 = ID.parse(humanString);

console.log(decodedId.value === decodedId2.value);
// -> true
```
### Lists and Map Identifiers

Identifiers-js supports list and map identifiers in the factories. Each type factory has a `.list()` and `.map()` factory method which sets the type of structure.

```js
const listId = ID.factory.boolean.list(true, true, false);
const mapId = ID.factory.long.map({a: 335843, b: -997});
```
### Composite Identifiers

A composite identifier is a list or map of mixed-type identifiers. One can compose a single identifier from multiple types of identifiers. A composite identifier can include any other type of identifier.

```js
const id1 = ID.factory.boolean(true);
const id2 = ID.factory.string.list('q', 'pr');

// composite list
const compositeListId = ID.factory.composite.list(id1, id2);

// composite map
const compositeMapId = ID.factory.composite.map({a: id1, b: id2});
```

The values of a composite are the identifiers themselves, so one would read them as normal identifiers in a collection.

```js
// given the example composite IDs above...

const aBooleanValue = compositeListId.value[0].value;

const aStringListValue = compositeMapId.value.b.value;
```
### JSON Support

Identifiers-js has support for both generating and parsing JSON data values. Identifier instances safely encode themselves into a `JSON.stringify()` process. Additionally, a JSON [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) is provided for `JSON.parse()` calls.

```js
const id = ID.factory.string('Hello, World!');
const anObject = { a: 'a message', b: id };
const json = JSON.stringify(anObject);

console.log(json);
// -> { "a": "a message", "b": "Ç/IÒÁIÖêqÉ34uwâêl7Tþ" }

const parsedObject = JSON.parse(json, ID.JSON_reviver);
const parsedId = parsedObject.b;

console.log(parsedId.value);
// -> 'Hello, World!'
```
## Supported Types

These types are defined in the [Identifiers specification](https://github.com/Identifiers/spec).

#### Primitive identifiers

* string
* boolean
* integer
* float
* long
* bytes

#### Semantic Identifiers

* uuid
* datetime
* geo

#### Structured Variants

* list
* map

#### Composites

* list
* map

# Factory API Reference

The factory has methods for each type of identifier. These methods can consume various inputs to build an identifier.

Each identifier type's factory has methods to construct structural identifiers of their type. Each structural factory method accepts the same inputs as the single value methods, but in structural form.

#### String

```js
const id = ID.factory.string('Hello');
console.log(id.type);
// -> 'string'
console.log(typeof id.value);
// -> 'string'

// list factory functions can accept a vararg of values
ID.factory.string.list('Hello', 'friend', 'welcome!');

// list factory functions can accept a single array of values too
ID.factory.string.list(['an', 'array', 'of', 'strings']);

ID.factory.string.map({a: 'oil', b: 'vinegar'});
```

#### Boolean

```js
const id = ID.factory.boolean(true);

console.log(id.type);
// -> 'boolean'
console.log(typeof id.value);
// -> 'boolean'

ID.factory.boolean.list(true, false, true);
ID.factory.boolean.list([false, false, true]);

ID.factory.boolean.map({a: false, b: true});
```

#### Integer

```js
const id = ID.factory.integer(15);

console.log(id.type);
// -> 'integer'
console.log(typeof id.value);
// -> 'number'

ID.factory.integer.list(-10000, 0, 2234);
ID.factory.integer.list([1, 2, 4]);

ID.factory.integer.map({a: 55, b: -9550});
```

#### Float

```js
const id = ID.factory.float(-0.58305);

console.log(id.type);
// -> 'float'
console.log(typeof id.value);
// -> 'number'

ID.factory.float.list(3.665, 0.1, -664.12234);
ID.factory.float.list([1.1, 2.2, 4.4]);

ID.factory.float.map({a: 80.1, b: -625.11});
```

#### Long

```js
const id = ID.factory.long(8125);

console.log(id.type);
// -> 'long'
console.log(typeof id.value);
// -> 'object'
// id is a long-like object
console.log(id.value);
// { low: 8125, high: 0 }

// Accepts long-like objects
ID.factory.long({low: -4434, high: 22});
ID.factory.long.list(-10, 21, {low: 96, high: 34});
ID.factory.long.list([{low: 224456, high: -4}, 2, 4]);

ID.factory.long.map({a: {low: -1, high: 0}, b: -95503343432});
```

#### Bytes

```js
const id = ID.factory.bytes([100, 0, 12, 33]);

console.log(id.type);
// -> 'bytes'
console.log(typeof id.value);
// -> 'array'

// bytes can accept Buffer
ID.factory.bytes(Buffer.from([255, 0, 128]));

// bytes can accept ArrayBuffer
ID.factory.bytes(new ArrayBuffer(16));

// bytes can accept Array-Like objects
ID.factory.bytes(Uint8Array.of(255, 0, 128));
ID.factory.bytes(Uint8ClampedArray.of(100, 99, 38));
ID.factory.bytes({length: 2, '0': 1, '1': 75});

ID.factory.bytes.list([10, 1, 0, 0], [212, 196]);
ID.factory.bytes.list([[1, 2, 4]]);

ID.factory.bytes.map({a: [50, 0], b: [45, 61, 121]});
```

### Semantic Identifiers

#### UUID

Base identifier type is [bytes](#bytes) so the factory accepts multiple types of byte array inputs. The array-like input must contain 16 bytes. The factory also accepts a uuid-encoded string.

```js
const id = ID.factory.uuid('8cdcbe23-c04e-4ea2-ae51-15c9cf16e1b3');

console.log(id.type);
// -> 'uuid'
console.log(typeof id.value);
// -> 'object'
/*
  uuid's id.value is a uuid-like object: 
  {
    bytes: array of 16 bytes
    toString() -> uuid-encoded string
  }
 */

// Accepts a 16-byte array, as well as any other array-like type the bytes identifier accepts
ID.factory.uuid([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
ID.factory.uuid(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
ID.factory.uuid(Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15));

// can mix input types in factory
ID.factory.uuid.list([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '13f3eae9-18d6-46fc-9b3a-d6d32aaee26c');

// can accept a single array of values
ID.factory.uuid.list([
  'cebfc569-2ba6-4cd7-ba25-f51d64c13087', 
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 
  Uint8ClampedArray.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)]);

ID.factory.uuid.map({
  a: '7894746d-62a5-425f-adb7-0a609ababf3f',
  b: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
});
```

#### Datetime

Base identifier type is [long](#long) so the factory accepts the same multiple types of long inputs. It also accepts a JS Date object as an input.

```js
const id = ID.factory.datetime(new Date());

console.log(id.type);
// -> 'datetime'
console.log(typeof id.value);
// -> 'object'
/*
  datetime produces an immutable Date-like object with some of the methods in Date implemented:
  {
    time: number // the unix time value
    toString() -> same as Date.toString()
    toUTCString() -> same as Date.toUTCString()
    toISOString() -> same as Date.toISOString()
    toJSON(key) -> same as Date.toJSON(key)
    toDate() -> returns a standard JS Date instance. Changes to this object will not affect the Identifier
  }
 */

//accepts unix time values
ID.factory.datetime(10000000);

ID.factory.datetime.list(new Date(), 10000000);
ID.factory.datetime.list([3576585434, new Date(10000000)]);

ID.factory.datetime.map({a: 3576585434, b: new Date()});
```

#### Geo

Base identifier type of geo is a [list of 2 floats](#float). Factory  accepts a geo-like object or a list of 2 floats (lat, then long).

```js
/*
  {
    latitude: number between -90.0 and 90.0
    longitude: number between -180.0 and 180.0
  }
 */

const id = ID.factory.geo({latitude: 14.8653, longitude: -23.0987877});

console.log(id.type);
// -> 'geo'
console.log(typeof id.value);
// -> 'object'
/* 
  geo produces a geo-like object identical to the input object shape:
  {
    latitude: number between -90.0 and 90.0
    longitude: number between -180.0 and 180.0
  }
 */

// accepts two floats; first is latitude, second is longitude
ID.factory.geo([-45.6768494, 13.224]);

// accepts mixed types of inputs (both geo-like and 2-element float arrays
ID.factory.geo.list({latitude: 14.8653, longitude: -23.0987877}, [90.0, 100.7685944]);

// accepts a single array of geos
ID.factory.geo.list([[0.23433, -0.1001002], {latitude: 0.0, longitude: 10.11}]);

// accepts mixed types of inputs to create a map
ID.factory.geo.map({a: {latitude: 14.262, longitude: -123.0923}, b: [10.0021, 90.4]});
```

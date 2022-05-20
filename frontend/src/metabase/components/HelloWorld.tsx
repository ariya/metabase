import React from "react";

import { isBoolean } from "metabase/lib/schema_metadata";

console.log({ isBoolean });

// BAD
const message = () => "Hello, world!" + typeof isBoolean;

// GOOD
// const message = () => "Hello, world!";

const HelloWorld = () => <h2>{message()}</h2>;

export default HelloWorld;

import { createSchema } from "sanity";

import { schemaTypes } from ".";

import blockContent from "./blockContent";
import category from "./category";
import post from "./post";
import author from "./author";
import comment from "./comment";

export default createSchema({
    name: "default",
    types: schemaTypes.concat([
        post, 
        author,
        category,
        blockContent,
        comment,
    ]),
});
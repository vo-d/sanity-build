import { defineField, defineType } from "sanity";

export default {
    name:"comment",
    type:"document",
    title:"Comment",
    fields:[
        defineField({
            name: "name",
            type: "string"
        }),
        defineField({
            title: "Approve",
            name: "approve",
            type: "boolean",
            description: "Comments won't show on the site without approval"
        }),
        defineField({
            name: "email",
            type: "string",
        }),
        defineField({
            name: "comment",
            type: "text"
        }),
        defineField({
            name: "post",
            type: "reference",
            to:{type:"post"}
        })
    ]
}
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        image: z.string(),
        date: z.date().or(z.string().transform((str) => new Date(str))),
        category: z.string().optional(),
        readingTime: z.string().optional(),
    }),
});

export const collections = { blog };

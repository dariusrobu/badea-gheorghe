import {defineType, defineField} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categorie',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titlu',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'order',
      title: 'Ordine',
      type: 'number',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'parent',
      title: 'Categorie Părinte',
      type: 'reference',
      to: [{type: 'category'}],
      description: 'Dacă aceasta este o subcategorie, selectați categoria părinte (ex: Fast-food, Tradiționale, etc.)'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'order',
    },
  },
})
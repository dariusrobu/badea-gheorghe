import {defineType, defineField} from 'sanity'

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Produs Meniu',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nume',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Descriere',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'price',
      title: 'Preț (RON)',
      type: 'number',
      validation: (Rule) => Rule.min(0).required()
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'reference',
      to: [{type: 'category'}]
    }),
    defineField({
      name: 'isAvailable',
      title: 'Disponibil',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'featured',
      title: 'Recomandat',
      type: 'boolean',
      initialValue: false
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.title',
    },
  },
})
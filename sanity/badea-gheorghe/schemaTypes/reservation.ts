import {defineType, defineField} from 'sanity'

export const reservation = defineType({
  name: 'reservation',
  title: 'Rezervare Masă',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nume Complet',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string'
    }),
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'time',
      title: 'Ora',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'partySize',
      title: 'Număr Persoane',
      type: 'number',
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: 'location',
      title: 'Locație',
      type: 'string',
      options: {
        list: [
          {title: 'E81 64', value: 'E81 64'},
          {title: 'Centrul Istoric', value: 'Centrul Istoric'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'specialRequests',
      title: 'Cerințe Speciale',
      type: 'text'
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'În Așteptare', value: 'pending'},
          {title: 'Confirmată', value: 'confirmed'},
          {title: 'Anulată', value: 'cancelled'},
          {title: 'Finalizată', value: 'completed'}
        ]
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'notes',
      title: 'Note Interned',
      type: 'text'
    }),
    defineField({
      name: 'createdAt',
      title: 'Creat la',
      type: 'datetime',
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'date',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: `${subtitle}`
      }
    }
  }
})
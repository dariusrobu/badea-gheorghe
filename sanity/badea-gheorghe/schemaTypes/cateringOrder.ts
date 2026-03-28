import {defineType, defineField} from 'sanity'

export const cateringOrder = defineType({
  name: 'cateringOrder',
  title: 'Comandă Catering',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Nume Client',
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
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'deliveryDate',
      title: 'Data Livrare',
      type: 'date',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'deliveryTime',
      title: 'Oră Livrare',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'deliveryType',
      title: 'Tip Livrare',
      type: 'string',
      options: {
        list: [
          {title: 'Livrare la adresă', value: 'delivery'},
          {title: 'Ridicare de la restaurant', value: 'pickup'}
        ]
      },
      initialValue: 'pickup'
    }),
    defineField({
      name: 'deliveryAddress',
      title: 'Adresă Livrare',
      type: 'text'
    }),
    defineField({
      name: 'pickupLocation',
      title: 'Loc de Ridicare',
      type: 'string',
      options: {
        list: [
          {title: 'E81 64', value: 'E81 64'},
          {title: 'Centrul Istoric', value: 'Centrul Istoric'}
        ]
      }
    }),
    defineField({
      name: 'items',
      title: 'Produse',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'menuItem',
              title: 'Produs',
              type: 'reference',
              to: [{type: 'menuItem'}]
            }),
            defineField({
              name: 'quantity',
              title: 'Cantitate',
              type: 'number',
              validation: (Rule) => Rule.required().min(1)
            }),
            defineField({
              name: 'notes',
              title: 'Note',
              type: 'string'
            })
          ],
          preview: {
            select: {
              title: 'menuItem.name',
              quantity: 'quantity'
            },
            prepare(selection) {
              return {
                title: `${selection.title || 'Produs'} x${selection.quantity || 1}`
              }
            }
          }
        }
      ]
    }),
    defineField({
      name: 'specialInstructions',
      title: 'Instrucțiuni Speciale',
      type: 'text'
    }),
    defineField({
      name: 'totalAmount',
      title: 'Sumă Totală (RON)',
      type: 'number'
    }),
    defineField({
      name: 'status',
      title: 'Status Comandă',
      type: 'string',
      options: {
        list: [
          {title: 'În Așteptare', value: 'pending'},
          {title: 'Confirmată', value: 'confirmed'},
          {title: 'În Pregătire', value: 'preparing'},
          {title: 'Livrată', value: 'delivered'},
          {title: 'Ridicată', value: 'pickedup'},
          {title: 'Finalizată', value: 'completed'},
          {title: 'Anulată', value: 'cancelled'}
        ]
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Metodă Plată',
      type: 'string',
      options: {
        list: [
          {title: 'Numerar', value: 'cash'},
          {title: 'Card', value: 'card'}
        ]
      },
      initialValue: 'cash'
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Status Plată',
      type: 'string',
      options: {
        list: [
          {title: 'Neachitată', value: 'pending'},
          {title: 'Achitată', value: 'paid'},
          {title: 'Eșuată', value: 'failed'},
          {title: 'Rambursată', value: 'refunded'}
        ]
      },
      initialValue: 'pending'
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
      title: 'customerName',
      subtitle: 'deliveryDate',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: `Livrare: ${subtitle}`
      }
    }
  }
})
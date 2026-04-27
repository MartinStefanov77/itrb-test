import type { CollectionConfig } from 'payload'

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: {
    useAsTitle: 'title',
  },
 
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,

    },
  ]
    
}
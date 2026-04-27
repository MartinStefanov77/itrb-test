import type { CollectionConfig } from 'payload'

export const NewJobPositions: CollectionConfig = {
  slug: 'new-job-positions',
  admin: {
    useAsTitle: 'title',
  },
 
  fields: [
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'department',
      label: 'Department',
      type: 'relationship',
      relationTo: 'departments',
      required: true,
      localized: true,
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'workType',
      label: 'Work Type',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'yourRole',
      label: 'Your Role',
      type: 'richText',   
      localized: true,   
    },  
    {
      name: 'requirements',
      label: 'Requirements',
      type: 'richText',     
      localized: true, 
    },
    {
      name: 'whatWeOffer',
      label: 'What We Offer',
      type: 'richText', 
      localized: true,     
    },
    {
      name: 'applyUrl',
      label: 'Apply URL',
      type: 'text',      
    },  
   
  ],
  versions: {
    drafts: true,
  },
}
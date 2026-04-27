
'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

export const RenderHTML = ({ data, className = '' }: { data: SerializedEditorState, className?: string }) => {
  const html = convertLexicalToHTML({ data })

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
export interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'compare'
  content: string
  imageUrl?: string
  caption?: string
  leftImageUrl?: string
  rightImageUrl?: string
  leftLabel?: string
  rightLabel?: string
}

// Merge content blocks into a single content string
export const mergeContentBlocksToString = (
  contentBlocks: ContentBlock[]
): string => {
  if (!contentBlocks || contentBlocks.length === 0) {
    return ''
  }

  return contentBlocks
    .map((block) => {
      switch (block.type) {
        case 'text':
          return block.content
        case 'image':
          return `<img src="${block.imageUrl}" alt="${
            block.caption || 'Article image'
          }" />${
            block.caption ? `<p class="image-caption">${block.caption}</p>` : ''
          }`
        case 'compare':
          return `<div class="compare-images" data-left="${
            block.leftImageUrl
          }" data-right="${block.rightImageUrl}" data-left-label="${
            block.leftLabel || ''
          }" data-right-label="${block.rightLabel || ''}"></div>`
        default:
          return ''
      }
    })
    .join('\n\n')
}

// Convert content string back to content blocks
export const convertContentStringToBlocks = (
  content: string
): ContentBlock[] => {
  if (!content || content.trim() === '') {
    return []
  }

  const blocks: ContentBlock[] = []
  const lines = content.split('\n\n').filter((line) => line.trim() !== '')

  let blockId = 1

  for (const line of lines) {
    const trimmedLine = line.trim()

    // Check if it's an image block
    if (trimmedLine.includes('<img src=')) {
      const imgMatch = trimmedLine.match(/<img src="([^"]+)" alt="([^"]*)" \/>/)
      const captionMatch = trimmedLine.match(
        /<p class="image-caption">([^<]+)<\/p>/
      )

      if (imgMatch) {
        blocks.push({
          id: blockId.toString(),
          type: 'image',
          content: '',
          imageUrl: imgMatch[1],
          caption: captionMatch ? captionMatch[1] : undefined
        })
        blockId++
      }
    }
    // Check if it's a compare images block
    else if (trimmedLine.includes('class="compare-images"')) {
      const leftMatch = trimmedLine.match(/data-left="([^"]+)"/)
      const rightMatch = trimmedLine.match(/data-right="([^"]+)"/)
      const leftLabelMatch = trimmedLine.match(/data-left-label="([^"]*)"/)
      const rightLabelMatch = trimmedLine.match(/data-right-label="([^"]*)"/)

      if (leftMatch && rightMatch) {
        blocks.push({
          id: blockId.toString(),
          type: 'compare',
          content: '',
          leftImageUrl: leftMatch[1],
          rightImageUrl: rightMatch[1],
          leftLabel: leftLabelMatch ? leftLabelMatch[1] : undefined,
          rightLabel: rightLabelMatch ? rightLabelMatch[1] : undefined
        })
        blockId++
      }
    }
    // Default to text block
    else {
      blocks.push({
        id: blockId.toString(),
        type: 'text',
        content: trimmedLine
      })
      blockId++
    }
  }

  return blocks
}

// Generate content from text blocks only (for backward compatibility)
export const generateTextContent = (contentBlocks: ContentBlock[]): string => {
  if (!contentBlocks || contentBlocks.length === 0) {
    return ''
  }

  return contentBlocks
    .filter((block) => block.type === 'text')
    .map((block) => block.content)
    .join('\n\n')
}

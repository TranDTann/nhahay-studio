export interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'compare' | 'youtube'
  content: string
  imageUrl?: string
  caption?: string
  leftImageUrl?: string
  rightImageUrl?: string
  leftLabel?: string
  rightLabel?: string
  youtubeUrl?: string
  youtubeId?: string
  // SEO fields
  imageAlt?: string
  imageTitle?: string
  leftAlt?: string
  rightAlt?: string
  youtubeTitle?: string
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
            block.imageAlt || block.caption || 'Article image'
          }"${block.imageTitle ? ` title="${block.imageTitle}"` : ''} />${
            block.caption ? `<p class="image-caption">${block.caption}</p>` : ''
          }`
        case 'compare':
          return `<div class="compare-images" data-left="${
            block.leftImageUrl
          }" data-right="${block.rightImageUrl}" data-left-label="${
            block.leftLabel || ''
          }" data-right-label="${block.rightLabel || ''}" data-left-alt="${
            block.leftAlt || ''
          }" data-right-alt="${block.rightAlt || ''}"></div>`
        case 'youtube':
          return `<div class="youtube-video" data-id="${
            block.youtubeId || ''
          }"${
            block.youtubeTitle ? ` data-title="${block.youtubeTitle}"` : ''
          }></div>`
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
      const imgMatch = trimmedLine.match(
        /<img src="([^"]+)" alt="([^"]*)"(?: title="([^"]*)")? \/>/
      )
      const captionMatch = trimmedLine.match(
        /<p class="image-caption">([^<]+)<\/p>/
      )

      if (imgMatch) {
        blocks.push({
          id: blockId.toString(),
          type: 'image',
          content: '',
          imageUrl: imgMatch[1],
          imageAlt: imgMatch[2] || undefined,
          imageTitle: imgMatch[3] || undefined,
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
      const leftAltMatch = trimmedLine.match(/data-left-alt="([^"]*)"/)
      const rightAltMatch = trimmedLine.match(/data-right-alt="([^"]*)"/)

      if (leftMatch && rightMatch) {
        blocks.push({
          id: blockId.toString(),
          type: 'compare',
          content: '',
          leftImageUrl: leftMatch[1],
          rightImageUrl: rightMatch[1],
          leftLabel: leftLabelMatch ? leftLabelMatch[1] : undefined,
          rightLabel: rightLabelMatch ? rightLabelMatch[1] : undefined,
          leftAlt: leftAltMatch ? leftAltMatch[1] : undefined,
          rightAlt: rightAltMatch ? rightAltMatch[1] : undefined
        })
        blockId++
      }
    }
    // Check if it's a youtube block
    else if (trimmedLine.includes('class="youtube-video"')) {
      const idMatch = trimmedLine.match(/data-id="([^"]*)"/)
      const titleMatch = trimmedLine.match(/data-title="([^"]*)"/)
      const youtubeId = idMatch ? idMatch[1] : ''
      blocks.push({
        id: blockId.toString(),
        type: 'youtube',
        content: '',
        youtubeUrl: youtubeId
          ? `https://www.youtube.com/watch?v=${youtubeId}`
          : undefined,
        youtubeId,
        youtubeTitle: titleMatch ? titleMatch[1] : undefined
      })
      blockId++
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

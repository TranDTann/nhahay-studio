'use client'

import { TRating } from '@/store/ratingPost/crud'
import { Flex, Rate } from 'antd'
import { FaUser } from 'react-icons/fa'
import './styles.scss'

type TRatingItemProps = {
  rating: TRating
}

const RatingItem = ({ rating }: TRatingItemProps) => {
  if (!rating) {
    return null
  }

  return (
    <Flex gap={12} id="RatingItem" align="center">
      <FaUser />
      <p className="rating-author display-max-1-lines">
        {rating.ratingUserName}
      </p>
      <Rate allowHalf value={rating.rating} style={{ fontSize: 16 }} />
      <p>({rating.rating} sao)</p>
    </Flex>
  )
}

export default RatingItem

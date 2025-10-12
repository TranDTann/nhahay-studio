'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { useAuthStore } from '@/store/auth/authStore'
import { TRating } from '@/store/ratingPost/crud'
import {
  resetRatingPostData,
  useRatingPostStore
} from '@/store/ratingPost/ratingPostStore'
import { Button, Flex, Rate } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import RatingItem from './RatingItem'
import './styles.scss'

type TRatingProps = {
  postData: Article
}

const Rating = ({ postData }: TRatingProps) => {
  const router = useRouter()

  const { authUser } = useAuthStore((state) => state)
  const { getRatings, postRating, updateRating, ratings, count } =
    useRatingPostStore((state) => state)
  const isLoggedIn = !!authUser

  const [rating, setRating] = useState(0)
  const [myRating, setMyRating] = useState<TRating>()
  const [ratingOthers, setRatingOthers] = useState<TRating[]>([])
  const [isPostRatingLoading, setIsPostRatingLoading] = useState(false)

  useEffect(() => {
    return () => {
      resetRatingPostData()
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }

    getRatings(postData.id)
  }, [getRatings, postData.id, isLoggedIn])

  useEffect(() => {
    if (!ratings?.length) {
      return
    }

    const updatedMyRating = ratings.find(
      (item) => item.ratingUserId === authUser?.id
    )

    setRating(updatedMyRating?.rating ?? 0)
    setMyRating(updatedMyRating)

    const updatedRatingOhers = ratings.filter(
      (item) => item.ratingUserId !== authUser?.id
    )

    setRatingOthers(updatedRatingOhers)
  }, [ratings])

  const updateRatingData = (data: TRating) => {
    setRating(data.rating)

    const updatedRatings = !ratings?.length
      ? [data]
      : ratings.map((item) => {
          if (item.ratingUserId !== authUser.id) {
            return item
          }

          return { ...item, rating: data.rating }
        })

    useRatingPostStore.setState({
      count: !ratings?.length ? 1 : count,
      ratings: updatedRatings
    })
  }

  const handlePostRating = async () => {
    setIsPostRatingLoading(true)

    try {
      const newRating = await postRating({
        postId: postData.id,
        rating,
        ratingUserId: authUser.id,
        ratingUserName: authUser.username
      })

      updateRatingData(newRating)
    } catch (err) {
      setRating(0)

      console.log(err)
    } finally {
      setIsPostRatingLoading(false)
    }
  }

  const handleUpdateRating = async () => {
    setIsPostRatingLoading(true)

    try {
      const updatedRating = await updateRating({
        postId: postData.id,
        rating,
        ratingUserId: authUser.id,
        ratingUserName: authUser.username,
        id: myRating.id
      })

      updateRatingData(updatedRating)
    } catch (err) {
      setRating(myRating.rating)
      console.log(err)
    } finally {
      setIsPostRatingLoading(false)
    }
  }

  const handleClickLogin = () => {
    useAuthStore.setState({
      postDetailPage: { id: postData.id, title: postData.title }
    })
    router.push(paths.auth.login)
  }

  const contentWithoutLogin = (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={12}
      className="rating-container_not-login"
    >
      <p>Bạn cần đăng nhập để đánh giá về bài viết này</p>
      <Button type="primary" onClick={handleClickLogin}>
        Đăng nhập
      </Button>
    </Flex>
  )

  const myRatingContent = (
    <div>
      {!myRating && (
        <p style={{ paddingBottom: '6px' }}>
          Bạn chưa đánh giá về bài viết này
        </p>
      )}
      <Flex align="center" gap={8}>
        <p style={{ fontSize: '14px' }}> Đánh giá của bạn:</p>
        <Rate
          allowHalf
          value={rating}
          onChange={(value) => setRating(value)}
          style={{ fontSize: 16 }}
        />
        <p>({rating} sao)</p>
        <Button
          type="default"
          size="small"
          onClick={myRating ? handleUpdateRating : handlePostRating}
          disabled={myRating?.rating === rating}
          loading={isPostRatingLoading}
        >
          {myRating ? 'Cập nhật' : 'Đánh giá'}
        </Button>
      </Flex>
    </div>
  )

  const contentWhenLoggedIn = ratingOthers?.length ? (
    <div>
      {myRatingContent}
      <Flex vertical gap={8} className="rating-list">
        <p className="rating-list-title">Các lượt đánh giá khác:</p>
        <Flex vertical gap={8} className="ratings-list-content">
          {ratingOthers.map((ratingItem) => {
            return <RatingItem key={ratingItem.id} rating={ratingItem} />
          })}
        </Flex>
      </Flex>
    </div>
  ) : (
    myRatingContent
  )

  return (
    <div id="RatingPost">
      <h2 className="rating-container-title">
        Đánh giá {count ? <span>({count})</span> : null}
      </h2>
      <div className={`${isLoggedIn && 'rating-container'}`}>
        {isLoggedIn ? contentWhenLoggedIn : contentWithoutLogin}
      </div>
    </div>
  )
}

export default Rating

import { FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa'
import Link from 'next/link'
import './styles.css'

const FollowUs = () => {
  const socials = [
    { id: 1, name: 'Facebook', icon: FaFacebook, link: '' },
    { id: 2, name: 'Youtube', icon: FaYoutube, link: '' },
    { id: 3, name: 'Tiktok', icon: FaTiktok, link: '' }
  ]

  return (
    <div>
      <h1 className="follow-us-title">Theo dõi chúng tôi</h1>
      <div className="social-list">
        {socials.map((socialItem) => (
          <Link
            className="social-item"
            key={socialItem.id}
            href={socialItem.link}
          >
            <socialItem.icon className="social-item_icon" />
            {socialItem.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FollowUs

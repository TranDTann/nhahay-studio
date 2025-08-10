import Link from 'next/link'
import { FaFacebook, FaTiktok, FaYoutube } from 'react-icons/fa'
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
            <p className="social-item_name">{socialItem.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FollowUs

import { useFooterStore } from '@/store/footer/footerStore'
import { EConfig } from '@/types/config'
import { getConfigValue } from '@/utils/getConfig'
import Link from 'next/link'
import { FaFacebook, FaTiktok, FaYoutube } from 'react-icons/fa'
import './styles.css'

type TFollowUsProps = {
  mode?: 'dark' | 'light'
}

const FollowUs = ({ mode = 'dark' }: TFollowUsProps) => {
  const { configs } = useFooterStore((state) => state)

  if (!configs.length) {
    return null
  }

  const socials = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebook,
      link: getConfigValue(EConfig.FACEBOOK, configs)
    },
    {
      id: 'youtube',
      name: 'Youtube',
      icon: FaYoutube,
      link: getConfigValue(EConfig.YOUTUBE, configs)
    },
    {
      id: 'tiktok',
      name: 'Tiktok',
      icon: FaTiktok,
      link: getConfigValue(EConfig.TIKTOK, configs)
    }
  ]

  return (
    <div>
      <h1 className={`follow-us-title follow-us-title-${mode}`}>
        Theo dõi NhahayStudio
      </h1>
      <div className="social-list">
        {socials.map((socialItem) => (
          <Link
            className="social-item"
            key={socialItem.id}
            href={socialItem.link}
            target="_blank"
          >
            <socialItem.icon
              className={`social-item_icon social-item_icon-${mode}`}
            />
            <p className={`social-item_name social-item_name-${mode}`}>
              {socialItem.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FollowUs

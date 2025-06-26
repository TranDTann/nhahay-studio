import { LoginInformation } from './LoginInformation'
import { Logo } from './Logo'
import { Menu } from './Menu'
import './styles.css'

const NavigationBar = () => {
  return (
    <div className="navigation-bar-container">
      <div className="navigation-bar-content">
        <Logo />
        <Menu />
        <LoginInformation />
      </div>
    </div>
  )
}

export default NavigationBar

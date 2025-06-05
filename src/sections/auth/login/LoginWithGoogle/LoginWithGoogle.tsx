import { Button } from 'antd'
import Image from 'next/image'
import './styles.css'

const LoginWithGoogle = () => {
  const handleLoginWithGoogle = () => {}

  return (
    <div className="login-google-wrapper">
      <Button className="login-google-button" onClick={handleLoginWithGoogle}>
        <Image
          src="/logos/google-logo.svg"
          alt="google-logo"
          width={30}
          height={30}
        />
        <p>
          Login with <b>google</b>
        </p>
      </Button>
    </div>
  )
}

export default LoginWithGoogle

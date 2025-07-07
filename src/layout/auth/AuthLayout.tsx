import './AuthLayout.css'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="auth-background">{children}</div>
}

export default AuthLayout

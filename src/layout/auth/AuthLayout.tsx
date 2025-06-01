import './AuthLayout.css'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="auth-background relative box-border h-screen w-screen overflow-hidden">
      {children}
    </div>
  )
}

export default AuthLayout

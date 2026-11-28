interface AuthFormProps {
  authPage: 'login' | 'register';
  authName: string;
  authEmail: string;
  authPassword: string;
  authMessage: string;
  setAuthName: (value: string) => void;
  setAuthEmail: (value: string) => void;
  setAuthPassword: (value: string) => void;
  onLogin: (event: React.FormEvent<HTMLFormElement>) => void;
  onRegister: (event: React.FormEvent<HTMLFormElement>) => void;
  onTogglePage: () => void;
}

export default function AuthForm({
  authPage,
  authName,
  authEmail,
  authPassword,
  authMessage,
  setAuthName,
  setAuthEmail,
  setAuthPassword,
  onLogin,
  onRegister,
  onTogglePage,
}: AuthFormProps) {
  const isRegister = authPage === 'register';

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>MediQueue</h1>
          <p>{isRegister ? 'Create your account' : 'Welcome back'}</p>
        </div>

        <form onSubmit={isRegister ? onRegister : onLogin}>
          {isRegister && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
            />
          </div>

          {authMessage && <p className="auth-message">{authMessage}</p>}

          <button type="submit">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={onTogglePage}>
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
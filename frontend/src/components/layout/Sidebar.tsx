
interface SidebarProps {
  activePage: string
  userRole: string
  userName: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

function Sidebar({
  activePage,
  userRole,
  userName,
  onNavigate,
  onLogout
}: SidebarProps) {
  const pages = [
    'Dashboard',
    'Patients',
    'Register Patient',
    ...(userRole === 'ADMIN' ? ['Doctors'] : []),
    'Appointments',
    'Billing',
    'Medical Test Reports'
  ]

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✚</div>
        <div>
          <h2>MediQueue</h2>
          <span>Hospital Management</span>
        </div>
      </div>

      <p className="menu-heading">MENU</p>

      {pages.map((page) => (
        <button
          key={page}
          className={`nav-item ${activePage === page ? 'active' : ''}`}
          onClick={() => onNavigate(page)}
        >
          <span>
            {page === 'Dashboard' ? '▦' :
              page === 'Patients' ? '♙' :
              page === 'Register Patient' ? '+' :
              page === 'Doctors' ? '⚕' :
              page === 'Billing' ? '₹' :
              page === 'Medical Test Reports' ? '☤' : '▣'}
          </span>
          {page}
        </button>
      ))}

      <div className="sidebar-bottom">
        <div className="admin-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{userName}</strong>
          <span>{userRole}</span>
        </div>

        <button onClick={onLogout}>Logout</button>
      </div>
    </aside>
  )
}

export default Sidebar

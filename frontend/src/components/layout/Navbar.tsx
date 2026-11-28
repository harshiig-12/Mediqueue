
interface NavbarProps {
  activePage: string
  onRefresh: () => void
}

function Navbar({ activePage, onRefresh }: NavbarProps) {
  return (
    <header className="topbar">
      <div>
        <span className="breadcrumb">MediQueue / {activePage}</span>
        <h1>{activePage}</h1>
      </div>

      <button className="refresh-btn" onClick={onRefresh}>
        ↻ Refresh
      </button>
    </header>
  )
}

export default Navbar

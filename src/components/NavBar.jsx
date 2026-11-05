import './NavBar.css';

function NavBar({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <span className="navbar-title">Feedback Collector</span>
      <div className="navbar-links">
        <button
          className={currentPage === 'submit' ? 'nav-button active' : 'nav-button'}
          onClick={() => onNavigate('submit')}
        >
          Submit
        </button>
        <button
          className={currentPage === 'admin' ? 'nav-button active' : 'nav-button'}
          onClick={() => onNavigate('admin')}
        >
          Admin
        </button>
      </div>
    </nav>
  );
}

export default NavBar;

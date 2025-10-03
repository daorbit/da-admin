interface DashboardProps {
  user: any
  onLogout: () => void
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>DA Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="user-details">
          <h2>User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Name:</strong> {user?.name}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="info-item">
              <strong>Role:</strong> {user?.role}
            </div>
            <div className="info-item">
              <strong>Last Login:</strong> {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
            </div>
            <div className="info-item">
              <strong>Account Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>

        <div className="dashboard-features">
          <h2>Admin Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>User Management</h3>
              <p>Manage users and their permissions</p>
            </div>
            <div className="feature-card">
              <h3>Analytics</h3>
              <p>View system analytics and reports</p>
            </div>
            <div className="feature-card">
              <h3>Settings</h3>
              <p>Configure system settings</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
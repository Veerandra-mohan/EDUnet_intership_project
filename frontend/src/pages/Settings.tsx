export default function Settings() {
    return (
        <div className="page-container">
            <h1 className="page-title">Account Settings</h1>
            <div className="card">
                <h3>Profile</h3>
                <p>Admin User</p>
                <div className="form-group mt-4">
                    <input className="form-input" type="password" placeholder="New Password" />
                </div>
                <button className="auth-btn mt-4">Update Profile</button>
            </div>
        </div>
    );
}

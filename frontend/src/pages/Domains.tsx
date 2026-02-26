export default function Domains() {
    return (
        <div className="page-container">
            <h1 className="page-title">Domain Rules configuration</h1>
            <div className="grid-cards">
                <div className="card">
                    <h3>Classroom</h3>
                    <ul>
                        <li>Detect Phones: Violation</li>
                        <li>Head Pose: Monitor</li>
                    </ul>
                </div>
                <div className="card">
                    <h3>Construction</h3>
                    <ul>
                        <li>Hardhat Required</li>
                        <li>Safety Vest Required</li>
                    </ul>
                </div>
                <div className="card">
                    <h3>Hospital</h3>
                    <ul>
                        <li>Mask Required</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

import { MoreHorizontal, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
    total_inspections: number;
    active_violations: number;
    resolved_reports: number;
    recent_activity: any[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/dashboard-stats");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const totalInspections = stats?.total_inspections || 0;
    const activeViolations = stats?.active_violations || 0;
    const resolvedReports = stats?.resolved_reports || 0;

    return (
        <div className="page-container">
            <h1 className="page-title">DeepInspection AI</h1>

            <div className="grid-cards">
                <div className="card glow-card">
                    <span className="badge-tag" style={{ backgroundColor: '#10B981' }}>
                        TRACKED
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Total Inspections</h3>
                        <MoreHorizontal size={18} color="var(--text-muted)" />
                    </div>
                    <p className="big-stat">{loading ? '...' : totalInspections}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        Total processed media
                    </p>
                    <button className="small-btn" onClick={() => navigate("/dashboard/reports")}>View All</button>
                </div>

                <div className="card">
                    <span className="badge-tag" style={{ backgroundColor: activeViolations > 0 ? '#EF4444' : '#10B981' }}>
                        {activeViolations > 0 ? 'ACTION REQUIRED' : 'CLEAR'}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Active Violations</h3>
                        <MoreHorizontal size={18} color="var(--text-muted)" />
                    </div>
                    <p className={`big-stat ${activeViolations > 0 ? 'text-danger' : 'text-success'}`}>
                        {loading ? '...' : activeViolations}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        Open reports needing review
                    </p>
                    <button className="small-btn" disabled={activeViolations === 0} style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: activeViolations === 0 ? 'var(--text-muted)' : 'var(--text-main)', cursor: activeViolations === 0 ? 'not-allowed' : 'pointer' }}>Resolve</button>
                </div>

                <div className="card">
                    <span className="badge-tag" style={{ backgroundColor: '#3B82F6' }}>
                        RESOLVED
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Resolved Reports</h3>
                        <MoreHorizontal size={18} color="var(--text-muted)" />
                    </div>
                    <p className="big-stat">{loading ? '...' : resolvedReports}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        Closed violation cases
                    </p>
                    <button className="small-btn" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>Archive</button>
                </div>
            </div>

            <div className="grid-cards mt-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Recent Activity Logs</h3>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        {loading ? (
                            <p style={{ color: 'var(--text-muted)' }}>Loading activity...</p>
                        ) : stats && stats.recent_activity.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {stats.recent_activity.slice(0, 3).map((act: any, i: number) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1rem', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none' }}>
                                        <div style={{ color: act.risk_score > 0 ? '#EF4444' : '#10B981', background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}>
                                            {act.risk_score > 0 ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500 }}>{act.context} ({act.type}) • {act.risk_level} Risk</p>
                                            <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {act.created_at} • {act.violations.length} Violations found
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>No inspections done yet.</p>
                                <button className="small-btn mt-4" onClick={() => navigate("/dashboard/inspection")}>Run First Inspection</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card glow-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3>Upload / Drop</h3>
                    <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem 0' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>Go to Upload to process an image or video.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate("/dashboard/inspection")}>Go to Upload</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

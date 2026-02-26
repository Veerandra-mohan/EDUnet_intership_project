import { useState, useEffect } from "react";
import { AlertCircle, ShieldCheck, CheckCircle, MessageSquare } from "lucide-react";

interface Report {
    id: string;
    context: string;
    type: string;
    risk_level: string;
    risk_score: number;
    inspection_status: string;
    status: string;
    created_at: string;
    violations: string[];
    chat_history: { role: string, content: string }[];
}

export default function Reports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch("https://deep-inspection-backend.onrender.com/reports");
            const data = await res.json();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (reportId: string) => {
        try {
            await fetch(`https://deep-inspection-backend.onrender.com/resolve-report/${reportId}`, {
                method: "POST"
            });
            // Update local state to reflect resolved
            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: "Resolved" } : r));
            if (selectedReport?.id === reportId) {
                setSelectedReport({ ...selectedReport, status: "Resolved" });
            }
        } catch (error) {
            console.error("Failed to resolve report", error);
            alert("Could not resolve report.");
        }
    };

    const getRiskColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case "high": return "#EF4444";
            case "medium": return "#F59E0B";
            case "low": return "#10B981";
            default: return "var(--text-main)";
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Inspection Reports</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: selectedReport ? '1fr 1fr' : '1fr' }}>
                <div className="card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <h3>All Reports</h3>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Loading reports...</p>
                    ) : reports.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No reports found.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    onClick={() => setSelectedReport(report)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        gap: '1rem',
                                        padding: '1rem',
                                        border: selectedReport?.id === report.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: selectedReport?.id === report.id ? 'var(--bg-main)' : 'transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ color: report.risk_score > 0 ? '#EF4444' : '#10B981', background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}>
                                            {report.risk_score > 0 ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500, fontSize: '1rem' }}>
                                                {report.id}
                                            </p>
                                            <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {report.context} • {report.created_at}
                                            </p>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: `${getRiskColor(report.risk_level)}20`, color: getRiskColor(report.risk_level), fontWeight: 600 }}>
                                                    {report.risk_level} Risk
                                                </span>
                                                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: report.status === 'Resolved' ? '#10B98120' : '#EF444420', color: report.status === 'Resolved' ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                                                    {report.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                                        <MessageSquare size={14} />
                                        <span style={{ fontSize: '0.85rem' }}>{report.chat_history?.length || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedReport && (
                    <div className="card glow-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                            <div>
                                <h3>Report Details</h3>
                                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedReport.id}</p>
                            </div>
                            {selectedReport.status === 'Open' ? (
                                <button
                                    className="auth-btn"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                    onClick={() => handleResolve(selectedReport.id)}
                                >
                                    Resolve
                                </button>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600 }}>
                                    <CheckCircle size={20} /> Resolved
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Context Rule</span>
                                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{selectedReport.context}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Risk Level</span>
                                <span style={{ fontWeight: 600, color: getRiskColor(selectedReport.risk_level) }}>
                                    {selectedReport.risk_level} (Score: {selectedReport.risk_score})
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Inspection Time</span>
                                <span style={{ fontWeight: 500 }}>{selectedReport.created_at}</span>
                            </div>

                            <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Violations</span>
                                {selectedReport.violations?.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#EF4444', fontSize: '0.9rem' }}>
                                        {selectedReport.violations.map((v, i) => (
                                            <li key={i} style={{ marginBottom: '0.25rem' }}>{v}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span style={{ color: '#10B981', fontWeight: 600 }}>No violations detected.</span>
                                )}
                            </div>
                        </div>

                        {selectedReport.chat_history && selectedReport.chat_history.length > 0 && (
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <MessageSquare size={18} color="var(--accent-color)" /> Audit Chat History
                                </h4>
                                <div style={{
                                    background: 'var(--bg-main)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}>
                                    {selectedReport.chat_history.map((msg, i) => (
                                        <div key={i} style={{
                                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                            background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--card-bg)',
                                            color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                                            maxWidth: '90%'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', opacity: 0.8, fontWeight: 600 }}>
                                                {msg.role === 'user' ? 'Inspector' : 'AI Assistant'}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{msg.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

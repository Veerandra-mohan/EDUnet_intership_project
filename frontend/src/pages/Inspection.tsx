import { useState, useRef } from "react";
import { UploadCloud, CheckCircle, AlertTriangle, MessageSquare, Send } from "lucide-react";

interface DetectionResult {
    context: string;
    scene_data: {
        people: any[];
        [key: string]: any;
    };
    violations: string[];
    risk_score: number;
    risk_level: string;
    inspection_status: string;
    report_id: string;
}

export default function Inspection() {
    const [file, setFile] = useState<File | null>(null);
    const [context, setContext] = useState("classroom");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DetectionResult | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Chat state
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [apiKey, setApiKey] = useState<string>(localStorage.getItem("gemini_api_key") || "");

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setResult(null); // Clear previous results
            setChatHistory([]); // Clear chat for new image

            if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
                setPreviewUrl(URL.createObjectURL(selectedFile));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("context", context);

        const isVideo = file.type.startsWith("video/");
        const endpoint = isVideo ? "https://deep-inspection-backend.onrender.com/analyze-video" : "https://deep-inspection-backend.onrender.com/analyze-image";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setResult(data);
            setChatHistory([]); // Reset chat when new analysis is done
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Error connecting to the backend. Is it running?");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || !result?.report_id || chatLoading) return;

        if (!apiKey.trim()) {
            setChatHistory(prev => [...prev, { role: "assistant", content: "Chat Error: Please add your API key in settings." }]);
            return;
        }

        const question = chatInput.trim();
        setChatInput("");
        setChatHistory(prev => [...prev, { role: "user", content: question }]);
        setChatLoading(true);

        try {
            let imageBase64 = undefined;
            if (file && file.type.startsWith('image/')) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            }

            const response = await fetch("https://deep-inspection-backend.onrender.com/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    report_id: result.report_id,
                    question: question,
                    api_key: apiKey || undefined,
                    image: imageBase64
                })
            });

            const data = await response.json();
            setChatHistory(prev => [...prev, { role: "assistant", content: data.response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setChatHistory(prev => [...prev, { role: "assistant", content: "Error communicating with AI Inspector." }]);
        } finally {
            setChatLoading(false);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level.toLowerCase()) {
            case "high": return "#EF4444";
            case "medium": return "#F59E0B";
            case "low": return "#10B981";
            default: return "var(--text-main)";
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Run Inspection</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: result ? '1fr 1fr' : '1fr' }}>
                <div className="card">
                    <h3>Upload Media</h3>

                    <div
                        className="upload-area"
                        onClick={handleUploadClick}
                        style={{ cursor: 'pointer', border: file ? '2px solid var(--accent-color)' : '', padding: previewUrl ? '1rem' : '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        {previewUrl ? (
                            file?.type.startsWith('image/') ? (
                                <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '0.5rem', objectFit: 'contain' }} />
                            ) : (
                                <video src={previewUrl} controls style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '0.5rem' }} />
                            )
                        ) : (
                            <UploadCloud size={48} color={file ? "var(--accent-color)" : "var(--text-muted)"} />
                        )}
                        <p style={{ marginTop: '1rem', color: file ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'center' }}>
                            {file ? `Selected: ${file.name}` : "Click to select or drag & drop image/video here"}
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                        />
                    </div>

                    <div className="form-group mt-4">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Domain Context</label>
                        <select
                            className="form-input"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                        >
                            <option value="classroom">Classroom Attention</option>
                            <option value="construction">Construction Safety</option>
                            <option value="hospital">Hospital PPE</option>
                        </select>
                    </div>

                    <button
                        className="auth-btn mt-4"
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        style={{ width: '100%', opacity: (!file || loading) ? 0.7 : 1 }}
                    >
                        {loading ? "Analyzing..." : "Start Analysis"}
                    </button>

                    {result && (
                        <div className="mt-4" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <button
                                className="auth-btn"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                onClick={() => alert("Report saved successfully!")}
                            >
                                <CheckCircle size={18} />
                                Save Report ({result.report_id})
                            </button>
                        </div>
                    )}
                </div>

                {result && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className={`card glow-card`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3>Analysis Result</h3>
                                {result.inspection_status === "Compliant" ? <CheckCircle color="#10B981" /> : <AlertTriangle color="#EF4444" />}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Context Rule</span>
                                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{result.context}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Risk Level</span>
                                    <span style={{
                                        fontWeight: 600,
                                        color: getRiskColor(result.risk_level),
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '1rem',
                                        background: `${getRiskColor(result.risk_level)}20`
                                    }}>
                                        {result.risk_level} (Score: {result.risk_score})
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Objects Detected</span>
                                    <span style={{ fontWeight: 600 }}>
                                        {result.scene_data?.people?.length || 0} Persons, {result.scene_data?.phones_detected || 0} Phones
                                    </span>
                                </div>

                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Violations</span>
                                    {result.violations.length > 0 ? (
                                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#EF4444', fontSize: '0.9rem' }}>
                                            {result.violations.map((v, i) => (
                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{v}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span style={{ color: '#10B981', fontWeight: 600 }}>No violations detected.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chat UI for Ask Inspector */}
                        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={20} color="var(--accent-color)" />
                                    <h3 style={{ margin: 0 }}>Ask Inspector</h3>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Paste Gemini API Key"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        style={{ width: '200px', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                                    />
                                    <button
                                        className="auth-btn"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => {
                                            localStorage.setItem("gemini_api_key", apiKey.trim());
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                flex: 1,
                                background: 'var(--bg-main)',
                                borderRadius: '8px',
                                padding: '1rem',
                                overflowY: 'auto',
                                minHeight: '200px',
                                maxHeight: '300px',
                                marginBottom: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                {chatHistory.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>
                                        Ask questions about this inspection report.
                                    </p>
                                ) : (
                                    chatHistory.map((msg, i) => (
                                        <div key={i} style={{
                                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                            background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--card-bg)',
                                            color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                                            maxWidth: '85%'
                                        }}>
                                            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{msg.content}</p>
                                        </div>
                                    ))
                                )}
                                {chatLoading && (
                                    <div style={{
                                        alignSelf: 'flex-start',
                                        background: 'var(--card-bg)',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Inspector is typing...</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Type your question here..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    style={{ flex: 1, minWidth: 0, padding: '0.75rem' }}
                                />
                                <button
                                    className="auth-btn"
                                    style={{ padding: '0 1.5rem', width: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={handleSendMessage}
                                    disabled={chatLoading || !chatInput.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

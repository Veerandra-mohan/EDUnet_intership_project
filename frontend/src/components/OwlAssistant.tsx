import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import owlBotImg from './owl/owl_bot.png';

export default function OwlAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const [messages, setMessages] = useState<{ sender: 'user' | 'owl', text: string }[]>([
        { sender: 'owl', text: "Hoot! I'm your DeepInspection guide. How can I help you?" }
    ]);

    const OWL_KNOWLEDGE: Record<string, string> = {
        "What is this website?": "DeepInspection AI is a powerful platform for analyzing media and ensuring safety rules are met in environments like construction, classrooms, and hospitals.",
        "How to upload?": "Go to the Dashboard and click 'Go to Upload' or navigate directly to the Inspection page via the sidebar to select your media.",
        "What is risk level?": "Risk level (Low, Medium, High) indicates the severity of detected violations. E.g., missing a hardhat carries a high risk score.",
        "How to resolve violation?": "Go to the Reports page, select a report with an 'Open' status, and click 'Resolve' once the issue is addressed."
    };

    const handleQuestionClick = (question: string) => {
        // Add user question
        setMessages(prev => [...prev, { sender: 'user', text: question }]);

        // Add owl response
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'owl', text: OWL_KNOWLEDGE[question] }]);
        }, 300);
    };

    return (
        <div style={{ position: 'fixed', bottom: '-2rem', right: '-2rem', zIndex: 1000 }}>
            {isOpen && (
                <div className="card glow-card" style={{
                    position: 'absolute',
                    bottom: '4.5rem',
                    right: '0',
                    width: '320px',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ background: 'var(--accent-color)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={owlBotImg} alt="Owl" style={{ width: '28px', height: '28px' }} />
                            <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>Owl Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                background: msg.sender === 'user' ? 'var(--accent-color)' : 'var(--card-bg)',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                                padding: '0.75rem 1rem',
                                borderRadius: '1rem',
                                borderBottomLeftRadius: msg.sender === 'owl' ? '0' : '1rem',
                                borderBottomRightRadius: msg.sender === 'user' ? '0' : '1rem',
                                maxWidth: '85%',
                                fontSize: '0.9rem',
                                border: msg.sender === 'owl' ? '1px solid var(--border-color)' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ask a question:</p>
                        {Object.keys(OWL_KNOWLEDGE).map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleQuestionClick(q)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.5rem 0.75rem',
                                    background: 'var(--bg-main)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '0.5rem',
                                    color: 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    textAlign: 'left',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'var(--card-bg)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                            >
                                {q} <ChevronRight size={14} color="var(--accent-color)" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!isOpen && showGreeting && (
                <div style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '85%',
                    marginRight: '-1rem',
                    background: '#ffffff',
                    color: '#333333',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '1rem',
                    borderBottomRightRadius: '0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    whiteSpace: 'nowrap',
                    border: '2px solid var(--accent-color)',
                    pointerEvents: 'auto',
                    zIndex: 10
                }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowGreeting(false);
                        }}
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        title="Dismiss"
                    >
                        <X size={12} strokeWidth={3} />
                    </button>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>HI!</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'normal', marginTop: '0.1rem' }}>do you have question?</div>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '14rem',
                    height: '14rem',
                    borderRadius: '50%',
                    background: 'transparent',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    transition: 'transform 0.2s',
                    transform: isOpen ? 'scale(0.95)' : 'scale(1)',
                    padding: 0
                }}
            >
                {isOpen ? <div style={{ background: 'var(--accent-color)', width: '3.5rem', height: '3.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}><X size={24} /></div> : <img src={owlBotImg} alt="Owl" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
            </button>
        </div>
    );
}

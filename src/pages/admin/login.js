import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";

const LoginAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focused, setFocused] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/auth/login', {
                username: e.target.username.value,
                password: e.target.password.value,
            }, { headers: { 'Content-Type': 'application/json' } });
            if (res.data.status === 200) {
                await router.push('/admin/dashboard');
            } else {
                throw new Error('Login Gagal');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Username atau password salah');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = (field) => ({
        width: '100%',
        background: focused === field ? '#eff6ff' : '#f8faff',
        border: focused === field ? '2px solid #3b82f6' : '2px solid #e2e8f0',
        borderRadius: '12px',
        color: '#1e293b',
        fontSize: '15px',
        fontWeight: 500,
        padding: '14px 46px 14px 44px',
        outline: 'none',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        boxShadow: focused === field ? '0 0 0 4px rgba(59,130,246,0.1)' : '0 1px 2px rgba(0,0,0,0.04)',
    });

    return (
        <>
            <Head>
                <title>Login Admin — Panel Kelulusan</title>
            </Head>

            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(145deg, #eff6ff 0%, #f0f4ff 50%, #e8f0fe 100%)', zIndex: 0 }} />
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', animation: 'blobDrift 14s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', animation: 'blobDrift 18s ease-in-out infinite reverse' }} />
            </div>

            {/* Main */}
            <div style={{
                position: 'relative', zIndex: 1, minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px 16px',
                fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
            }}>
                <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.6s ease forwards' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '68px', height: '68px', borderRadius: '20px',
                            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                            boxShadow: '0 10px 32px rgba(37,99,235,0.3)',
                            marginBottom: '20px',
                            animation: 'floatUpDown 4s ease-in-out infinite',
                        }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </div>
                        <h1 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.025em', marginBottom: '8px' }}>
                            Admin Panel
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                            Masuk untuk mengelola data kelulusan
                        </p>
                    </div>

                    {/* Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '32px 28px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(37,99,235,0.1)',
                        border: '1px solid rgba(59,130,246,0.1)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* Blue top bar */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #1d4ed8, #60a5fa, #1d4ed8)' }} />

                        <form onSubmit={handleLogin} autoComplete="off">
                            {/* Username */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                    Username
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.4 }}>👤</span>
                                    <input
                                        id="username-input"
                                        name="username" type="text" required
                                        placeholder="Username admin"
                                        onFocus={() => setFocused('username')}
                                        onBlur={() => setFocused(null)}
                                        style={inputStyle('username')}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: '28px' }}>
                                <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.4 }}>🔑</span>
                                    <input
                                        id="password-input"
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused(null)}
                                        style={inputStyle('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        tabIndex={-1}
                                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '15px', lineHeight: 1, padding: 0 }}
                                    >
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{
                                    background: '#fef2f2', border: '1.5px solid #fecaca',
                                    borderRadius: '10px', padding: '11px 14px', marginBottom: '20px',
                                    color: '#dc2626', fontSize: '13px', fontWeight: 500,
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                }}>
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                id="login-submit-btn"
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%', padding: '15px',
                                    borderRadius: '12px', border: 'none',
                                    background: isLoading ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                                    color: 'white', fontSize: '15px', fontWeight: 700,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease', fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: isLoading ? 'none' : '0 6px 24px rgba(37,99,235,0.35)',
                                    letterSpacing: '0.02em',
                                }}
                                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(37,99,235,0.45)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.35)'; }}
                            >
                                {isLoading
                                    ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'rotateSlow 0.8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Masuk...</>
                                    : <>Masuk ke Panel <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                                }
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginTop: '18px' }}>
                        🔒 Akses terbatas untuk administrator
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes floatUpDown { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
                @keyframes rotateSlow  { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                @keyframes blobDrift   { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(20px,-20px) scale(1.05); } 66% { transform:translate(-15px,15px) scale(0.95); } }
            `}</style>
        </>
    );
};

export default LoginAdmin;
import Head from 'next/head'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios'
import { ENV } from "@/utility/const";
import ModalErrorAPI from "@/components/Modals/Error";

export default function Home({ data, isClosed }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        const formData = new FormData(event.target);
        const nisn  = formData.get("nisn");
        const date  = formData.get("date");
        const month = formData.get("month");
        const year  = formData.get("year");
        const birth = `${year}-${String(month).padStart(2,'0')}-${String(date).padStart(2,'0')}`;

        try {
            const response = await axios.post('/api/student/login', { nisn, date: birth }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.data.status !== 200) throw new Error('Data siswa tidak ditemukan');
            await router.push('/result');
        } catch (e) {
            setError(e.response?.data?.message || e.message || 'Terjadi kesalahan');
        } finally {
            setIsLoading(false);
        }
    };

    const inputBase = (field) => ({
        width: '100%',
        background: focusedField === field ? '#eff6ff' : '#f8faff',
        border: focusedField === field
            ? '2px solid #3b82f6'
            : '2px solid #e2e8f0',
        borderRadius: '12px',
        color: '#1e293b',
        fontSize: '15px',
        fontWeight: 500,
        outline: 'none',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        boxShadow: focusedField === field
            ? '0 0 0 4px rgba(59,130,246,0.12)'
            : '0 1px 2px rgba(0,0,0,0.04)',
    });

    return (
        <>
            <Head>
                <title>{data?.nama_sekolah ?? 'Pengumuman Kelulusan'}</title>
                <meta name="description" content="Website Pengumuman Kelulusan Siswa" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {(!data || isClosed) && <ModalErrorAPI />}

            {/* Page background */}
            <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(145deg, #eff6ff 0%, #f0f4ff 40%, #e8f0fe 100%)', zIndex: 0 }} />

            {/* Decorative blobs */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '-120px', right: '-80px',
                    width: '420px', height: '420px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                    animation: 'blobDrift 12s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-100px', left: '-60px',
                    width: '380px', height: '380px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                    animation: 'blobDrift 16s ease-in-out infinite reverse',
                }} />
                {/* Dot grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.12) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }} />
            </div>

            {/* Content */}
            <div style={{
                position: 'relative', zIndex: 1,
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px 16px',
                fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
            }}>
                <div style={{ width: '100%', maxWidth: '460px', animation: 'fadeInUp 0.6s ease forwards' }}>

                    {/* Logo + heading */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '96px', height: '96px', borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 8px 32px rgba(37,99,235,0.15), 0 2px 8px rgba(0,0,0,0.08)',
                            marginBottom: '22px',
                            animation: 'floatUpDown 4s ease-in-out infinite',
                            overflow: 'hidden',
                            border: '2px solid rgba(59,130,246,0.1)',
                        }}>
                            <img
                                src="/img/main-logo.png"
                                alt="Logo"
                                style={{ width: '84px', height: '84px', objectFit: 'contain' }}
                                onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:40px">🎓</span>'; }}
                            />
                        </div>

                        {/* Live badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: '#eff6ff', border: '1.5px solid #bfdbfe',
                            borderRadius: '100px', padding: '4px 14px', marginBottom: '16px',
                        }}>
                            <span style={{
                                display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
                                background: '#22c55e', boxShadow: '0 0 6px #22c55e',
                                animation: 'pulseDot 2s ease-in-out infinite',
                            }} />
                            <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Portal Resmi
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
                            fontWeight: 800, color: '#0f172a',
                            letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '10px',
                        }}>
                            {data?.judul_web ?? 'Pengumuman Kelulusan'}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 400 }}>
                            Tahun Ajaran 2025/2026
                        </p>
                    </div>

                    {/* Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '36px 32px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(37,99,235,0.1)',
                        border: '1px solid rgba(59,130,246,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Top accent line */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                            background: 'linear-gradient(90deg, #2563eb, #60a5fa, #2563eb)',
                        }} />

                        <form onSubmit={handleSubmit} autoComplete="off">
                            {/* NISN */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block', color: '#475569', fontSize: '12px', fontWeight: 700,
                                    marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase',
                                }}>
                                    NISN
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '17px', opacity: 0.4 }}>🪪</span>
                                    <input
                                        id="nisn-input"
                                        name="nisn" type="number" required
                                        placeholder="Nomor Induk Siswa Nasional"
                                        onFocus={() => setFocusedField('nisn')}
                                        onBlur={() => setFocusedField(null)}
                                        style={{ ...inputBase('nisn'), padding: '14px 14px 14px 46px' }}
                                    />
                                </div>
                            </div>

                            {/* Tanggal Lahir */}
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{
                                    display: 'block', color: '#475569', fontSize: '12px', fontWeight: 700,
                                    marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase',
                                }}>
                                    Tanggal Lahir
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                    {[
                                        { name: 'date',  placeholder: 'DD',   label: 'Tanggal' },
                                        { name: 'month', placeholder: 'MM',   label: 'Bulan' },
                                        { name: 'year',  placeholder: 'YYYY', label: 'Tahun' },
                                    ].map(f => (
                                        <div key={f.name}>
                                            <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '5px', textAlign: 'center' }}>{f.label}</p>
                                            <input
                                                id={`${f.name}-input`}
                                                name={f.name} type="number" required
                                                placeholder={f.placeholder}
                                                onFocus={() => setFocusedField(f.name)}
                                                onBlur={() => setFocusedField(null)}
                                                style={{
                                                    ...inputBase(f.name),
                                                    padding: '13px 8px',
                                                    textAlign: 'center',
                                                    fontSize: '16px',
                                                    fontWeight: 700,
                                                    color: '#1e40af',
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{
                                    background: '#fef2f2', border: '1.5px solid #fecaca',
                                    borderRadius: '10px', padding: '12px 14px', marginBottom: '20px',
                                    color: '#dc2626', fontSize: '14px', fontWeight: 500,
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                id="submit-btn"
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%', padding: '15px',
                                    borderRadius: '12px', border: 'none',
                                    background: isLoading
                                        ? '#93c5fd'
                                        : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
                                    backgroundSize: '200% auto',
                                    color: 'white', fontSize: '15px', fontWeight: 700,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.25s ease',
                                    fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    boxShadow: isLoading ? 'none' : '0 6px 24px rgba(37,99,235,0.35)',
                                    letterSpacing: '0.02em',
                                    animation: isLoading ? 'none' : 'shimmerBtn 3s linear infinite',
                                }}
                                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,99,235,0.45)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.35)'; }}
                            >
                                {isLoading ? (
                                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'rotateSlow 0.8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Memverifikasi...</>
                                ) : (
                                    <>{data?.button_label ?? 'Cek Kelulusan'} <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginTop: '20px' }}>
                        🔒 Data Anda aman &amp; terenkripsi
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes floatUpDown { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
                @keyframes rotateSlow  { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                @keyframes shimmerBtn  { 0% { background-position:0% center; } 100% { background-position:200% center; } }
                @keyframes pulseDot    { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.85); } }
                @keyframes blobDrift   { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(20px,-20px) scale(1.05); } 66% { transform:translate(-15px,15px) scale(0.95); } }
            `}</style>
        </>
    );
}

export async function getServerSideProps() {
    // ── Countdown gate: redirect until 4 Mei 2026 10.00 WIB ──────────────
    const TARGET_MS = new Date('2026-05-04T10:00:00+07:00').getTime();
    if (Date.now() < TARGET_MS) {
        return { redirect: { destination: '/countdown', permanent: false } };
    }
    // ─────────────────────────────────────────────────────────────────────

    let data;
    try {
        const res = await axios.get(`${ENV.base}/api/info`);
        if (res.status === 200) data = res.data;
        else data = null;
    } catch { data = null; }
    return { props: { data: data?.data ?? null, isClosed: data?.data?.isOpen === 0 } };
}

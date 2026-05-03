import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ENV } from '@/utility/const';

// ─── Target: 4 Mei 2026 pukul 10.00 WIB (UTC+7) ───────────────────────────
const TARGET_MS = new Date('2026-05-04T10:00:00+07:00').getTime();

function getTimeLeft() {
    const diff = TARGET_MS - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    return {
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
        done: false,
    };
}

// ─── Floating particles ────────────────────────────────────────────────────
function useParticles(canvasRef) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const STARS = Array.from({ length: 120 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: 0.5 + Math.random() * 1.5,
            a: Math.random(),
            da: (Math.random() - 0.5) * 0.008,
            speed: 0.00005 + Math.random() * 0.0001,
        }));

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            STARS.forEach(s => {
                s.y -= s.speed;
                if (s.y < 0) { s.y = 1; s.x = Math.random(); }
                s.a = Math.max(0.1, Math.min(1, s.a + s.da));
                if (s.a <= 0.1 || s.a >= 1) s.da *= -1;
                ctx.beginPath();
                ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.a})`;
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        }
        raf = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
}

// ─── Digit flip card ──────────────────────────────────────────────────────
function Digit({ value, label }) {
    const str = String(value).padStart(2, '0');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
                display: 'flex', gap: '6px',
            }}>
                {str.split('').map((d, i) => (
                    <div key={i} style={{
                        position: 'relative',
                        width: 'clamp(52px, 12vw, 88px)',
                        height: 'clamp(68px, 16vw, 112px)',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                    }}>
                        {/* Shine */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)',
                            borderRadius: '14px 14px 0 0',
                        }} />
                        {/* Mid line */}
                        <div style={{
                            position: 'absolute', top: '50%', left: 0, right: 0,
                            height: '1.5px', background: 'rgba(0,0,0,0.35)',
                        }} />
                        <span style={{
                            fontFamily: "'Inter', monospace",
                            fontSize: 'clamp(2rem, 8vw, 4rem)',
                            fontWeight: 800,
                            color: 'white',
                            lineHeight: 1,
                            letterSpacing: '-0.04em',
                            textShadow: '0 2px 12px rgba(99,179,237,0.5)',
                            userSelect: 'none',
                        }}>{d}</span>
                    </div>
                ))}
            </div>
            <span style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: 'clamp(10px, 2vw, 13px)',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
            }}>{label}</span>
        </div>
    );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function CountdownPage({ schoolName, judul }) {
    const [timeLeft, setTimeLeft] = useState(null); // null on server to avoid hydration mismatch
    const canvasRef = useRef(null);
    const router = useRouter();
    useParticles(canvasRef);

    useEffect(() => {
        // Only runs on client — safe to call Date.now() here
        const t = getTimeLeft();
        setTimeLeft(t);
        if (t.done) { router.replace('/'); return; }
        const id = setInterval(() => {
            const next = getTimeLeft();
            setTimeLeft(next);
            if (next.done) { clearInterval(id); router.replace('/'); }
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const targetDate = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
    }).format(new Date(TARGET_MS));

    return (
        <>
            <Head>
                <title>Segera Hadir – {judul ?? 'Pengumuman Kelulusan'}</title>
                <meta name="description" content="Halaman menuju pengumuman kelulusan siswa" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            {/* ── Background ── */}
            <div style={{
                position: 'fixed', inset: 0,
                background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #0f2157 70%, #1a1040 100%)',
                zIndex: 0,
            }} />

            {/* Glow orbs */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
                    width: '80vw', height: '60vh',
                    background: 'radial-gradient(ellipse, rgba(56,130,246,0.18) 0%, transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-10%',
                    width: '50vw', height: '50vh',
                    background: 'radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 70%)',
                }} />
            </div>

            {/* Stars canvas */}
            <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

            {/* ── Content ── */}
            <div style={{
                position: 'relative', zIndex: 2,
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '32px 16px',
                fontFamily: "'Inter', sans-serif",
                textAlign: 'center',
            }}>

                {/* Logo */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '2px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '28px',
                    boxShadow: '0 0 40px rgba(56,130,246,0.3)',
                    animation: 'floatLogo 4s ease-in-out infinite',
                }}>
                    <img
                        src="/img/main-logo.png"
                        alt="Logo"
                        style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                        onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:36px">🎓</span>'; }}
                    />
                </div>

                {/* Eyebrow badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(56,130,246,0.15)',
                    border: '1.5px solid rgba(56,130,246,0.35)',
                    borderRadius: '100px', padding: '5px 16px',
                    marginBottom: '20px',
                }}>
                    <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#60a5fa', boxShadow: '0 0 8px #60a5fa',
                        display: 'inline-block',
                        animation: 'pulse 2s ease-in-out infinite',
                    }} />
                    <span style={{ color: '#93c5fd', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Segera Hadir
                    </span>
                </div>

                {/* Title */}
                <h1 style={{
                    color: 'white', fontSize: 'clamp(1.6rem, 5vw, 2.6rem)',
                    fontWeight: 800, letterSpacing: '-0.03em',
                    lineHeight: 1.2, margin: '0 0 10px',
                    textShadow: '0 2px 20px rgba(56,130,246,0.4)',
                }}>
                    {judul ?? 'Pengumuman Kelulusan'}
                </h1>
                {schoolName && (
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 500, margin: '0 0 8px' }}>
                        Tahun Ajaran 2025/2026
                    </p>
                )}
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', margin: '0 0 48px' }}>
                    Dibuka pada {targetDate} WIB
                </p>

                {/* ── Countdown digits ── */}
                {timeLeft ? (
                    <div style={{
                        display: 'flex', gap: 'clamp(16px, 4vw, 36px)',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap', justifyContent: 'center',
                        marginBottom: '56px',
                    }}>
                        {timeLeft.days > 0 && <Digit value={timeLeft.days} label="Hari" />}
                        <Digit value={timeLeft.hours} label="Jam" />
                        <Digit value={timeLeft.minutes} label="Menit" />
                        <Digit value={timeLeft.seconds} label="Detik" />
                    </div>
                ) : (
                    // Placeholder skeleton shown during SSR / before hydration
                    <div style={{
                        display: 'flex', gap: 'clamp(16px, 4vw, 36px)',
                        alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center',
                        marginBottom: '56px', opacity: 0.3,
                    }}>
                        {['Jam', 'Menit', 'Detik'].map(label => (
                            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {['0', '0'].map((d, i) => (
                                        <div key={i} style={{
                                            width: 'clamp(52px,12vw,88px)', height: 'clamp(68px,16vw,112px)',
                                            borderRadius: '14px', background: 'rgba(255,255,255,0.08)',
                                            border: '1.5px solid rgba(255,255,255,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{ fontSize: 'clamp(2rem,8vw,4rem)', fontWeight: 800, color: 'white' }}>{d}</span>
                                        </div>
                                    ))}
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer note */}
                <p style={{
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '12px', fontWeight: 500,
                    maxWidth: '360px', lineHeight: 1.7,
                }}>
                    🔒 Halaman pengumuman kelulusan akan otomatis terbuka saat countdown selesai.
                </p>
            </div>

            <style jsx global>{`
                @keyframes floatLogo {
                    0%,100% { transform: translateY(0); }
                    50%      { transform: translateY(-10px); }
                }
                @keyframes pulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%      { opacity:0.5; transform:scale(0.8); }
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #0a0f1e; }
            `}</style>
        </>
    );
}

export async function getServerSideProps() {
    // If time has already passed, go straight to index
    if (Date.now() >= TARGET_MS) {
        return { redirect: { destination: '/', permanent: false } };
    }
    let data = null;
    try {
        const res = await axios.get(`${ENV.base}/api/info`);
        data = res.data?.data ?? null;
    } catch { /* ignore */ }
    return {
        props: {
            schoolName: data?.nama_sekolah ?? null,
            judul: data?.judul_web ?? null,
        },
    };
}

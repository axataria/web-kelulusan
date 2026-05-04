import Head from 'next/head'
import { useEffect, useRef } from "react";
import axios from "axios";
import { ENV } from "@/utility/const";


// Pure-canvas confetti – no extra package needed
function useConfetti(active) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const COLORS = ['#2563eb', '#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c', '#38bdf8'];
        const pieces = Array.from({ length: 160 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: 6 + Math.random() * 8,
            h: 10 + Math.random() * 8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot: Math.random() * 360,
            rotV: (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 3,
            vy: 3 + Math.random() * 4,
            opacity: 1,
        }));

        let start = null;
        const DURATION = 5000; // ms
        let raf;

        function draw(ts) {
            if (!start) start = ts;
            const elapsed = ts - start;
            const fade = Math.max(0, 1 - elapsed / DURATION);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.rotV;
                if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }

                ctx.save();
                ctx.globalAlpha = fade * p.opacity;
                ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
                ctx.rotate((p.rot * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            if (elapsed < DURATION) {
                raf = requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        raf = requestAnimationFrame(draw);

        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
        };
    }, [active]);

    return canvasRef;
}

function InfoCard({ label, value, icon }) {
    return (
        <div style={{
            background: '#f8faff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 18px',
        }}>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>
                {icon} {label}
            </div>
            <div style={{ color: '#1e293b', fontSize: '15px', fontWeight: 700 }}>
                {value || '-'}
            </div>
        </div>
    );
}

export default function Result({ datas, info }) {
    const isLulus = datas?.status === 1;
    const confettiRef = useConfetti(isLulus);

    return (
        <>
            <Head>
                <title>{info?.judul_web ?? 'Hasil Kelulusan'}</title>
                <meta name="description" content="Pengumuman Kelulusan Siswa" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(145deg, #eff6ff 0%, #f0f4ff 50%, #e8f0fe 100%)', zIndex: 0 }} />
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div style={{ position: 'absolute', top: '-100px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: isLulus ? 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />
            </div>

            {/* Confetti canvas — only shown when lulus */}
            {isLulus && (
                <canvas
                    ref={confettiRef}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 999,
                        pointerEvents: 'none',
                        width: '100vw',
                        height: '100vh',
                    }}
                />
            )}

            {/* Content */}
            <div style={{
                position: 'relative', zIndex: 1, minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px 16px',
                fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
            }}>
                <div style={{ width: '100%', maxWidth: '820px', animation: 'fadeInUp 0.6s ease forwards' }}>

                    {/* Status Banner */}
                    <div style={{
                        borderRadius: '20px 20px 0 0',
                        padding: '24px 32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                        background: isLulus
                            ? 'linear-gradient(135deg, #15803d 0%, #16a34a 60%, #22c55e 100%)'
                            : 'linear-gradient(135deg, #b91c1c 0%, #dc2626 60%, #ef4444 100%)',
                        boxShadow: isLulus
                            ? '0 8px 32px rgba(22,163,74,0.25)'
                            : '0 8px 32px rgba(220,38,38,0.25)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)' }}>{isLulus ? '🎓' : '📋'}</span>
                                <h1 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(0.95rem,2.5vw,1.5rem)', letterSpacing: '-0.01em', margin: 0 }}>
                                    {isLulus ? 'SELAMAT! ANDA DINYATAKAN LULUS!' : 'MOHON MAAF, ANDA DINYATAKAN TIDAK LULUS'}
                                </h1>
                            </div>
                            {!isLulus && <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '4px', fontWeight: 500 }}>TETAP SEMANGAT DAN JANGAN MENYERAH ✨</p>}
                        </div>
                        <img src="/img/main-logo.png" alt="Logo" style={{ height: 'clamp(36px,5vw,64px)', objectFit: 'contain', flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} onError={e => e.target.style.display = 'none'} />
                    </div>

                    {/* Main card */}
                    <div style={{
                        background: 'white',
                        border: '1px solid rgba(59,130,246,0.12)', borderTop: 'none',
                        borderRadius: '0 0 20px 20px',
                        padding: '32px',
                        boxShadow: '0 20px 60px rgba(37,99,235,0.1)',
                    }}>
                        {/* Info notice — above student data */}
                        <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.7, margin: '0 0 20px 0', background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px' }}>
                            ℹ️ Berdasarkan Kriteria Kelulusan dan Rapat Pleno Kelulusan kelas 12 TP 2025/2026 hari Senin, Tanggal 4 Mei 2026
                        </p>

                        {/* Student info row */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '28px' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <div style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>NISN</div>
                                <div style={{ fontFamily: 'monospace', color: '#2563eb', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px', background: '#eff6ff', display: 'inline-block', padding: '3px 10px', borderRadius: '6px' }}>
                                    {datas?.nisn ?? '-'}
                                </div>
                                <div style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.9rem)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                                    {datas?.name ?? '-'}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1d4ed8', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>
                                        Kelas {datas?.kelas ?? '-'}
                                    </span>
                                    <span style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0', color: '#475569', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 500 }}>
                                        {info?.nama_sekolah ?? '-'}
                                    </span>
                                </div>
                            </div>

                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #bfdbfe, transparent)', marginBottom: '24px' }} />

                        {/* Info grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                            <InfoCard label="Tanggal Lahir" value={datas?.tgl_lahir} icon="📅" />
                            <InfoCard label="Kelas" value={`${datas?.kelas ?? '-'} / ${datas?.jurusan ?? '-'}`} icon="📚" />
                            <InfoCard label="Nama Orang Tua" value={datas?.nama_ortu} icon="👨‍👩‍👧" />
                        </div>

                        {/* Congratulatory message — only shown when lulus */}
                        {isLulus && (
                            <div style={{
                                marginTop: '20px',
                                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                border: '1.5px solid #86efac',
                                borderRadius: '14px',
                                padding: '20px 24px',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '28px', marginBottom: '10px' }}>🎉🎓🎊</div>
                                <p style={{ color: '#15803d', fontWeight: 700, fontSize: '15px', margin: '0 0 8px 0', lineHeight: 1.6 }}>
                                    Selamat atas kelulusannya
                                </p>
                                <p style={{ color: '#166534', fontWeight: 500, fontSize: '13px', margin: '0 0 10px 0', lineHeight: 1.8 }}>
                                    Tetap Bersyukur dan Terus Berprestasi serta Menjaga Marwah Nama Baik Almamater Sekolah
                                </p>
                                <p style={{ color: '#16a34a', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                                    Terima kasih 🙏
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes rotateSlow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
            `}</style>
        </>
    );
}

export async function getServerSideProps(context) {
    const { req } = context;
    const { headers } = req;
    try {
        const [student, infoRes] = await Promise.all([
            axios.get(ENV.base + '/api/student', { credentials: 'include', headers: { cookie: headers.cookie } }),
            axios.get(ENV.base + '/api/info'),
        ]);
        return { props: { datas: student.data.data, info: infoRes.data.data } };
    } catch {
        return { redirect: { destination: '/', permanent: false } };
    }
}

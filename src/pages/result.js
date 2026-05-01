import Head from 'next/head'
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ENV } from "@/utility/const";
import QRCode from "react-qr-code";

// Pure-canvas confetti – no extra package needed
function useConfetti(active) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const COLORS = ['#2563eb','#60a5fa','#34d399','#fbbf24','#f472b6','#a78bfa','#fb923c','#38bdf8'];
        const pieces = Array.from({ length: 160 }, () => ({
            x:   Math.random() * canvas.width,
            y:   Math.random() * canvas.height - canvas.height,
            w:   6 + Math.random() * 8,
            h:   10 + Math.random() * 8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot:  Math.random() * 360,
            rotV: (Math.random() - 0.5) * 6,
            vx:  (Math.random() - 0.5) * 3,
            vy:  3 + Math.random() * 4,
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
                p.x   += p.vx;
                p.y   += p.vy;
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
            canvas.width  = window.innerWidth;
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
    const [isLoading, setLoading] = useState(false);
    const isLulus = datas?.status === 1;
    const confettiRef = useConfetti(isLulus);

    async function handlerSKL() {
        setLoading(true);
        try {
            const response = await axios.get('/api/student/skl', { withCredentials: true, responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `skl-${datas.nisn}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

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
                            {isLulus && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ background: 'white', border: '2px solid #e2e8f0', padding: '10px', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', width: '104px', height: '104px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <QRCode size={256} style={{ height: 'auto', width: '100%' }} value={String(datas?.nisn ?? '')} viewBox="0 0 256 256" />
                                    </div>
                                    <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>QR Verifikasi</span>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #bfdbfe, transparent)', marginBottom: '24px' }} />

                        {/* Info grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                            <InfoCard label="Tanggal Lahir"    value={datas?.tgl_lahir}  icon="📅" />
                            <InfoCard label="Kelas / Jurusan"  value={`${datas?.kelas ?? '-'} / ${datas?.jurusan ?? '-'}`} icon="📚" />
                            <InfoCard label="Nama Orang Tua"  value={datas?.nama_ortu} icon="👨‍👩‍👧" />
                        </div>

                        {/* SKL download — lulus only */}
                        {isLulus && (
                            <div style={{
                                background: '#eff6ff', border: '1.5px solid #bfdbfe',
                                borderRadius: '14px', padding: '20px 24px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                flexWrap: 'wrap', gap: '14px', marginBottom: '20px',
                            }}>
                                <div>
                                    <div style={{ color: '#1e293b', fontWeight: 700, fontSize: '15px', marginBottom: '3px' }}>📄 Surat Keterangan Lulus (SKL)</div>
                                    <div style={{ color: '#64748b', fontSize: '13px' }}>Unduh SKL atau datang langsung ke sekolah</div>
                                </div>
                                <button
                                    id="download-skl-btn"
                                    onClick={handlerSKL}
                                    disabled={isLoading}
                                    style={{
                                        background: isLoading ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                                        color: 'white', border: 'none', borderRadius: '10px',
                                        padding: '11px 22px', fontWeight: 700, fontSize: '14px',
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        transition: 'all 0.2s ease', fontFamily: 'inherit',
                                        boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.4)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.3)'; }}
                                >
                                    {isLoading
                                        ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ animation: 'rotateSlow 0.8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Mengunduh...</>
                                        : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download SKL</>
                                    }
                                </button>
                            </div>
                        )}

                        <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.7, margin: 0 }}>
                            ℹ️ Status kelulusan ditetapkan setelah Sekolah melakukan verifikasi data akademik. Silakan membaca peraturan tentang kelulusan siswa.
                        </p>
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

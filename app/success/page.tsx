'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { newHireFormConfig } from '@/lib/form-config';

// Confetti particle class
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const startConfetti = useCallback(() => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 5000);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#2563EB', '#3B82F6', '#10B981', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6'];
    const particles: Particle[] = [];

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.rotation += particle.rotationSpeed;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size / 2);
        ctx.restore();
      });

      // Remove particles that have fallen off screen
      const activeParticles = particles.filter((p) => p.y < canvas.height + 50);

      if (activeParticles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  return { isActive, startConfetti };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const [isDownloading, setIsDownloading] = useState(false);
  const { isActive: showConfetti, startConfetti } = useConfetti();

  // Start confetti on mount
  useEffect(() => {
    startConfetti();
  }, [startConfetti]);

  const handleDownloadPDF = async () => {
    if (!submissionId) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}/pdf`);

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'submission.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Confetti Canvas */}
      {showConfetti && (
        <canvas id="confetti-canvas" className="confetti-canvas" />
      )}

      {/* Floating decorative shapes */}
      <div className="floating-shape floating-shape-1" />
      <div className="floating-shape floating-shape-2" />

      <div className="form-card max-w-md w-full animate-fade-in-up">
        <div className="p-10 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center relative">
              <svg
                className="w-10 h-10 text-[var(--color-sage)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[var(--color-sage)]/20 animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-semibold text-[var(--color-charcoal)] mb-3">
            Submission Complete!
          </h1>

          {/* Message */}
          <p className="text-[var(--color-warm-gray)] leading-relaxed mb-6">
            {newHireFormConfig.successMessage}
          </p>

          {/* Submission ID */}
          {submissionId && (
            <div className="bg-[var(--color-parchment)] rounded-lg px-4 py-3 mb-6 inline-block">
              <p className="text-xs text-[var(--color-warm-gray)] mb-1">Confirmation Number</p>
              <p className="font-mono text-sm font-medium text-[var(--color-charcoal)]">{submissionId}</p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[var(--color-parchment)]" />
            <svg className="w-5 h-5 text-[var(--color-terracotta)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 h-px bg-[var(--color-parchment)]" />
          </div>

          {/* Next Steps */}
          <div className="bg-[var(--color-cream)] rounded-xl p-5 mb-8 text-left">
            <h3 className="font-medium text-[var(--color-charcoal)] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-warm-gray)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-terracotta)] mt-0.5">1.</span>
                Our HR team will review your submission
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-terracotta)] mt-0.5">2.</span>
                You&apos;ll receive a confirmation email shortly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-terracotta)] mt-0.5">3.</span>
                We&apos;ll reach out if we need any additional information
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* PDF Download Button */}
            {submissionId && (
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="btn btn-secondary w-full"
              >
                {isDownloading ? (
                  <>
                    <span className="spinner" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'currentColor' }} />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF Copy
                  </>
                )}
              </button>
            )}

            {/* Submit Another */}
            <Link href="/" className="btn btn-primary w-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Another Response
            </Link>
          </div>

          {/* Replay Confetti Button */}
          <button
            onClick={startConfetti}
            className="mt-6 text-sm text-[var(--color-warm-gray-light)] hover:text-[var(--color-terracotta)] transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Celebrate again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: 'var(--color-terracotta)' }} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

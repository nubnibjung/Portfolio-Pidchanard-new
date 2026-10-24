import { useEffect, useRef, useState } from 'react';

// Magnetic email pill: it springs toward the cursor on hover and copies the address on click.
export default function CopyEmail({ email }) {
  const ref = useRef(null);
  const innerRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return undefined;

    // Damped spring toward the target offset, so it overshoots a little and wobbles back.
    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;
    let running = false;

    const tick = () => {
      for (const axis of ['x', 'y']) {
        vel[axis] += (target[axis] - pos[axis]) * 0.12;
        vel[axis] *= 0.78;
        pos[axis] += vel[axis];
      }
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (innerRef.current) innerRef.current.style.transform = `translate3d(${pos.x * 0.35}px, ${pos.y * 0.35}px, 0)`;
      const settled = Math.abs(target.x - pos.x) < 0.05 && Math.abs(target.y - pos.y) < 0.05
        && Math.abs(vel.x) < 0.05 && Math.abs(vel.y) < 0.05;
      if (settled) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      target.x = (event.clientX - (rect.left + rect.width / 2)) * 0.25;
      target.y = (event.clientY - (rect.top + rect.height / 2)) * 0.4;
      start();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      start();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): fall back to a hidden textarea.
      const area = document.createElement('textarea');
      area.value = email;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
  };

  return (
    <div className="copy-email">
      <span className={`copy-email-toast ${copied ? 'is-visible' : ''}`} role="status" aria-live="polite">
        {copied ? 'copied to clipboard ✓' : ''}
      </span>
      <button
        type="button"
        ref={ref}
        className={`contact-email ${copied ? 'is-copied' : ''}`}
        onClick={copy}
        data-cursor-label={copied ? 'Copied' : 'Copy'}
        aria-label={`Copy email address ${email}`}
      >
        <span ref={innerRef}>{email}</span>
        <span className="contact-email-btn" aria-hidden="true">{copied ? '✓' : '→'}</span>
      </button>
    </div>
  );
}

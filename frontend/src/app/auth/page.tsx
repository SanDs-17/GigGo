'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

type AuthFormData = z.infer<typeof schema>;

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(schema)
  });

  const mutation = useMutation({
    mutationFn: async (data: AuthFormData) => {
      if (mode === 'signup') {
        return await authService.register({ email: data.email, name: data.name, password: data.password });
      } else {
        return await authService.login({ email: data.email, password: data.password });
      }
    },
    onSuccess: (res) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.accessToken || res.access_token);
      }
      dispatch(setAuth(res.user));
      toast.success(`Welcome${mode === 'signup' ? '' : ' back'}, ${res.user.name.split(' ')[0]}!`);
      router.push(res.user.role === 'provider' ? '/studio' : '/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || 'Something went wrong');
    }
  });

  const onSubmit = (data: AuthFormData) => {
    if (mode === 'signup' && !data.name) {
      toast.error('Name is required for sign up');
      return;
    }
    mutation.mutate(data);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 64px)' }}>
      {/* Left panel */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--bg) 100%)', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '4rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <Music2 size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>EventHub</span>
        </Link>
        <blockquote style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: '1.5rem', fontStyle: 'italic' }}>
          &ldquo;The night people remember is the one that was booked right.&rdquo;
        </blockquote>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
          India&apos;s premium entertainment marketplace
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '3rem' }}>
          {[{ n: '400+', l: 'Events booked' }, { n: '50+', l: 'Verified providers' }, { n: '₹2Cr+', l: 'Paid out' }].map(s => (
            <div key={s.n} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{s.n}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: 'var(--surface)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            {mode === 'signin' ? 'Sign in to manage your bookings and payments.' : 'Join India\'s premium entertainment marketplace.'}
          </p>

          {/* Toggle */}
          <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: '0.625rem', padding: '0.25rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            {(['signin', 'signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '0.4rem', border: 'none', background: mode === m ? 'var(--primary)' : 'transparent', color: mode === m ? '#fff' : 'var(--text-3)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {m === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Full name</label>
                <input className="input" type="text" placeholder="Your name" {...register('name')} />
                {errors.name && <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name.message}</p>}
              </div>
            )}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Email</label>
              <input className="input" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email.message}</p>}
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  {...register('password')} style={{ paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={mutation.isPending} className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.75rem' }}>
              {mutation.isPending ? 'Please wait...' : <>{mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '1.5rem' }}>
            By continuing you agree to EventHub&apos;s{' '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Terms</span> and{' '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>

          {mode === 'signin' && (
            <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
              <p style={{ color: 'var(--text-3)', marginBottom: '0.5rem', fontWeight: 600 }}>Demo credentials:</p>
              <p style={{ color: 'var(--text-2)' }}>Customer: rhea@example.com / password123</p>
              <p style={{ color: 'var(--text-2)' }}>Provider: midnight@echo.com / password123</p>
            </div>
          )}
        </div>
      </div>

      <style>{`@media(max-width:768px){ [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } [style*="padding: 3rem; display: flex; flex-direction: column; justify-content: center"] { display: none !important; } }`}</style>
    </div>
  );
}

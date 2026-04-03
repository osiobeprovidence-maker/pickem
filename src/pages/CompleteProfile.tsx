import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, User as UserIcon, AtSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, loading, needsProfileCompletion, completeProfile, setPassword } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (!loading && user && !needsProfileCompletion) {
      navigate('/dashboard');
    }
  }, [loading, user, needsProfileCompletion, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (user?.needs_password_setup) {
        if (!password || password.length < 8) {
          throw new Error('Set a password with at least 8 characters.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await setPassword(password);
      }

      await completeProfile({ name, username });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Could not complete your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-4 py-12">
      <div className="mx-auto w-full max-w-lg rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 shadow-sm md:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-apple-gray-50">
            <CheckCircle2 className="h-8 w-8 text-apple-gray-500" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-apple-gray-500">Complete your profile</h1>
          <p className="mt-3 text-sm font-bold leading-relaxed text-apple-gray-300">
            Choose your unique username and finish your password setup before entering the logistics platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label className="ml-6 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-6 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Username</label>
            <div className="relative">
              <AtSign className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="pickem_handle"
                required
                className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium lowercase text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
              />
            </div>
            <p className="ml-6 text-xs font-bold text-apple-gray-300">Use 3-20 letters, numbers, or underscores.</p>
          </div>

          {user.needs_password_setup && (
            <>
              <div className="space-y-2">
                <label className="ml-6 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPasswordValue(event.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-6 text-xs font-bold uppercase tracking-widest text-apple-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-200" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="w-full rounded-full border-none bg-apple-gray-50 py-5 pl-16 pr-8 font-medium text-apple-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-apple-gray-500"
                  />
                </div>
              </div>
            </>
          )}

          {error && <p className="ml-6 text-sm font-bold text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-full bg-apple-gray-500 py-5 text-lg font-bold text-white shadow-lg shadow-apple-gray-500/10 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? 'Saving profile...' : 'Finish Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}

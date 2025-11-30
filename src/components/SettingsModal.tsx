"use client";
import { useState } from 'react';

type Props = {
  initialName?: string | null;
};

export default function SettingsModal({ initialName }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName ?? '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate() {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update failed');
      setMessage('Profile updated');
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const ok = window.confirm(
      'This will permanently delete your account and all calendars/entries. Type YES to confirm.'
    );
    if (!ok) return;
    // optional second prompt
    const confirmText = window.prompt('Please type YES to confirm deletion');
    if (confirmText !== 'YES') return;

    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Delete failed');
      // Redirect to landing (session will be invalid after deletion anyway)
      window.location.href = '/';
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm"
      >
        Settings
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Account Settings</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            {message && (
              <div className="mb-3 text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Your name"
            />
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>

            <hr className="my-6" />

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 mb-3">
                Danger Zone: Deleting your account is irreversible. All calendars and entries will be removed.
              </p>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
              >
                {loading ? 'Processing…' : 'Delete Account'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from 'react';

type Props = { id: string };

export default function DeleteCalendarButton({ id }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/calendars/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as any)?.error || 'Delete failed');
      window.location.reload();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete calendar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm sm:text-base"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-2">Delete Calendar</h3>
            <p className="text-sm text-gray-700 mb-4">
              This action is permanent. All entries associated with this calendar will be deleted.
            </p>
            {error && (
              <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

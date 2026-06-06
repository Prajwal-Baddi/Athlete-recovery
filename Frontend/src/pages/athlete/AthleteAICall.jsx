import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { startRecoveryCall } from '../../services/aiCallService';

export default function AthleteAICall() {
  const [phoneNumber, setPhoneNumber] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const handleCall = async () => {
    try {
      setLoading(true);
      setMessage('');

      await startRecoveryCall(
        phoneNumber
      );

      setMessage(
        '📞 AI Recovery Coach is calling you now.'
      );
    } catch (error) {
      console.error(error);

      setMessage(
        'Failed to start call.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-white p-8">

        <div className="max-w-2xl mx-auto">

          <h1 className="text-4xl font-bold mb-3">
            Recovery AI Call
          </h1>

          <p className="text-slate-400 mb-8">
            Receive a phone call from Apex
            Recovery AI and discuss injuries,
            pain, fatigue, recovery and
            training concerns.
          </p>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">

            <label className="block mb-3 text-sm text-slate-400">
              Phone Number
            </label>

            <input
              type="text"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(
                  e.target.value
                )
              }
              placeholder="+919876543210"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none"
            />

            <button
              onClick={handleCall}
              disabled={loading}
              className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl p-4"
            >
              {loading
                ? 'Starting Call...'
                : 'Call Recovery AI'}
            </button>

            {message && (
              <div className="mt-5 bg-slate-800 rounded-xl p-4">
                {message}
              </div>
            )}
          </div>

          <div className="mt-8 bg-slate-900 rounded-xl p-6">
            <h2 className="font-semibold mb-3">
              Topics you can discuss
            </h2>

            <ul className="space-y-2 text-slate-300">
              <li>• Injury concerns</li>
              <li>• Recovery progress</li>
              <li>• Pain management</li>
              <li>• Sleep quality</li>
              <li>• Wellness monitoring</li>
              <li>• Training readiness</li>
            </ul>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
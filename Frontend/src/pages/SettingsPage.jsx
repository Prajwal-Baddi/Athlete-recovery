import { useState }          from 'react'
import { motion }            from 'framer-motion'
import Card, { CardHeader } from '@/components/ui/Card'
import Avatar               from '@/components/ui/Avatar'
import Toggle               from '@/components/ui/Toggle'
import { useAppContext }     from '@/context/AppContext'

const PROFILE_ROWS = [
  ['Full Name',   'Alex Thompson'          ],
  ['Team',        'Manchester City FC'      ],
  ['Position',    'Center Midfielder'       ],
  ['Jersey No.',  '#8'                      ],
  ['DOB',         'March 15, 1998'          ],
]

const ROLE_OPTIONS = [
  { id: 'athlete', icon: '⚡', label: 'Athlete',         color: '#00d4aa' },
  { id: 'coach',   icon: '🏆', label: 'Coach',           color: '#4a9eff' },
  { id: 'physio',  icon: '🏥', label: 'Physiotherapist', color: '#a78bfa' },
]

export default function SettingsPage() {
  const { role, switchRole } = useAppContext()

  const [notifs, setNotifs] = useState({
    email:   true,
    push:    true,
    weekly:  false,
    ai:      true,
  })
  const [privacy, setPrivacy] = useState({
    coach:   true,
    physio:  true,
    anon:    false,
  })

  const toggleNotif   = (k) => setNotifs(n  => ({ ...n,  [k]: !n[k]  }))
  const togglePrivacy = (k) => setPrivacy(p => ({ ...p,  [k]: !p[k]  }))

  return (
    <div className="p-4 max-w-[700px] space-y-4">
      <h1 className="font-display text-lg font-bold text-white">Settings &amp; Profile</h1>

      {/* ── Profile ── */}
      <Card delay={0}>
        <CardHeader
          title="Profile"
          right={<button className="btn-secondary text-[11px] py-1">Edit Profile</button>}
        />
        <div className="flex items-center gap-4 mb-4">
          <Avatar initials="AT" size={52} color="#00d4aa" />
          <div>
            <div className="text-[15px] font-semibold text-white">Alex Thompson</div>
            <div className="text-[12px] text-apex-txt2">alex.thompson@team.com</div>
          </div>
        </div>
        <div className="divide-y divide-apex-border">
          {PROFILE_ROWS.map(([l, v]) => (
            <div key={l} className="flex justify-between items-center py-2.5">
              <span className="text-[12px] text-apex-txt2">{l}</span>
              <span className="text-[12px] font-medium text-apex-txt">{v}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Dashboard Role ── */}
      <Card delay={0.07}>
        <CardHeader title="Dashboard Role" sub="Switch between role views (demo)" />
        <div className="grid grid-cols-3 gap-3">
          {ROLE_OPTIONS.map(r => (
            <button
              key={r.id}
              onClick={() => switchRole(r.id)}
              className="flex flex-col items-center gap-2 py-4 rounded-apex border
                transition-all duration-150 cursor-pointer"
              style={{
                background:  role === r.id ? `${r.color}12` : 'rgba(255,255,255,0.025)',
                borderColor: role === r.id ? `${r.color}40` : 'rgba(255,255,255,0.07)',
                color:       role === r.id ? r.color         : '#8892a4',
              }}
            >
              <span className="text-2xl">{r.icon}</span>
              <span className="text-[12px] font-medium">{r.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* ── Notifications ── */}
      <Card delay={0.12}>
        <CardHeader title="Notifications" />
        <div className="divide-y divide-apex-border">
          {[
            ['email',  'Email alerts',        '#00d4aa'],
            ['push',   'Push notifications',  '#4a9eff'],
            ['weekly', 'Weekly digest',        '#a78bfa'],
            ['ai',     'AI insight alerts',   '#ffb347'],
          ].map(([k, label, color]) => (
            <div key={k} className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-apex-txt">{label}</span>
              <Toggle on={notifs[k]} onChange={() => toggleNotif(k)} color={color} />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Privacy ── */}
      <Card delay={0.17}>
        <CardHeader title="Data &amp; Privacy" />
        <div className="divide-y divide-apex-border">
          {[
            ['coach',  'Share data with coach',    '#00d4aa'],
            ['physio', 'Share data with physio',   '#00d4aa'],
            ['anon',   'Anonymize in reports',     '#ffb347'],
          ].map(([k, label, color]) => (
            <div key={k} className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-apex-txt">{label}</span>
              <Toggle on={privacy[k]} onChange={() => togglePrivacy(k)} color={color} />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Danger zone ── */}
      <Card delay={0.22}>
        <CardHeader title="Account" />
        <div className="flex gap-3">
          <button className="btn-ghost text-[12px]">Export My Data</button>
          <button
            className="text-[12px] px-3 py-2 rounded-apex border border-apex-red/30
              text-apex-red bg-apex-red/10 hover:bg-apex-red/20 transition-colors duration-150"
          >
            Delete Account
          </button>
        </div>
      </Card>

    </div>
  )
}

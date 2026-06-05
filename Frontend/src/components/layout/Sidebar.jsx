import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'

const NAV = {
  athlete: [
    {
      section: 'Overview',
      items: [
        { path: '/athlete/dashboard', icon: '⚡', label: 'Dashboard' },
      ],
    },
    {
      section: 'Recovery',
      items: [
        { path: '/athlete/injuries', icon: '🦴', label: 'Injuries' },
        { path: '/athlete/wellness', icon: '💚', label: 'Wellness' },
        { path: '/athlete/timeline', icon: '📈', label: 'Recovery Timeline' },
      ],
    },
    {
      section: 'AI',
      items: [
        { path: '/athlete/ai', icon: '🤖', label: 'AI Suggestions' },
        { path: '/athlete/reports', icon: '📄', label: 'Reports' },
      ],
    },
    {
      section: 'Account',
      items: [
        { path: '/athlete/settings', icon: '⚙️', label: 'Settings' },
      ],
    },
  ],

  coach: [
    {
      section: 'Overview',
      items: [
        { path: '/coach/dashboard', icon: '🏆', label: 'Team Dashboard' },
      ],
    },
    {
      section: 'Athletes',
      items: [
        { path: '/coach/roster', icon: '👥', label: 'Athletes' },
        { path: '/coach/injuries', icon: '🦴', label: 'Injury Watch' },
      ],
    },
    {
      section: 'Analytics',
      items: [
        { path: '/coach/load', icon: '📈', label: 'Training Load' },
        { path: '/coach/analytics', icon: '📊', label: 'Analytics' },
        { path: '/coach/reports', icon: '📄', label: 'Reports' },
      ],
    },
    {
      section: 'AI',
      items: [
        { path: '/coach/ai', icon: '🤖', label: 'AI Insights' },
      ],
    },
  ],

  physio: [
    {
      section: 'Overview',
      items: [
        { path: '/physio/dashboard', icon: '🏥', label: 'Recovery Panel' },
      ],
    },
    {
      section: 'Recovery',
      items: [
        { path: '/physio/injuries', icon: '🦴', label: 'Injuries' },
        { path: '/physio/rehab', icon: '🏃', label: 'Rehab Programs' },
        { path: '/physio/rtp', icon: '✅', label: 'Return To Play' },
      ],
    },
    {
      section: 'Monitoring',
      items: [
        { path: '/physio/pain', icon: '📉', label: 'Pain Tracking' },
        { path: '/physio/reports', icon: '📄', label: 'Reports' },
      ],
    },
    {
      section: 'AI',
      items: [
        { path: '/physio/ai', icon: '🤖', label: 'AI Recovery Insights' },
      ],
    },
  ],
}

const ROLE_META = {
  athlete: { label: 'Athlete', color: '#00d4aa' },
  coach: { label: 'Head Coach', color: '#4a9eff' },
  physio: { label: 'Physiotherapist', color: '#a78bfa' },
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, role } = useAppContext()
  const { user } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const navSections = NAV[role] || NAV.athlete
  const meta = ROLE_META[role]

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 70 : 260 }}
      transition={{ duration: 0.25 }}
      className="bg-apex-bg2 border-r border-apex-border flex flex-col h-full overflow-hidden"
    >
      {/* Logo */}
      <div
        className="p-4 border-b border-apex-border flex items-center gap-3 cursor-pointer"
        onClick={toggleSidebar}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `${meta.color}20`,
            border: `1px solid ${meta.color}40`,
          }}
        >
          ⚡
        </div>

        {!sidebarCollapsed && (
          <div>
            <div className="font-bold text-white">APEX</div>
            <div className="text-xs text-apex-txt3">Recovery OS</div>
          </div>
        )}
      </div>

      {/* User */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-apex-border">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{
                background: `${meta.color}20`,
                color: meta.color,
              }}
            >
              {initials}
            </div>

            <div>
              <div className="text-sm text-white font-semibold">
                {user?.name}
              </div>

              <div className="text-xs text-apex-txt3">
                {user?.email}
              </div>
            </div>
          </div>

          <div
            className="mt-3 px-2 py-1 rounded-lg text-xs inline-block"
            style={{
              background: `${meta.color}15`,
              color: meta.color,
            }}
          >
            {meta.label}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {navSections.map((section) => (
          <div key={section.section} className="mb-4">
            {!sidebarCollapsed && (
              <div className="text-[10px] uppercase tracking-widest text-apex-txt3 mb-2 px-2">
                {section.section}
              </div>
            )}

            {section.items.map((item) => {
              const active = location.pathname.startsWith(item.path)

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1"
                  style={{
                    background: active
                      ? `${meta.color}15`
                      : 'transparent',
                    color: active ? meta.color : '',
                  }}
                >
                  <span>{item.icon}</span>

                  {!sidebarCollapsed && (
                    <span className="text-sm">
                      {item.label}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <button
        onClick={toggleSidebar}
        className="m-3 p-2 rounded-lg border border-apex-border"
      >
        {sidebarCollapsed ? '▶' : '◀'}
      </button>
    </motion.aside>
  )
}
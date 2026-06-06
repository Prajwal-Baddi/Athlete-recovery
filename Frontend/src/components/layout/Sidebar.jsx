import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  athlete: { label: 'Athlete', color: '#10b981' },
  coach: { label: 'Head Coach', color: '#3b82f6' },
  physio: { label: 'Physiotherapist', color: '#8b5cf6' },
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
      className="bg-apex-bg flex-shrink-0 border-r border-apex-border flex flex-col h-full overflow-hidden"
    >
      {/* Logo */}
      <div
        className="p-4 border-b border-apex-border flex items-center gap-3 cursor-pointer"
        onClick={toggleSidebar}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-black font-bold text-lg">
          $
        </div>

        {!sidebarCollapsed && (
          <div>
            <div className="font-bold text-white text-lg tracking-tight">SalesOps</div>
          </div>
        )}
      </div>

      {/* User */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-apex-border">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: `${meta.color}20`,
                color: meta.color,
              }}
            >
              {initials}
            </div>

            <div>
              <div className="text-sm text-white font-medium">
                {user?.name}
              </div>
              <div className="text-xs text-apex-txt3">
                {user?.email}
              </div>
            </div>
          </div>

          <div
            className="px-2 py-0.5 rounded text-[10px] inline-block font-semibold uppercase tracking-wider border"
            style={{
              borderColor: `${meta.color}40`,
              color: meta.color,
            }}
          >
            {meta.label}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 mt-2">
        {navSections.map((section) => (
          <div key={section.section} className="mb-6">
            {!sidebarCollapsed && (
              <div className="text-[11px] font-semibold tracking-wider text-apex-txt3 mb-2 px-3">
                {section.section}
              </div>
            )}

            {section.items.map((item) => {
              const active = location.pathname.startsWith(item.path)

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={active ? 'nav-item-active w-full' : 'nav-item w-full text-apex-txt2'}
                >
                  <span className="opacity-80">{item.icon}</span>

                  {!sidebarCollapsed && (
                    <span className="text-sm tracking-wide">
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
        className="m-3 p-2 rounded-lg border border-apex-border text-apex-txt2 hover:text-white transition-colors"
      >
        {sidebarCollapsed ? '▶' : '◀'}
      </button>
    </motion.aside>
  )
}
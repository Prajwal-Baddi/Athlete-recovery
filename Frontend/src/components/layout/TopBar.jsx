import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAppContext } from '@/context/AppContext'
import NotifPanel from './NotifPanel'

const ROLE_META = {
  athlete: { label: 'Athlete', color: '#10b981' },
  coach: { label: 'Head Coach', color: '#3b82f6' },
  physio: { label: 'Physiotherapist', color: '#8b5cf6' },
}

export default function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { role, toggleNotif, notifOpen } = useAppContext()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const meta = ROLE_META[role] || ROLE_META.athlete
  const today = format(new Date(), 'EEE, MMM d')
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  // Extract a basic page title from URL
  const pageTitle = location.pathname.split('/').pop()
  const formattedTitle = pageTitle ? pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1) : 'Overview'

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="relative h-[65px] flex items-center gap-4 px-6 border-b border-apex-border bg-apex-bg">
      {/* Page title */}
      <h1 className="text-white font-bold text-xl tracking-tight flex-1">
        {formattedTitle}
      </h1>

      {/* Date */}
      <div className="hidden md:flex items-center text-apex-txt3 text-sm font-medium mr-4">
        <span className="mr-2">📅</span> {today}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center bg-apex-bg2 border border-apex-border rounded-full px-4 py-2 w-64 focus-within:border-apex-txt3 transition-colors">
        <span className="text-apex-txt3 mr-2">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-white placeholder:text-apex-txt3 w-full"
        />
      </div>

      {/* Notifications */}
      <button
        onClick={toggleNotif}
        className="relative w-10 h-10 rounded-full border border-apex-border bg-transparent hover:bg-apex-bg3 transition flex items-center justify-center text-apex-txt2 hover:text-white"
      >
        🔔
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Profile */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-3 px-1 py-1 rounded-full hover:bg-apex-bg3 transition"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
              background: `${meta.color}`,
              color: '#000',
            }}
          >
            {initials}
          </div>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className="absolute right-0 top-14 w-56 bg-apex-bg2 border border-apex-border rounded-apex shadow-apex-card overflow-hidden z-50">
            <div className="p-4 border-b border-apex-border">
              <div className="font-semibold text-white">
                {user?.name}
              </div>
              <div className="text-sm text-apex-txt3">
                {user?.email}
              </div>
            </div>
            <button
              className="w-full px-4 py-3 text-left text-apex-txt hover:bg-apex-bg3 transition text-sm font-medium"
              onClick={() => {
                navigate('/settings')
                setMenuOpen(false)
              }}
            >
              ⚙️ Settings
            </button>
            <button
              className="w-full px-4 py-3 text-left text-red-400 hover:bg-apex-bg3 transition text-sm font-medium"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      <NotifPanel />
    </header>
  )
}
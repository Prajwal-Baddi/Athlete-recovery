import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAppContext } from '@/context/AppContext'
import NotifPanel from './NotifPanel'

const ROLE_META = {
  athlete: {
    label: 'Athlete',
    color: '#00d4aa',
  },
  coach: {
    label: 'Head Coach',
    color: '#4a9eff',
  },
  physio: {
    label: 'Physiotherapist',
    color: '#a78bfa',
  },
}

export default function TopBar() {
  const navigate = useNavigate()

  const { user, logout } = useAuth()

  const {
    role,
    toggleNotif,
    notifOpen,
  } = useAppContext()

  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef(null)

  const meta =
    ROLE_META[role] ||
    ROLE_META.athlete

  const today = format(
    new Date(),
    'EEE, MMM d'
  )

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
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
    <header className="relative h-[60px] flex items-center gap-4 px-5 border-b border-apex-border bg-apex-bg2">

      {/* Page title */}
      <h1 className="text-white font-semibold text-lg flex-1">
        Dashboard
      </h1>

      {/* Date */}
      <div className="hidden md:block text-apex-txt2 text-sm">
        {today}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center bg-apex-bg3 border border-apex-border rounded-xl px-3 py-2">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search athletes, reports..."
          className="bg-transparent outline-none text-sm text-white placeholder:text-apex-txt3"
        />
      </div>

      {/* Notifications */}
      <button
        onClick={toggleNotif}
        className="relative w-10 h-10 rounded-xl border border-apex-border bg-apex-bg3 hover:bg-apex-bg4 transition"
      >
        🔔

        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Profile */}
      <div
        ref={menuRef}
        className="relative"
      >
        <button
          onClick={() =>
            setMenuOpen((v) => !v)
          }
          className="flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-apex-bg3 transition"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
            style={{
              background: `${meta.color}20`,
              color: meta.color,
            }}
          >
            {initials}
          </div>

          <div className="hidden md:block text-left">
            <div className="text-sm text-white font-semibold">
              {user?.name || 'User'}
            </div>

            <div className="text-xs text-apex-txt3">
              {meta.label}
            </div>
          </div>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className="absolute right-0 top-14 w-56 bg-apex-bg2 border border-apex-border rounded-xl shadow-xl overflow-hidden z-50">

            <div className="p-4 border-b border-apex-border">
              <div className="font-semibold text-white">
                {user?.name}
              </div>

              <div className="text-sm text-apex-txt3">
                {user?.email}
              </div>
            </div>

            <button
              className="w-full px-4 py-3 text-left text-apex-txt hover:bg-apex-bg3 transition"
              onClick={() => {
                navigate('/settings')
                setMenuOpen(false)
              }}
            >
              ⚙️ Settings
            </button>

            <button
              className="w-full px-4 py-3 text-left text-red-400 hover:bg-apex-bg3 transition"
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
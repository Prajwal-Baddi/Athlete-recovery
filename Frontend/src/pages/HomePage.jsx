import { useAppContext }  from '@/context/AppContext'
import AthleteDashboard  from './AthleteDashboard'
import CoachDashboard    from './CoachDashboard'
import PhysioDashboard   from './PhysioDashboard'

export default function HomePage() {
  const { role } = useAppContext()

  if (role === 'coach')  return <CoachDashboard />
  if (role === 'physio') return <PhysioDashboard />
  return <AthleteDashboard />
}

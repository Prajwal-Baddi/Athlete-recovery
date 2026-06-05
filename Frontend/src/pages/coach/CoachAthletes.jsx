import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAthletes } from '../../services/athleteService';

export default function CoachAthletes() {
  const { data: athletes = [], isLoading } =
    useAthletes();

  const [search, setSearch] =
    useState('');

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-white">
          Loading athletes...
        </div>
      </DashboardLayout>
    );
  }

  const filtered = athletes.filter(
    athlete =>
      athlete.athleteName
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 text-white">

        <h1 className="text-3xl font-bold mb-6">
          Athletes
        </h1>

        <input
          type="text"
          placeholder="Search athlete..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            max-w-md
            mb-6
            p-3
            rounded-lg
            bg-slate-800
            border
            border-slate-700
          "
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 text-left">
                  Name
                </th>
                <th className="p-3 text-left">
                  Sport
                </th>
                <th className="p-3 text-left">
                  Position
                </th>
                <th className="p-3 text-left">
                  Readiness
                </th>
                <th className="p-3 text-left">
                  Injuries
                </th>
                <th className="p-3 text-left">
                  Physio
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((athlete) => (
                <tr
                  key={athlete._id}
                  className="
                    border-b
                    border-slate-800
                  "
                >
                  <td className="p-3">
                    {athlete.athleteName}
                  </td>

                  <td className="p-3">
                    {athlete.sport}
                  </td>

                  <td className="p-3">
                    {athlete.position}
                  </td>

                  <td className="p-3">
                    {
                      athlete.readinessScore
                        ?.value
                    }
                    %
                  </td>

                  <td className="p-3">
                    {
                      athlete.activeInjuryCount
                    }
                  </td>

                  <td className="p-3">
                    {
                      athlete.assignedPhysio
                        ?.name
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
}
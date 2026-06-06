import { useState } from 'react';
import { motion } from 'framer-motion';
import Tag from '@/components/ui/Tag';
import { useReports } from '@/services/reportService';

export default function ReportsPage() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState(null);

  // Fetch real data from backend
  const { data: reports = [], isLoading, isError } = useReports();

  const filteredReports = reports.filter((report) => {
    const matchesFilter = filter === 'All' || report.type === filter;
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownload = (report) => {
    setDownloading(report.id || report._id);
    
    setTimeout(() => {
      // Generate CSV from the report object
      const headers = ['Report ID', 'Title', 'Type', 'Date Generated', 'Size'];
      const row = [
        report.id || report._id,
        `"${report.title}"`,
        report.type,
        report.date || new Date(report.createdAt).toLocaleDateString(),
        report.size || 'Unknown'
      ];
      
      const csvString = [headers.join(','), row.join(',')].join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloading(null);
    }, 800);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-lg font-bold text-white">Generated Reports</h1>
          <p className="text-[12px] text-apex-txt2 mt-0.5">Access and download historical data reports</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-apex-bg3 border border-apex-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-apex-green w-64"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-apex-bg3 border border-apex-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Team">Team Reports</option>
            <option value="Athlete">Athlete Reports</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-apex-bg2 border border-apex-border rounded-apex-lg overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-apex-bg3 border-b border-apex-border text-xs text-apex-txt3 uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Report Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Date Generated</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-apex-txt3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin text-apex-green">⟳</span>
                    Loading reports from database...
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-red-400">
                  Failed to load reports. Ensure the API server is running.
                </td>
              </tr>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((report, i) => (
                <motion.tr
                  key={report.id || report._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-apex-border hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-4 font-medium text-white flex items-center gap-2">
                    📄 {report.title}
                  </td>
                  <td className="px-4 py-4">
                    <Tag color={report.type === 'Team' ? '#4a9eff' : '#00d4aa'}>{report.type || 'Standard'}</Tag>
                  </td>
                  <td className="px-4 py-4 text-apex-txt2">{report.date || new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-apex-txt2">{report.size || '1.1 MB'}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleDownload(report)}
                      disabled={downloading === (report.id || report._id)}
                      className="btn-secondary text-[11px] py-1.5 px-4 disabled:opacity-50"
                      style={{ color: '#00d4aa', background: 'rgba(0, 212, 170, 0.12)', borderColor: 'rgba(0, 212, 170, 0.3)' }}
                    >
                      {downloading === (report.id || report._id) ? 'Downloading...' : 'Download CSV'}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-apex-txt3">
                  No reports found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

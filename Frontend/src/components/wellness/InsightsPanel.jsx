export default function InsightsPanel() {
  const insights = [
    {
      title: 'Excellent Recovery',
      text:
        'HRV above your weekly average.',
    },
    {
      title: 'Sleep Quality',
      text:
        'You are consistently exceeding 7 hours.',
    },
    {
      title: 'Injury Risk',
      text:
        'Low risk based on current metrics.',
    },
  ];

  return (
    <div className="card">
      <h3 className="text-xl mb-5">
        AI Recovery Insights
      </h3>

      <div className="space-y-4">
        {insights.map((item) => (
          <div
            key={item.title}
            className="bg-apex-bg3 rounded-xl p-4"
          >
            <h4 className="font-semibold">
              {item.title}
            </h4>

            <p className="text-apex-txt2 text-sm mt-1">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
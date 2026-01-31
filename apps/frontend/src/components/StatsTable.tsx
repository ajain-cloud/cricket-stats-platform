type StatsTableProps<T extends object> = {
  title: string;
  stats: Record<string, T>;
}

const STAT_LABELS: Record<string, string> = {
  matches: 'Matches',
  runs: 'Runs',
  average: 'Avg',
  strikeRate: 'SR',
  wickets: 'Wkts',
  economy: 'Econ',
};

const FORMAT_ORDER = ['test', 'odi', 't20', 't20i', 'ipl'];

export default function StatsTable<T extends object>({ title, stats }: StatsTableProps<T>) {
  const formats = Object.keys(stats)
    .filter((f) => stats[f] && Object.keys(stats[f]).length > 0)
    .sort((a, b) =>
      FORMAT_ORDER.indexOf(a) - FORMAT_ORDER.indexOf(b)
    );

  if (formats.length === 0) return null;

  const statKeys = Array.from(
    new Set(
      formats.flatMap((format) =>
        stats[format] ? Object.keys(stats[format]) : []
      )
    )
  );

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      <table className="w-full border border-gray-300 border-collapse bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-3 text-left">Format</th>
            {statKeys.map((key) => (
              <th key={key} className="border border-gray-300 p-3 text-center">{STAT_LABELS[key] ?? key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formats.map((format) => (
            <tr key={format} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3 uppercase font-medium">{format}</td>
              {statKeys.map((statKey) => (
                <td key={statKey} className="border border-gray-300 p-3 text-center">
                  {(stats[format] as Record<string, number | undefined>)?.[statKey] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

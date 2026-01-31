type StatsTableProps<T extends object> = {
  title: string;
  stats: Record<string, T>;
}

export default function StatsTable<T extends object>({ title, stats }: StatsTableProps<T>) {
  const formats = Object.keys(stats);

  if (formats.length === 0) return null;

  const statKeys = Array.from(
    new Set(
      formats.flatMap((format) =>
        stats[format] ? Object.keys(stats[format]) : []
      )
    )
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      <table className="w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Format</th>
            {statKeys.map((key) => (
              <th key={key} className="p-2 border capitalize">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formats.map((format) => (
            <tr key={format}>
              <td className="p-2 border uppercase">{format}</td>
              {statKeys.map((statKey) => (
                <td key={statKey} className="p-2 border text-center">
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

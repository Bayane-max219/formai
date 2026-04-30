export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i + 1 < current
                  ? "bg-blue-600 text-white"
                  : i + 1 === current
                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1 < current ? "✓" : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  i + 1 < current ? "bg-blue-600" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Vos informations</span>
        <span>Le défunt</span>
        <span>Récapitulatif</span>
      </div>
    </div>
  );
}

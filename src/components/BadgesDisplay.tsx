// src/components/BadgesDisplay.tsx

import type { Badge } from "@/utils/badges";

interface BadgesDisplayProps {
  badges: Badge[];
  compact?: boolean;
}

export default function BadgesDisplay({
  badges,
  compact = false,
}: BadgesDisplayProps) {
  if (badges.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Aucun badge pour le moment. Continuez à contribuer !
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            key={badge.id}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
            title={badge.description}
          >
            <span>{badge.icon}</span>
            <span>{badge.name}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`rounded-lg p-4 text-center border-2 ${badge.color} border-current`}
        >
          <div className="text-4xl mb-2">{badge.icon}</div>
          <div className="font-bold text-lg">{badge.name}</div>
          <div className="text-sm opacity-75 mt-1">{badge.description}</div>
        </div>
      ))}
    </div>
  );
}

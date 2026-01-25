export class FormatBattingStatsDto {
  matches?: number;
  runs?: number;
  average?: number;
  strikeRate?: number;
}

export class FormatBowlingStatsDto {
  wickets?: number;
  economy?: number;
  average?: number;
}

export class PlayerStatsResponseDto {
  batting: {
    test?: FormatBattingStatsDto;
    odi?: FormatBattingStatsDto;
    t20?: FormatBattingStatsDto;
  };
  bowling: {
    test?: FormatBowlingStatsDto;
    odi?: FormatBowlingStatsDto;
    t20?: FormatBowlingStatsDto;
  };
}

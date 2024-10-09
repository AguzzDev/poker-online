import { MissionCategoryEnum } from "src/models";

export function claimRewards(type: string): number {
  const dailyRange = { min: 10000, max: 50000 };
  const weeklyRange = { min: 50000, max: 200000 };
  const monthlyRange = { min: 200000, max: 500000 };
  const masterRange = { min: 500000, max: 5000000 };

  const selectRange = {
    [MissionCategoryEnum.daily]: dailyRange,
    [MissionCategoryEnum.weekly]: weeklyRange,
    [MissionCategoryEnum.monthly]: monthlyRange,
    [MissionCategoryEnum.master]: masterRange,
  };

  const range = selectRange[type];

  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

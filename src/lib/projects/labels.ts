const STATUS_MESSAGE_KEYS: Record<string, string> = {
  idea: 'idea',
  in_progress: 'inProgress',
  mvp_poc: 'mvpPoc',
  completed: 'completed',
  deployed: 'deployed',
  archived: 'archived',
  coming_soon: 'comingSoon',
};

const PROJECT_TYPE_MESSAGE_KEYS: Record<string, string> = {
  personal: 'personal',
  university: 'university',
  team: 'team',
  work: 'work',
  hackathon: 'hackathon',
};

type Translator = (key: string) => string;

/** Falls back to the raw DB value for any status not in the map, since the enum lives in the database, not here. */
export function projectStatusLabel(t: Translator, status: string): string {
  const key = STATUS_MESSAGE_KEYS[status];
  return key ? t(key) : status;
}

export function projectTypeLabel(t: Translator, projectType: string): string {
  const key = PROJECT_TYPE_MESSAGE_KEYS[projectType];
  return key ? t(key) : projectType;
}

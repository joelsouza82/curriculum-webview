import { Personal } from '../types/personal';

const DRAFT_KEY = 'resume_import_draft';

export type ResumeImportDraft = {
  mode: 'create' | 'update';
  id_personal?: string;
  fields: Partial<Personal>;
};

export function saveResumeImportDraft(draft: ResumeImportDraft): void {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getResumeImportDraft(): ResumeImportDraft | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = sessionStorage.getItem(DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ResumeImportDraft;
  } catch {
    sessionStorage.removeItem(DRAFT_KEY);
    return null;
  }
}

export function clearResumeImportDraft(): void {
  sessionStorage.removeItem(DRAFT_KEY);
}

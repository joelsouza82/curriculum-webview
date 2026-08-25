'use client';

import React, { useState } from 'react';
import { getAuthHeader } from '../services/authService';
import { getPersonals } from '../services/personalService';
import { saveResumeImportDraft } from '../services/resumeImportDraft';
import { Personal } from '../types/personal';
import { Icon, documentArrowUpPath, alertPath } from '../shared/icons';
import { detectResumeFileKind, RESUME_FILE_ACCEPT } from '../shared/resumeFileType';
import styles from './ResumeUpload.module.css';

const INVALID_FILE_MESSAGE = 'Selecione um arquivo em PDF ou Word (.doc/.docx).';

interface ResumeUploadProps {
  loginId: string;
  onImported: () => void;
}

export default function ResumeUpload({ loginId, onImported }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setError(null);
    if (selected && !detectResumeFileKind(selected)) {
      setFile(null);
      setError(INVALID_FILE_MESSAGE);
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(INVALID_FILE_MESSAGE);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/resume-parse', {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || 'Não foi possível processar o arquivo.');
      }

      const { fields } = await response.json();

      const personals = await getPersonals();
      const existing = Array.isArray(personals)
        ? personals.find((item: Personal) => String(item.login_id) === loginId)
        : undefined;

      const existingFields: Partial<Personal> = existing
        ? Object.fromEntries(
            Object.entries(existing).filter(([key]) => key !== 'id_personal' && key !== 'login_id'),
          )
        : {};

      saveResumeImportDraft({
        mode: existing ? 'update' : 'create',
        id_personal: existing?.id_personal,
        // Preenche com os dados já cadastrados e só sobrescreve os campos
        // que o PDF conseguiu extrair, para não apagar informações existentes.
        fields: { ...existingFields, ...fields },
      });

      onImported();
    } catch (err) {
      console.error('Falha ao importar currículo:', err);
      setError(err instanceof Error ? err.message : 'Não foi possível importar o currículo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <Icon className={styles.icon}>{documentArrowUpPath}</Icon>
      <h2 className={styles.title}>Importar currículo</h2>
      <p className={styles.description}>
        Envie seu currículo em PDF ou Word (.doc/.docx) para preencher seus dados pessoais
        automaticamente.
      </p>

      <label className={styles.fileLabel} htmlFor="resume-file">
        {file ? file.name : 'Escolher arquivo (PDF ou Word)'}
      </label>
      <input
        id="resume-file"
        type="file"
        accept={RESUME_FILE_ACCEPT}
        onChange={handleFileChange}
        className={styles.fileInput}
        disabled={loading}
      />

      {error && (
        <p className={styles.error}>
          <Icon className={styles.errorIcon}>{alertPath}</Icon>
          {error}
        </p>
      )}

      <button type="submit" className={styles.button} disabled={loading || !file}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}

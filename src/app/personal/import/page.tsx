'use client';

import React, { useState, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createPersonal, updatePersonal } from '../../../services/personalService';
import {
  getResumeImportDraft,
  clearResumeImportDraft,
  ResumeImportDraft,
} from '../../../services/resumeImportDraft';
import styles from './page.module.css';
import { Personal } from '../../../types/personal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import Header from '../../../components/Header';
import { PERSONAL_FIELD_LABELS } from '../../../shared/constants';
import { maskPersonalField, validatePersonalField } from '../../../shared/validation';
import { getFieldInputProps } from '../../../shared/fieldInput';
import { Icon, inboxPath, PERSONAL_FIELD_ICONS } from '../../../shared/icons';

const BLANK_FORM: Omit<Personal, 'id_personal' | 'login_id'> = {
  name: '',
  rg: '',
  document: '',
  address: '',
  neighborhood: '',
  city: '',
  state: '',
  cep: '',
  phone: '',
  email: '',
  website: '',
  linkedin: '',
  github: '',
  birthdate: '',
};

function ImportForm() {
  const session = useRequireAuth();
  const searchParams = useSearchParams();
  const { goToPersonal, goToHome, logout } = useAppNavigation();
  const loginId = searchParams.get('loginId') || (session ? String(session.id) : '');

  const [draft] = useState<ResumeImportDraft | null>(() => getResumeImportDraft());
  const [formData, setFormData] = useState<Omit<Personal, 'id_personal' | 'login_id'>>(() =>
    draft ? { ...BLANK_FORM, ...draft.fields } : BLANK_FORM,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maskedValue = maskPersonalField(name, value);
    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: validatePersonalField(name, maskedValue) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session || !draft) {
      return;
    }

    const newFieldErrors: Record<string, string> = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
      newFieldErrors[field] = validatePersonalField(field, formData[field] as string);
    });
    setFieldErrors(newFieldErrors);
    if (Object.values(newFieldErrors).some(Boolean)) {
      setError('Corrija os campos destacados antes de continuar.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (draft.mode === 'update' && draft.id_personal) {
        await updatePersonal(draft.id_personal, { ...formData, login_id: loginId });
        setSuccess('Dados atualizados com sucesso!');
      } else {
        await createPersonal({ ...formData, login_id: loginId });
        setSuccess('Registro criado com sucesso!');
      }
      clearResumeImportDraft();
      setTimeout(() => goToPersonal(loginId), 2000);
    } catch (err) {
      console.error('Falha ao salvar dados importados:', err);
      setError('Não foi possível salvar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  const fields = Object.keys(formData) as Array<keyof typeof formData>;
  const isCreate = draft?.mode !== 'update';

  return (
    <>
      <Header
        title="Revisar Currículo Importado"
        onBack={() => goToHome(loginId)}
        onLogout={logout}
        email={session.email}
      />
      <main className={styles.main}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        {!draft && !success && (
          <div className={styles.stateWrap}>
            <Icon className={styles.stateIcon}>{inboxPath}</Icon>
            <p className={styles.stateText}>
              Nenhum currículo importado. Volte à Home e envie um PDF.
            </p>
            <button type="button" className={styles.stateLink} onClick={() => goToHome(loginId)}>
              Voltar à Home
            </button>
          </div>
        )}

        {draft && !success && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {fields.map((field) => (
              <div className={styles.formGroup} key={field}>
                <label htmlFor={field} className={styles.label}>
                  {PERSONAL_FIELD_LABELS[field]}
                </label>
                <div className={styles.inputWrapper}>
                  {field !== 'birthdate' && (
                    <Icon className={styles.inputIcon}>{PERSONAL_FIELD_ICONS[field]}</Icon>
                  )}
                  <input
                    {...getFieldInputProps(field)}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className={`${styles.input} ${field === 'birthdate' ? styles.inputNoIcon : ''} ${fieldErrors[field] ? styles.inputInvalid : ''}`}
                    disabled={loading}
                    required={isCreate}
                    aria-invalid={!!fieldErrors[field]}
                    aria-describedby={fieldErrors[field] ? `${field}-error` : undefined}
                  />
                </div>
                {fieldErrors[field] && (
                  <span id={`${field}-error`} className={styles.fieldError}>
                    {fieldErrors[field]}
                  </span>
                )}
              </div>
            ))}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        )}
      </main>
    </>
  );
}

export default function ImportPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ImportForm />
    </Suspense>
  );
}

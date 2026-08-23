const PDF_MIME = 'application/pdf';
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const DOC_MIME = 'application/msword';

export type ResumeFileKind = 'pdf' | 'docx' | 'doc';

export const RESUME_FILE_ACCEPT = [
  '.pdf',
  '.doc',
  '.docx',
  PDF_MIME,
  DOC_MIME,
  DOCX_MIME,
].join(',');

/**
 * Detecta o tipo de um currículo a partir do MIME type e, quando o navegador
 * ou sistema operacional não informa um MIME confiável (comum para .doc),
 * cai para a extensão do nome do arquivo.
 */
export function detectResumeFileKind(file: { type: string; name: string }): ResumeFileKind | null {
  const name = file.name.toLowerCase();

  if (file.type === PDF_MIME || name.endsWith('.pdf')) {
    return 'pdf';
  }
  if (file.type === DOCX_MIME || name.endsWith('.docx')) {
    return 'docx';
  }
  if (file.type === DOC_MIME || name.endsWith('.doc')) {
    return 'doc';
  }
  return null;
}

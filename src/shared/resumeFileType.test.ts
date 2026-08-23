import { detectResumeFileKind } from './resumeFileType';

describe('detectResumeFileKind', () => {
  it('detects PDF by MIME type', () => {
    expect(detectResumeFileKind({ type: 'application/pdf', name: 'curriculo' })).toBe('pdf');
  });

  it('detects DOCX by MIME type', () => {
    expect(
      detectResumeFileKind({
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        name: 'curriculo',
      }),
    ).toBe('docx');
  });

  it('detects DOC by MIME type', () => {
    expect(detectResumeFileKind({ type: 'application/msword', name: 'curriculo' })).toBe('doc');
  });

  it('falls back to file extension when the MIME type is generic (common for .doc)', () => {
    expect(detectResumeFileKind({ type: 'application/octet-stream', name: 'curriculo.doc' })).toBe(
      'doc',
    );
    expect(detectResumeFileKind({ type: '', name: 'curriculo.docx' })).toBe('docx');
    expect(detectResumeFileKind({ type: '', name: 'curriculo.pdf' })).toBe('pdf');
  });

  it('is case-insensitive on the extension', () => {
    expect(detectResumeFileKind({ type: '', name: 'CURRICULO.PDF' })).toBe('pdf');
  });

  it('returns null for unsupported files', () => {
    expect(detectResumeFileKind({ type: 'image/png', name: 'foto.png' })).toBeNull();
  });
});

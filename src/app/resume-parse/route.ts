import { extractText } from 'unpdf';
import WordExtractor from 'word-extractor';
import { extractPersonalFieldsFromText } from '../../shared/resumeExtraction';
import { detectResumeFileKind } from '../../shared/resumeFileType';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function extractRawText(file: File, buffer: Buffer): Promise<string> {
  const kind = detectResumeFileKind(file);
  if (kind === 'pdf') {
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
    return text;
  }
  const extractor = new WordExtractor();
  const document = await extractor.extract(buffer);
  return document.getBody();
}

export async function POST(request: Request) {
  if (!request.headers.get('authorization')) {
    return Response.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  let file: FormDataEntryValue | null;
  try {
    const formData = await request.formData();
    file = formData.get('file');
  } catch {
    return Response.json({ error: 'Envie o arquivo como multipart/form-data.' }, { status: 400 });
  }

  if (!(file instanceof File) || !detectResumeFileKind(file)) {
    return Response.json({ error: 'Envie um arquivo em PDF ou Word (.doc/.docx).' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: 'O arquivo excede o limite de 5MB.' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractRawText(file, buffer);
    const fields = extractPersonalFieldsFromText(text);
    return Response.json({ fields });
  } catch (error) {
    console.error('Falha ao processar currículo:', error);
    return Response.json({ error: 'Não foi possível ler o arquivo enviado.' }, { status: 422 });
  }
}

import { Personal } from '../types/personal';

const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_REGEX = /\(?\d{2}\)?\s?\d{4,5}-?\d{4}/;
const URL_REGEX = /https?:\/\/[^\s,;)]+/gi;
const NAME_LINE_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ.'-]+)+$/;

function findFirstUrlContaining(urls: string[], domain: string): string | undefined {
  return urls.find((url) => url.toLowerCase().includes(domain));
}

function extractName(text: string): string | undefined {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.find(
    (line) => line.length >= 4 && line.length <= 60 && NAME_LINE_REGEX.test(line),
  );
}

/**
 * Extrai campos de Personal a partir do texto bruto de um currículo (PDF ou
 * Word). Currículos têm formato livre, então só campos com um padrão textual
 * bem definido (e-mail, telefone, URLs) são extraídos com confiança; os
 * demais ficam em branco para o usuário preencher na revisão.
 */
export function extractPersonalFieldsFromText(text: string): Partial<Personal> {
  const fields: Partial<Personal> = {};

  const email = text.match(EMAIL_REGEX)?.[0];
  if (email) {
    fields.email = email;
  }

  const phone = text.match(PHONE_REGEX)?.[0];
  if (phone) {
    fields.phone = phone;
  }

  const urls = text.match(URL_REGEX) ?? [];
  const linkedin = findFirstUrlContaining(urls, 'linkedin.com/');
  if (linkedin) {
    fields.linkedin = linkedin;
  }
  const github = findFirstUrlContaining(urls, 'github.com/');
  if (github) {
    fields.github = github;
  }
  const website = urls.find((url) => url !== linkedin && url !== github);
  if (website) {
    fields.website = website;
  }

  const name = extractName(text);
  if (name) {
    fields.name = name;
  }

  return fields;
}

import { extractPersonalFieldsFromText } from './resumeExtraction';

describe('extractPersonalFieldsFromText', () => {
  it('extracts email, phone, linkedin, github, website and name from free-form résumé text', () => {
    const text = `Joel de Almeida Souza
Desenvolvedor de Software

Contato: joel.souza@example.com | (11) 98765-4321
https://www.linkedin.com/in/joelsouza
https://github.com/joelsouza
Portfólio: https://joelsouza.dev

Experiência
...`;

    expect(extractPersonalFieldsFromText(text)).toEqual({
      name: 'Joel de Almeida Souza',
      email: 'joel.souza@example.com',
      phone: '(11) 98765-4321',
      linkedin: 'https://www.linkedin.com/in/joelsouza',
      github: 'https://github.com/joelsouza',
      website: 'https://joelsouza.dev',
    });
  });

  it('returns an empty object when the text has no recognizable fields', () => {
    const text = '1234 !!! ### sem dados uteis aqui 5678';

    expect(extractPersonalFieldsFromText(text)).toEqual({});
  });

  it('omits fields that are not present instead of setting empty strings', () => {
    const text = 'Maria Oliveira\ncontato: maria@example.com';

    const fields = extractPersonalFieldsFromText(text);

    expect(fields.email).toBe('maria@example.com');
    expect(fields.phone).toBeUndefined();
    expect(fields.linkedin).toBeUndefined();
    expect(fields.github).toBeUndefined();
    expect(fields.website).toBeUndefined();
  });
});

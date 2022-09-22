import {prettifyCodeByLanguage} from './prettifyCodeByLanguage';

describe('language=json', () => {
  const language = 'json';

  it('strips all unnecessary spacing from JSON strings', () => {
    const content = `{
  "hello": "friend",

  "there": "is extra",

  "social-distancing": "in here"
  }`;

    expect(prettifyCodeByLanguage({language, content})).toMatchInlineSnapshot(`
    "{
      \\"hello\\": \\"friend\\",
      \\"there\\": \\"is extra\\",
      \\"social-distancing\\": \\"in here\\"
    }"
  `);
  });

  it('does not crash on malformed JSON strings', () => {
    const content = `{
  "oopsy": "daisy",
  }`;

    expect(() => prettifyCodeByLanguage({content, language})).not.toThrow();
  });

  it('trims content', () => {
    const content = `

    var foo = "bar";

    `;

    expect(
      prettifyCodeByLanguage({content, language: 'javascript'}),
    ).toStrictEqual('var foo = "bar";');
  });
});

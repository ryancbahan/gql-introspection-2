import {CodeblockContentProps} from '../../interfaces';

export function prettifyCodeByLanguage({
  content,
  language,
}: Partial<CodeblockContentProps>): string {
  const trimmed = String(content).trim();
  if (language === 'json') {
    try {
      return JSON.stringify(JSON.parse(trimmed.replace(/\n/g, '')), null, 2);
    } catch {
      // noop
    }
  }
  return trimmed;
}

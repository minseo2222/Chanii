const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;

export const hasBatchim = (word) => {
  const value = String(word || '').trim();
  if (!value) return false;

  const last = value.charCodeAt(value.length - 1);
  if (last < HANGUL_BASE || last > HANGUL_END) {
    return false;
  }

  return (last - HANGUL_BASE) % 28 !== 0;
};

export const withJosa = (word, consonantForm, vowelForm) => {
  const value = String(word || '').trim();
  if (!value) return '';
  return `${value}${hasBatchim(value) ? consonantForm : vowelForm}`;
};

export const topic = (word) => withJosa(word, '은', '는');
export const subject = (word) => withJosa(word, '이', '가');
export const object = (word) => withJosa(word, '을', '를');
export const andParticle = (word) => withJosa(word, '과', '와');
export const direction = (word) => withJosa(word, '으로', '로');

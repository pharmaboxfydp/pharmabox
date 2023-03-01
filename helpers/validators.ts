/**
 * Common Form Validators
 */

export const phoneNumberValidator = [
  { fixed: '(' },
  {
    length: 3,
    regexp: /^[0-9]{1,3}$/,
    placeholder: 'xxx'
  },
  { fixed: ')' },
  { fixed: ' ' },
  {
    length: 3,
    regexp: /^[0-9]{1,3}$/,
    placeholder: 'xxx'
  },
  { fixed: '-' },
  {
    length: 4,
    regexp: /^[0-9]{1,4}$/,
    placeholder: 'xxxx'
  }
]

export const emailValidator = [
  {
    regexp: /^[\w\-_.]+$/,
    placeholder: 'janedoe'
  },
  { fixed: '@' },
  {
    regexp: /^[\w]+$/,
    placeholder: 'email'
  },
  { fixed: '.' },
  {
    regexp: /^[\w]+$/,
    placeholder: 'com'
  }
]

export function stripNonDigets(str: string): string {
  return str.replace(/\D/g, '')
}

export function formatPhoneNumber(p: string): string {
  const cleaned = ('' + p).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    const intlCode = match[1] ? '+1 ' : ''
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return p
}

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
  const clnd: string = ('' + p).replace(/\D/g, '')
  const m: RegExpMatchArray | null = clnd.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (m) {
    return '(' + m[1] + ') ' + m[2] + '-' + m[3]
  }
  return p
}

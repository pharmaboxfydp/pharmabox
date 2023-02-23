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

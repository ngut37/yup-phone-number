import * as yup from 'yup';
import { PhoneTypes, phones } from './regex';

export const phoneNumber = (
  message: string,
  locale: PhoneTypes[] | PhoneTypes = Object.keys(phones) as PhoneTypes[]
) =>
  yup.string().test('phoneNumber', message, function (value) {
    const trimmedValue = value?.replace(/\s|-|\(|\)/g, '');
    if (trimmedValue) {
      if (Array.isArray(locale)) {
        return locale.some((key) => {
          const phoneRegex = phones[key as PhoneTypes];
          if (key === 'cs-CZ' || key === 'sk-SK') {
            const isNumbersUnique = validateNumberUniqueness(trimmedValue);
            return phoneRegex.test(trimmedValue) && isNumbersUnique;
          }
          return phoneRegex.test(trimmedValue);
        });
      } else {
        if (locale === 'cs-CZ' || locale === 'sk-SK') {
          const isNumbersUnique = validateNumberUniqueness(trimmedValue);
          return phones[locale].test(trimmedValue) && isNumbersUnique;
        }
        return phones[locale].test(trimmedValue);
      }
    }
    return false;
  });

const validateNumberUniqueness = (phoneNumber: string) => {
  // forbid options like +420 111 111 111 etc.
  return (
    [...new Set(phoneNumber.replace(/((\+|00)?42(0|1))/, '').split(''))]
      .length !== 1
  );
};

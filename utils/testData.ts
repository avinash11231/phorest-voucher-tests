export const buyer = {
  firstName: 'Avinash',
  lastName: 'Mathew',
  email: 'avinash.mathew@phorest.com',
};

export const friend = {
  email: 'john.cena@test.com',
  message: 'Happy Birthday! Enjoy your day at the salon.',
};

export const card = {
  number: '4111 1111 1111 1111',
  expiry: '12/26',
  cvc: '999',
};

export const amounts = {
  fixed: '50',
  custom: '75',
  min: '20',
  belowMin: '19',
  aboveMax: '1001',
};

// unique email each run so repeated runs don't clash
export function uniqueEmail(prefix = 'test') {
  return `${prefix}+${Date.now()}@example.com`;
}
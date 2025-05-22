import { getBalanceColor } from './account'

describe('getBalanceColor', () => {
  test('returns green for positive balance', () => {
    expect(getBalanceColor(100)).toBe('green')
    expect(getBalanceColor(0.01)).toBe('green')
  })

  test('returns red for negative balance', () => {
    expect(getBalanceColor(-100)).toBe('red')
    expect(getBalanceColor(-0.01)).toBe('red')
  })

  test('returns grey for zero balance', () => {
    expect(getBalanceColor(0)).toBe('grey')
  })
})

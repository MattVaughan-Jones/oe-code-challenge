export const getBalanceColor = (balance: number): string => {
  if (balance > 0) return 'green'
  if (balance < 0) return 'red'
  return 'grey'
}

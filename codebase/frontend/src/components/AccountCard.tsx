import React from 'react'
import { EnergyAccountWithBalance } from '../types/types'
import { getBalanceColor } from '../util/account'

type AccountCardProps = {
  account: EnergyAccountWithBalance
  onMakePayment: (account: EnergyAccountWithBalance) => void
  onViewCharges: (account: EnergyAccountWithBalance) => void
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onMakePayment,
  onViewCharges,
}) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        maxWidth: '400px',
      }}
    >
      <h3>{account.type}</h3>
      <p>{account.id}</p>
      <p>{account.address}</p>
      <p style={{ color: getBalanceColor(account.balance) }}>
        Balance: ${account.balance.toFixed(2)}
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onMakePayment(account)} style={{ cursor: 'pointer' }}>
          Make a Payment
        </button>
        <button onClick={() => onViewCharges(account)} style={{ cursor: 'pointer' }}>
          View Payments History
        </button>
      </div>
    </div>
  )
}

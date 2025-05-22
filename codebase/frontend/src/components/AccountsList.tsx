import React from 'react'
import { AccountCard } from './AccountCard'
import { EnergyAccountWithBalance } from '../types/types'

type AccountsListProps = {
  accounts: EnergyAccountWithBalance[]
  onMakePayment: (account: EnergyAccountWithBalance) => void
  onViewPaymentHistory: (account: EnergyAccountWithBalance) => void
}

export const AccountsList: React.FC<AccountsListProps> = ({
  accounts,
  onMakePayment,
  onViewPaymentHistory,
}) => {
  return (
    <div>
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onMakePayment={onMakePayment}
          onViewCharges={onViewPaymentHistory}
        />
      ))}
    </div>
  )
}

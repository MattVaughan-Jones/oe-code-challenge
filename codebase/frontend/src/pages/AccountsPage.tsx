import React, { useState, useEffect } from 'react'
import { AccountsList } from '../components/AccountsList'
import { EnergyTypeFilter } from '../components/EnergyTypeFilter'
import { EnergyAccountWithBalance, EnergyType } from '../types/types'
import { Loading } from '../components/Loading'
import { PaymentModal } from '../components/PaymentModal'
import { SuccessfulPaymentModal } from '../components/SuccessfulPaymentModal'
import { PaymentHistoryModal } from '../components/PaymentHistoryModal'
import { SearchInput } from '../components/SearchInput'
import { fetchAccounts } from '../api/client'

const energyTypeOptions = [
  { value: 'ALL', label: 'All Types' },
  { value: 'GAS', label: 'Gas' },
  { value: 'ELECTRICITY', label: 'Electricity' },
]

export const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<EnergyAccountWithBalance[]>([])
  const [filterType, setFilterType] = useState<EnergyType | 'ALL'>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<EnergyAccountWithBalance | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isPaymentSuccessModalOpen, setIsPaymentSuccessModalOpen] = useState(false)
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsWithBalances = await fetchAccounts()
        setAccounts(accountsWithBalances)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const refreshAccounts = async () => {
    try {
      const accountsWithBalances = await fetchAccounts()
      setAccounts(accountsWithBalances)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    }
  }

  const handleMakePayment = (account: EnergyAccountWithBalance) => {
    setSelectedAccount(account)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = async () => {
    setIsPaymentModalOpen(false)
    setIsPaymentSuccessModalOpen(true)
    await refreshAccounts()
  }

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedAccount(null)
  }

  const handleClosePaymentSuccessModal = () => {
    setIsPaymentSuccessModalOpen(false)
  }

  const handleViewPaymentHistory = (account: EnergyAccountWithBalance) => {
    setSelectedAccount(account)
    setIsPaymentHistoryModalOpen(true)
  }

  const filteredAccounts = accounts
    .filter((account) => filterType === 'ALL' || account.type === filterType)
    .filter((account) => account.address.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      {isPaymentModalOpen && selectedAccount && (
        <PaymentModal
          account={selectedAccount}
          onClose={handleCloseModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {isPaymentSuccessModalOpen && (
        <SuccessfulPaymentModal onClose={handleClosePaymentSuccessModal} />
      )}
      {isPaymentHistoryModalOpen && selectedAccount && (
        <PaymentHistoryModal
          account={selectedAccount}
          onClose={() => {
            setIsPaymentHistoryModalOpen(false)
            setSelectedAccount(null)
          }}
        />
      )}

      <SearchInput value={searchQuery} onChange={setSearchQuery} />

      <EnergyTypeFilter
        options={energyTypeOptions}
        value={filterType}
        onChange={(value) => setFilterType(value as EnergyType | 'ALL')}
        label="Energy Type"
      />
      {isLoading ? (
        <Loading />
      ) : (
        <AccountsList
          accounts={filteredAccounts}
          onMakePayment={handleMakePayment}
          onViewPaymentHistory={handleViewPaymentHistory}
        />
      )}
    </div>
  )
}

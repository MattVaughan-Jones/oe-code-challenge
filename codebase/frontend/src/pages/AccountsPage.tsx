import React, { useState, useEffect } from 'react';
import { AccountsList } from '../components/AccountsList';
import { AccountFilter } from '../components/AccountFilter';
import { EnergyAccount, EnergyType } from '../types/types';

// TODO - replace this with API calls later
const mockAccounts: EnergyAccount[] = [
    {
        id: '1',
        address: '123 Main St',
        energyType: 'ELECTRICITY',
        balance: 150.50
    },
    {
        id: '2',
        address: '456 Oak Ave',
        energyType: 'GAS',
        balance: -75.25
    }
];

export const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<EnergyAccount[]>([]);
    const [filterType, setFilterType] = useState<EnergyType | 'ALL'>('ALL');

    useEffect(() => {
        // TODO - replace this with an API call later
        setAccounts(mockAccounts);
    }, []);

    const handleMakePayment = (accountId: string) => {
        console.log('Make payment for account:', accountId);
        // TODO - implement the payment modal later
    };

    const filteredAccounts = filterType === 'ALL' 
        ? accounts 
        : accounts.filter(account => account.energyType === filterType);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
        }}>
            <AccountFilter 
                filterType={filterType} 
                onFilterChange={(type) => setFilterType(type)} 
            />
            <AccountsList 
                accounts={filteredAccounts} 
                onMakePayment={handleMakePayment} 
            />
        </div>
    );
};
import React from 'react';
import { AccountCard } from './AccountCard';
import { EnergyAccount } from '../types/types';

interface AccountsListProps {
    accounts: EnergyAccount[];
    onMakePayment: (accountId: string) => void;
}

export const AccountsList: React.FC<AccountsListProps> = ({ accounts, onMakePayment }) => {
    return (
        <div>
            {accounts.map(account => (
                <AccountCard
                    key={account.id}
                    account={account}
                    onMakePayment={onMakePayment}
                />
            ))}
        </div>
    );
};
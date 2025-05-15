import React from 'react';
import { EnergyAccount } from '../types/types';

type AccountCardProps = {
    account: EnergyAccount;
    onMakePayment: (accountId: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onMakePayment }) => {
    const getBalanceColor = (balance: number): string => {
        if (balance > 0) return 'green';
        if (balance < 0) return 'red';
        return 'grey';
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px',
            maxWidth: '400px'
        }}>
            <h3>{account.address}</h3>
            <p>Energy Type: {account.energyType}</p>
            <p style={{ color: getBalanceColor(account.balance) }}>
                Balance: ${account.balance.toFixed(2)}
            </p>
            <button onClick={() => onMakePayment(account.id)}>
                Make a Payment
            </button>
        </div>
    );
};
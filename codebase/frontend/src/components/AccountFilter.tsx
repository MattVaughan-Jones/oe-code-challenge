import React from 'react';
import { EnergyType } from '../types/types';

interface AccountFilterProps {
    filterType: EnergyType | 'ALL';
    onFilterChange: (type: EnergyType | 'ALL') => void;
}

export const AccountFilter: React.FC<AccountFilterProps> = ({ filterType, onFilterChange }) => {
    return (
        <div>
            <select 
                value={filterType}
                onChange={(e) => onFilterChange(e.target.value as EnergyType | 'ALL')}
            >
                <option value="ALL">All Types</option>
                <option value="GAS">Gas</option>
                <option value="ELECTRICITY">Electricity</option>
            </select>
        </div>
    );
};
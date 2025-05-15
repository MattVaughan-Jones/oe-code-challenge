export type EnergyType = 'GAS' | 'ELECTRICITY';

export type EnergyAccount = {
    id: string;
    address: string;
    energyType: EnergyType;
    balance: number;
}

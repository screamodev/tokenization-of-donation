export interface Campaign {
    id: number;
    title: string;
    description: string;
    goal: number;
    alreadyDonated: number;
    endsAt: number;
    organizer: string;
    claimed: boolean;
    currentUserDonations: number;
    donate: () => any;
    refundDonation: () => any;
    claim: () => any;
}

export interface NftItem {
    name: string;
    image: string;
    description: string;
}

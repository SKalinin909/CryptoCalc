export interface Exchange {
  id: string;
  name: string;
  logoUrl: string;
  adBannerUrl: string;
  affiliateLink: string;
  description: string;
  tierLevel: number;
  isPremium: boolean;
  isActive: boolean;
}

export const defaultExchanges: Exchange[] = [
  {
    id: 'binance',
    name: 'Binance',
    logoUrl: '/images/exchanges/binance.png',
    adBannerUrl: '',
    affiliateLink: 'https://www.binance.com/en/register?ref=YOUR_REF',
    description: "World's largest cryptocurrency exchange by trading volume",
    tierLevel: 1,
    isPremium: true,
    isActive: true,
  },
  {
    id: 'bybit',
    name: 'Bybit',
    logoUrl: '/images/exchanges/bybit.png',
    adBannerUrl: '',
    affiliateLink: 'https://www.bybit.com/register?affiliate_id=YOUR_REF',
    description: 'Leading crypto derivatives exchange',
    tierLevel: 1,
    isPremium: true,
    isActive: true,
  },
  {
    id: 'okx',
    name: 'OKX',
    logoUrl: '/images/exchanges/okx.png',
    adBannerUrl: '',
    affiliateLink: 'https://www.okx.com/join?channelId=YOUR_REF',
    description: 'Global cryptocurrency exchange and Web3 platform',
    tierLevel: 2,
    isPremium: false,
    isActive: true,
  },
];

export interface PlaidResponse {
  accounts: Account[];
  item: Item;
  request_id: string;
}

interface Account {
  account_id: string;
  balances: Balances;
  mask: string;
  name: string;
  official_name: string;
  persistent_account_id: string;
  subtype: string;
  type: string;
}

interface Balances {
  available: number;
  current: number;
  iso_currency_code: string;
  limit: number | null;
  unofficial_currency_code: string | null;
}

interface Item {
  available_products: string[];
  billed_products: string[];
  consent_expiration_time: string | null;
  error: any | null;
  institution_id: string;
  item_id: string;
  products: string[];
  update_type: string;
  webhook: string;
}

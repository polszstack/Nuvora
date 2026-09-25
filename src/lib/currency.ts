// Reference rate checked on 2026-09-25.
export const USD_TO_PHP = 62.478;
export const FREE_SHIPPING_THRESHOLD_USD = 75;
export const SHIPPING_FEE_USD = 8;

export function convertUsdToPhp(amount: number) {
  return amount * USD_TO_PHP;
}

export function convertPhpToUsd(amount: number) {
  return amount / USD_TO_PHP;
}

export function formatPhpCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export function formatAddress(address) {
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`
}

export function formatHash(address) {
  return `${address?.slice(0, 8)}...${address?.slice(-8)}`
}

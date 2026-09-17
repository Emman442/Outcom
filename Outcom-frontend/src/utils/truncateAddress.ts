export function truncateAddress(address: String, startLength = 6, endLength = 4) {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
}

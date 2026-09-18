export function srmToHex(srm: number | null | undefined): string {
  if (srm == null || isNaN(srm)) return '#e0e0e0'; // Default gray if no SRM
  
  // Standard approximation scale for beer SRM to Hex
  const srmTable: { [key: number]: string } = {
    2: '#F8F1AE',
    3: '#F3E578',
    4: '#EBDA53',
    6: '#E4CB28',
    8: '#E5BC13',
    10: '#E1A100',
    13: '#CC8400',
    17: '#B56800',
    20: '#9A4E00',
    24: '#7C3600',
    29: '#5E2200',
    35: '#441400',
    40: '#2C0900',
  };

  // Find the closest SRM key in the table
  const keys = Object.keys(srmTable).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const key of keys) {
    if (srm >= key) closest = key;
  }
  return srmTable[closest] || '#1a0500';
}
export function removeTerminalCodes(s: string) {
  return s.replace(/(\x1b\[\d*m)/g, '');
}

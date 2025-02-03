interface Window {
  ethereum?: EthereumProvider;
}

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<any>;
  on?(eventName: string, callback: (...args: any[]) => void): void;
  removeListener?(eventName: string, callback: (...args: any[]) => void): void;
}

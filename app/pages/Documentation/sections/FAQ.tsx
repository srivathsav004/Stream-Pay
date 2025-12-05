import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  category: string;
  questions: {
    q: string;
    a: string;
  }[];
}

const faqData: FAQItem[] = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is StreamPay?',
        a: 'A pay-per-use Web3 platform for video streaming, AI assistance, and cloud storage with gasless payments.'
      },
      {
        q: 'Do I need crypto experience?',
        a: 'Basic knowledge helps, but our guides walk you through everything.'
      },
      {
        q: 'Is this on mainnet?',
        a: 'Currently on Avalanche Fuji testnet. Mainnet launch coming soon.'
      }
    ]
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'Why do I need to deposit USDC?',
        a: 'Escrow enables instant, gasless payments. Deposit once, use everywhere.'
      },
      {
        q: 'Can I withdraw anytime?',
        a: 'Yes! Withdrawals are instant with no restrictions.'
      },
      {
        q: 'What are gas fees?',
        a: 'StreamPay pays gas fees for you. You only pay service costs in USDC.'
      },
      {
        q: 'How do gasless transactions work?',
        a: 'You sign messages (free), StreamPay submits transactions and pays gas.'
      }
    ]
  },
  {
    category: 'Services',
    questions: [
      {
        q: 'Can I try before buying?',
        a: 'Yes! Stream videos pay-per-second before buying.'
      },
      {
        q: 'What happens if I run out of balance mid-session?',
        a: 'Session pauses. Deposit more to continue.'
      },
      {
        q: 'Are my files private?',
        a: 'Yes. Files are encrypted and only accessible to you.'
      },
      {
        q: 'Can I share files?',
        a: 'Yes, via IPFS links (optional).'
      }
    ]
  },
  {
    category: 'Security',
    questions: [
      {
        q: 'Is StreamPay safe?',
        a: 'Yes. Smart contracts are audited and verified. You control your funds.'
      },
      {
        q: 'Can StreamPay access my funds?',
        a: 'No. Only you can withdraw from escrow.'
      },
      {
        q: 'What if I lose my wallet?',
        a: 'Funds are tied to your wallet. Secure your seed phrase!'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'Which wallets are supported?',
        a: 'MetaMask, Rainbow, Coinbase Wallet, and WalletConnect-compatible wallets.'
      },
      {
        q: 'Which blockchain?',
        a: 'Avalanche (Fuji testnet now, mainnet soon).'
      },
      {
        q: 'Is the code open source?',
        a: 'Yes! View on GitHub.'
      },
      {
        q: 'Can I integrate StreamPay into my app?',
        a: 'Yes! Contact us for API access.'
      }
    ]
  },
  {
    category: 'Support',
    questions: [
      {
        q: 'I need help!',
        a: 'Join our Discord or email support@streampay.app'
      },
      {
        q: 'Found a bug?',
        a: 'Report on GitHub Issues'
      },
      {
        q: 'Feature request?',
        a: 'Submit on GitHub Discussions'
      }
    ]
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
          <HelpCircle className="w-10 h-10 text-blue-400" />
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Find answers to common questions about StreamPay.
        </p>
      </div>

      <div className="space-y-6">
        {faqData.map((category) => (
          <section key={category.category} className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">{category.category}</h2>
            <div className="space-y-3">
              {category.questions.map((item, index) => {
                const key = `${category.category}-${index}`;
                const isOpen = openItems[key];
                return (
                  <div
                    key={index}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(category.category, index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition-colors"
                    >
                      <span className="font-semibold text-white pr-4">{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-zinc-400 text-sm">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

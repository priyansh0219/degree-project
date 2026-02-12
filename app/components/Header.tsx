import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className='border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Degree Verification
              </h1>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Blockchain-based credential system
              </p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

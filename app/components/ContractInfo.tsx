export function ContractInfo() {
  return (
    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
      <div className='flex items-start gap-3'>
        <svg
          className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <div className='flex-1'>
          <h3 className='text-sm font-medium text-blue-900 dark:text-blue-200 mb-1'>
            Contract Setup Required
          </h3>
          <p className='text-sm text-blue-700 dark:text-blue-300'>
            Deploy the DegreeVerification contract and update the contract
            address in the code. The contract ABI is available in{" "}
            <code className='bg-blue-100 dark:bg-blue-900 px-1 rounded'>
              misc/sol/contract.sol
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

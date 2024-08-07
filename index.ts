import { boolCV } from '@stacks/transactions';
import { SimulationBuilder } from './stxer';

SimulationBuilder.new()
  // or omit this to use tip height
  .useBlockHeight(130818)
  .addEvalCode(
    'SP000000000000000000002Q6VF78.pox',
    '(list block-height burn-block-height)'
  )
  // use this as the sender of the following steps
  .withSender('SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60')
  .addSTXTransfer({
    recipient: 'SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER',
    amount: 10000,
  })
  .withSender('SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER')
  .addContractDeploy({
    contract_name: 'test',
    // or read the source code from local file system
    source_code: [
      '(define-data-var enabled bool false)',
      '(define-read-only (get-enabled) (var-get enabled))',
      '(define-public (set-enabled (v bool)) (begin (var-set enabled v) (ok v)))',
    ].join('\n'),
    // or omit this to use 0 fee, it's possible for simulation
    fee: 100,
  })
  .addContractCall({
    contract_id: 'SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER.test',
    function_name: 'set-enabled',
    function_args: [boolCV(true)],
  })
  .addVarRead('SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER.test', 'enabled')
  .addContractCall({
    contract_id: 'SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER.test',
    function_name: 'set-enabled',
    function_args: [boolCV(false)],
  })
  // call readonly function
  .addEvalCode(
    'SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER.test',
    '(get-enabled)'
  )
  // run arbitrary code
  .addEvalCode(
    'SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER.test',
    `(stx-get-balance 'SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER)`
  )
  .run()
  .catch(console.error);

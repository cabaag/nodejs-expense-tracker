import { program } from 'commander';
import { Tracker } from './transactions';

const tracker = new Tracker();

program
  .command('add')
  .description('Add a new transaction')
  .option('-d, --description <char>', 'description of the transaction')
  .option('-a, --amount <number>', 'amount of the transaction')
  .action((options) => {
    tracker.add(options.description, options.amount);
  })

program
  .command('list')
  .description('List all transactions')
  .action(() => {
    tracker.list();
  })

  program.command('summary')
  .option('-m, --month <number>')
  .description('Show summary of transactions')
  .action((options) => {
    tracker.summary(options.month ?? -1)
  });

program.command('delete')
  .description('Delete a transaction')
  .option('--id <number>')
  .action((options) => tracker.delete(Number(options.id)));

async function main() {
  await tracker.loadTransactions();
  program.parse(process.argv);
}

main();
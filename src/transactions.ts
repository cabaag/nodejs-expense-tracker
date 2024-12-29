import { log } from 'console';
import { FileStorage } from './file-storage';
import { Transaction } from './types/common';

const store = new FileStorage<Transaction>('transactions.json');

export class Tracker {
  transactions: Transaction[] = [];
  constructor() { }

  async loadTransactions() {
    await store.init();
    this.transactions.push(...store.items.map((item) => ({
      ...item,
      id: Number(item.id),
      createdAt: new Date(item.createdAt),
      amount: Number(item.amount),
    })));
  }

  add(description: string, amount: number) {
    if (!description) {
      console.error('Please provide a description and an amount');
      return;
    }
    if (amount < 0) {
      console.error('Amount should be a positive number');
      return;
    }
    const newTransaction: Transaction = {
      id: this.transactions.length + 1,
      description,
      amount,
      createdAt: new Date(),
    }
    this.transactions.push(newTransaction);
    store.saveRecords(this.transactions);
    console.log('Expense added successfully (ID: %f)', newTransaction.id);
  }

  list() {
    if (this.transactions.length === 0) {
      console.log('No transactions found');
      return;
    }
    console.log('ID\tDescription\tAmount\tDate');
    this.transactions.forEach((transaction) => {
      console.log(`${transaction.id}\t${transaction.description}\t\t$${transaction.amount}\t${transaction.createdAt}`);
    });
  }

  summary(month = -1) {
    if (month === -1) {
      const total = this.transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
      console.log('Total expenses: $%f', total);
    } else {
      const total = this.transactions
        .filter((transaction) => transaction.createdAt.getMonth() === month - 1)
        .reduce((acc, transaction) => acc + transaction.amount, 0);
      console.log('Total expenses for month %f: $%f', month, total);
    }
  }

  delete(id: number) {
    const transactionIndex = this.transactions.findIndex((transaction) => transaction.id === id);
    if (transactionIndex === -1) {
      console.error('Transaction not found');
      return;
    }
    this.transactions.splice(transactionIndex, 1);
    store.saveRecords(this.transactions);
    console.log('Transaction deleted successfully');
  }
}
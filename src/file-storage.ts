import { readFile, writeFile } from "node:fs/promises";


export class FileStorage<T extends { id: number }> {
  items: T[] = [];
  id: number = 1;
  fileName: string;
  isTest = process.env.NODE_ENV === 'test';

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  async init() {
    return readFile(this.fileName, 'utf-8')
      .then((data) => {
        if (!this.isTest) {
          this.items = JSON.parse(data)
          const nextId = this.items.length > 0
            ? this.items[this.items.length - 1].id + 1
            : 1;
          this.id = nextId
        }
      }).catch(() => {
        this.items = []
      })
  }

  async saveRecords(items: T[]) {
    return writeFile(this.fileName, JSON.stringify(items))
  }

}
// src/utils/codeQueue.js
export class CodeQueue {
  constructor(files) {
    this.queue = files.sort((a, b) => b.content.length - a.content.length);
  }

  async processAll(analyzer) {
    const results = [];
    for (const file of this.queue) {
      const result = await analyzer(file.content);
      results.push({ ...result, name: file.name });
      await new Promise(r => setTimeout(r, 1200)); // Controlled pacing for UI
    }
    return results;
  }
}
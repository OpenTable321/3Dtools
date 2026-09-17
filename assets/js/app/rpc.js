// Worker RPC client: promises over postMessage with progress callbacks.
export class MeshOpsClient {
  constructor(workerUrl) {
    this.worker = new Worker(workerUrl, { type: 'module' });
    this.pending = new Map();
    this.worker.onmessage = (e) => {
      const { id } = e.data;
      const entry = this.pending.get(id);
      if (!entry) return;
      if (e.data.progress !== undefined) {
        if (entry.onProgress) entry.onProgress(e.data.progress);
        return;
      }
      this.pending.delete(id);
      if (e.data.ok) entry.resolve(e.data.result);
      else entry.reject(new Error(e.data.error));
    };
    this.worker.onerror = (err) => {
      for (const [, entry] of this.pending) entry.reject(new Error(err.message || 'Worker error'));
      this.pending.clear();
    };
  }

  run(op, payload, onProgress, transfer = []) {
    return new Promise((resolve, reject) => {
      const id = ++this._id || (this._id = 1);
      this.pending.set(id, { resolve, reject, onProgress });
      this.worker.postMessage({ id, op, payload }, transfer);
    });
  }
}

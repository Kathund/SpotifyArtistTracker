export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function removeIdReplacer(key: string, value: any) {
  return key === '_id' ? undefined : value;
}

export function compareArrays<T>(master: T[], updated: T[]): { added: T[]; removed: T[] } {
  const masterStringified = master.map((v) => JSON.stringify(v, removeIdReplacer));
  const updatedStringified = updated.map((v) => JSON.stringify(v, removeIdReplacer));
  const masterSet = new Set(masterStringified);
  const updatedSet = new Set(updatedStringified);

  const added: T[] = [];
  const removed: T[] = [];

  for (let i = 0; i < updated.length; i++) {
    if (!masterSet.has(updatedStringified[i] as string)) added.push(updated[i] as T);
  }
  for (let i = 0; i < master.length; i++) {
    if (!updatedSet.has(masterStringified[i] as string)) updated.push(master[i] as T);
  }

  return { added, removed };
}

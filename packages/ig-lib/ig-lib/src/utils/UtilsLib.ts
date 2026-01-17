
export function generateUuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16); // random hex
    const v = c === 'x' ? r : (r & 0x3) | 0x8; // v4 spec
    return v.toString(16);
  });
}

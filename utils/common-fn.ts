export function removeDups(array: any[]) {
  return Array.from(new Set(array));
}
export const isValidUrl = (url: string): boolean => {
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/g;
  const result = url.match(urlRegex);

  return result !== null;
};

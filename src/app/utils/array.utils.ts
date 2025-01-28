export function toMap<T>(list: T[], grabber: (item: T) => string | number) {
  const map = new Map<string | number, T>();

  for (const item of list) {
    map.set(grabber(item), item);
  }

  return map;
}

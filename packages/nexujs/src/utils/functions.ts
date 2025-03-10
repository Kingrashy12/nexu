import { DataGroup } from "../types/utils";
import { randomUUID } from "crypto";

/**
 * Converts a string to a URL-friendly slug by removing spaces and special characters.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Groups an array of objects by a specified key.
 *
 * @template T - The type of objects in the data array.
 * @param {Object} params - The function parameters.
 * @param {T[]} params.data - The array of objects to be grouped.
 * @param {keyof T} params.key - The key to group by.
 * @returns {Record<string, T[]>} An object where the keys are the unique values of the specified key and the values are arrays of matching objects.
 *
 * @example
 * const data = [
 *   { category: "A", name: "Item 1" },
 *   { category: "B", name: "Item 2" },
 *   { category: "A", name: "Item 3" }
 * ];
 *
 * const grouped = groupData({ data, key: "category" });
 * console.log(grouped);
 * // {
 * //   A: [{ category: "A", name: "Item 1" }, { category: "A", name: "Item 3" }],
 * //   B: [{ category: "B", name: "Item 2" }]
 * // }
 */
export const groupData = <T>({
  data,
  key,
}: DataGroup<T>): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {};

  for (const item of data) {
    const group_key = String(item[key]);

    if (!grouped[group_key]) {
      grouped[group_key] = [];
    }

    grouped[group_key].push(item);
  }

  return grouped;
};

/**
 * Generates a random numeric ID of the specified length.
 *
 * @param {number} length - The length of the generated ID.
 * @returns {string} A randomly generated numeric string.
 *
 * @example
 * console.log(generateId(6)); // e.g., "839214"
 */
export const generateId = (length: number): string => {
  const numbers = "0123456789";
  return Array.from({ length }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  ).join("");
};

/**
 * Generates a random alphanumeric ID of the specified length.
 *
 * @param {number} length - The length of the generated ID.
 * @returns {string} A randomly generated alphanumeric string.
 *
 * @example
 * console.log(generateRandomID(8)); // e.g., "A9XbT7P3"
 */
export const generateRandomID = (length: number): string => {
  const char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return Array.from({ length }, () =>
    char.charAt(Math.floor(Math.random() * char.length))
  ).join("");
};

export const generateUUID = () => randomUUID();

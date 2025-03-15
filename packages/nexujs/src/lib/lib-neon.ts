import { NeonQuery, RequestLimitPg } from "../types/lib";
import useNeonQueryLimit from "./useNeonQueryLimit";

/**
 * Class representing interactions with a Neon database using queries.
 *
 * @example
 *
 * const neonClient = new NexuNeon(query) // The query should be imported from 'config/neon-client'
 */
class NexuNeon {
  private query: NeonQuery;

  constructor(query: NeonQuery) {
    this.query = query;
  }

  /**
   * Retrieves data with pagination and optional filtering using the provided query parameters.
   * @param {RequestLimitPg} params - The parameters for limiting and paginating the query.
   * @param {NexuRequest} params.req - The request object that is being processed.
   * @param {string} [params.whereClause] - Optional SQL `WHERE` clause to filter results.
   * @param {unknown[]} [params.values] - An array of values to be used in the query.
   * @param {string} params.table - The name of the table to query.
   * @param {number} [params.limit] - The number of records to return per page.
   * @param {number} [params.page] - The page number for pagination.
   * @returns The result of the `useQueryLimit` utlis with the provided query and parameters.
   *
   * @example
   *
   * const results = await useQueryLimit({ req, table: "users"})
   */
  useQueryLimit({
    req,
    whereClause,
    values,
    table,
    limit,
    page,
    order,
    sortBy,
    columns,
    columns_list,
  }: RequestLimitPg) {
    return useNeonQueryLimit({
      req,
      whereClause,
      table,
      values,
      query: this.query,
      limit,
      page,
      order,
      sortBy,
      columns,
      columns_list,
    });
  }
}

export default NexuNeon;

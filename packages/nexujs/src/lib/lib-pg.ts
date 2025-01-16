import { PgQuery, RequestLimitPg } from "../types/lib";
import useQueryLimit from "./useQueryLimit";

/**
 * Class representing interactions with a PostgreSQL database using queries.
 *
 * @example
 *
 * const postgres = new NexuPostgres(query) // The query should be imported from 'config/postgresClient'
 */
class NexuPostgres {
  private query: PgQuery;

  constructor(query: PgQuery) {
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
  }: RequestLimitPg) {
    return useQueryLimit({
      req,
      whereClause,
      table,
      values,
      query: this.query,
      limit,
      page,
      order,
      sortBy,
    });
  }
}

export default NexuPostgres;

import { NexuRequest } from ".";

export interface FieldDef {
  name: string;
  tableID: number;
  columnID: number;
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
  format: string;
}

export interface QueryResultBase {
  command: string;
  rowCount: number | null;
  oid: number;
  fields: FieldDef[];
}

export interface QueryResultRow {
  [column: string]: any;
}

export interface QueryResult<R extends QueryResultRow = any>
  extends QueryResultBase {
  rows: R[];
}

export type PgQuery = (
  action: string,
  values?: unknown[]
) => Promise<QueryResult<QueryResultRow> | undefined>;

export type NeonQuery = (
  action: string,
  values?: unknown[]
) => Promise<Record<string, any>[]>;

export interface RequestWithLimit {
  page?: number;
  limit?: number;
  req: NexuRequest;
  table: string;
  query: PgQuery;
  whereClause?: string;
  values?: unknown[];
  sortBy?: string | any;
  order?: string | any;
  columns?: string[];
  columns_list?: string;
}

export interface NeonRequestWithLimit {
  page?: number;
  limit?: number;
  req: NexuRequest;
  table: string;
  query: NeonQuery;
  whereClause?: string;
  values?: unknown[];
  sortBy?: string | any;
  order?: string | any;
  columns?: string[];
  columns_list?: string;
}

export interface RequestLimitPg {
  /**
   * The page number for pagination.
   * @default 1
   */
  page?: number;

  /**
   * The number of records to return per page.
   * @default 10
   */
  limit?: number;

  /**
   * The request object that is being processed.
   */
  req: NexuRequest;

  /**
   * The name of the table to query in the database.
   * @example 'users'
   */
  table: string;

  /**
   * Optional SQL `WHERE` clause for filtering results.
   * @example 'status = "active"' or 'status = $1'
   */
  whereClause?: string;

  /**
   * An array of values to be used in the query's `WHERE` clause or other parts of the query.
   * @example [1, 'active'] or [status]
   */
  values?: unknown[];
  /**
   * Specifies the field by which to sort the data.
   * This can be a string representing the field name or any other value.
   *
   * @type {string | any}
   */
  sortBy?: string | any;

  /**
   * Specifies the order of sorting (e.g., ascending or descending).
   * This can be a string representing the order type or any other value.
   *
   * @type {string | any}
   */
  order?: "asc" | "desc";

  /**
   * An array of column names to be selected from the database.
   *
   * @example ['id', 'name'] // Select specific columns
   *
   * @default ['*'] // Select all columns
   */
  columns?: string[];

  /**
   * A string of column names to be selected from the database.
   *
   * @example "id, name" // Select specific columns
   *
   * @default '*' // Select all columns
   */
  columns_list?: string;
}

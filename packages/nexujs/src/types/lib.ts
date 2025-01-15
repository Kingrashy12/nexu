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

export interface RequestWithLimit {
  page?: number;
  limit?: number;
  req: NexuRequest;
  table: string;
  query: PgQuery;
  whereClause?: string;
  values?: unknown[];
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
}

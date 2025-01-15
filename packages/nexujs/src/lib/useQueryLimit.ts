import { RequestWithLimit } from "../types/lib";

const useQueryLimit = async ({
  req,
  page = 1,
  limit = 10,
  table,
  whereClause = "",
  values = [],
  query,
}: RequestWithLimit) => {
  // Destructure page and limit from req.query (default values provided)
  const { page: queryPage, limit: queryLimit } = req.query;

  // Use query parameters if available, else fall back to defaults
  const Page = queryPage ? Number(queryPage) : page;
  const Limit = queryLimit ? Number(queryLimit) : limit;

  // Validation to ensure valid page and limit
  if (Page < 1 || Limit < 1) {
    throw new Error("Page and Limit must be greater than 0.");
  }

  // Calculate the offset for pagination
  const offset = (Page - 1) * Limit;

  // Create the base query string with the WHERE clause if present
  let queryString = `SELECT * FROM ${table}`;

  if (whereClause) {
    queryString += ` WHERE ${whereClause}`;
  }

  queryString += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

  // Combine existing values with the pagination parameters
  const queryValues = [...values, Limit, offset];

  // Perform the query with pagination and filtering
  const results = await query(queryString, queryValues);

  return results;
};

export default useQueryLimit;

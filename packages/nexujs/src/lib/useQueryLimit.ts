import { RequestWithLimit } from "../types/lib";

const useQueryLimit = async ({
  req,
  page = 1,
  limit = 10,
  table,
  whereClause = "",
  values = [],
  sortBy = "id",
  order = "asc",
  query,
  columns = ["*"],
  columns_list,
}: RequestWithLimit) => {
  const hasLists = columns.length > 1;
  if (hasLists && columns_list) {
    throw new Error("Cannot use 'columns' together with 'columns_list'");
  }

  if ((hasLists && columns.includes("*")) || columns_list?.includes("*")) {
    throw new Error("Cannot mix '*' with other columns");
  }

  // Destructure page, limit, sortBy, order from req.query (default values provided)
  const {
    page: queryPage,
    limit: queryLimit,
    sortBy: querySortBy,
    order: queryOrder,
  } = req.query;

  // Use query parameters if available, else fall back to defaults
  const Page = queryPage ? Number(queryPage) : page;
  const Limit = queryLimit ? Number(queryLimit) : limit;
  const SortBy = querySortBy || sortBy;
  const Order =
    queryOrder && ["asc", "desc"].includes(queryOrder.toString().toLowerCase())
      ? queryOrder
      : order;

  // Validation to ensure valid page and limit
  if (Page < 1 || Limit < 1) {
    throw new Error("Page and Limit must be greater than 0.");
  }

  // Calculate the offset for pagination
  const offset = (Page - 1) * Limit;

  const selector = hasLists ? columns.join(",") : columns_list;

  // Create the base query string with the WHERE clause if present
  let queryString = `SELECT ${selector} FROM ${table}`;

  // Add filtering conditions if whereClause is provided
  if (whereClause) {
    queryString += ` WHERE ${whereClause}`;
  }

  // Add sorting condition
  queryString += ` ORDER BY ${SortBy} ${Order.toString().toUpperCase()}`;

  // Add pagination (LIMIT and OFFSET)
  queryString += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

  // Combine existing values with the pagination parameters
  const queryValues = [...values, Limit, offset];

  // Perform the query with pagination, filtering, and sorting
  const results = await query(queryString, queryValues);

  return results;
};

export default useQueryLimit;

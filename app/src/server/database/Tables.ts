import {DuckDBTimestampType} from "@duckdb/node-api";


// Table: "migrations"  | Columns: (filename, executed_at)
export const TABLE_MIGRATIONS = "migrations";
// the types of the two columns
type TABLE_MIGRATIONS_SCHEMA = [string, DuckDBTimestampType]
export {type TABLE_MIGRATIONS_SCHEMA}

/* ---------------------------------------------------------------------------- */
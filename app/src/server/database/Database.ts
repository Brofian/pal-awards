import {DuckDBConnection, DuckDBInstance, type DuckDBType} from '@duckdb/node-api';
import SimpleEventTarget from "@/shared/events/SimpleEventTarget.ts";
import type {DuckDBValue} from "@duckdb/node-api/lib/values";
import QueryResult from "@/server/database/QueryResult.ts";
import logger from "@/server/util/Logger.ts";


type DatabaseEvents = {
    "connected": object
}

type QueryParameters = { [key: string]: DuckDBValue }
type QueryParameterTypes<A extends QueryParameters> = { [key in keyof A]: DuckDBType }

/**
 *
 */
export class Database extends SimpleEventTarget<DatabaseEvents> {

    private readonly connection: DuckDBConnection;

    constructor(connection: DuckDBConnection) {
        super();
        this.connection = connection;
    }

    /**
     * Function to query elements from the database. If you do not need to receive the results,
     * consider using the execute function instead!
     *
     * @param sql
     * @param parameters
     * @param parameterTypes
     */
    public async query<T extends Array<DuckDBValue>, P extends QueryParameters = {}>(sql: string, parameters?: P, parameterTypes?: QueryParameterTypes<P>): Promise<QueryResult<T>> {
        let result;
        if (parameters) {
            // run a prepared query and bind the parameters to $1, $2, etc.
            const prepared = await this.connection.prepare(sql);
            prepared.bind(parameters, parameterTypes);
            result = await prepared.runAndReadAll();
        } else {
            // run a simple query
            result = await this.connection.runAndReadAll(sql);
        }

        return new QueryResult<T>(result.getRows());
    }

    /**
     * Function to execute statements. If you do need to receive the results,
     * consider using the query function instead!
     *
     * @param sql
     * @param parameters
     * @param parameterTypes
     */
    public async execute<P extends QueryParameters = {
        _: never
    }>(sql: string, parameters?: P, parameterTypes?: QueryParameterTypes<P>): Promise<void> {
        if (parameters) {
            // run a prepared query and bind the parameters to $1, $2, etc.
            const prepared = await this.connection.prepare(sql);
            prepared.bind(parameters, parameterTypes);
            await prepared.run();
        } else {
            // run a simple query
            await this.connection.run(sql);
        }
    }
}

const instance = await DuckDBInstance.create('/var/database.duckdb');
const connection = await instance.connect();

if (!instance || !connection) {
    logger.error("Could not connect to database");
    process.exit(1);
}

const database = new Database(connection);
export default database;
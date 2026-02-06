import type {DuckDBValue} from "@duckdb/node-api/lib/values";

/**
 * Wrapper class for query Results. This helps abstract the result away from DuckDB specific systematic
 * to a more local way that also introduces type ascription for the resulting rows.
 */
export default class QueryResult<T extends Array<DuckDBValue>> {

    private readonly rows: DuckDBValue[][];
    private index: number = 0;

    constructor(rows: DuckDBValue[][]) {
        this.rows = rows;
    }

    public getLength(): number {
        return this.rows.length;
    }

    public find(pred: { (row: DuckDBValue[], index: number): boolean }): T | undefined {
        const row = this.rows.find(pred);
        return row && this.ascribe<T>(row);
    }

    public getOne(): T | undefined {
        const row = this.rows[this.index++];
        return row && this.ascribe<T>(row);
    }

    public forceOne(): T {
        const row = this.rows[this.index++];
        if (!row) throw Error("Cannot force element of empty array")
        return row && this.ascribe<T>(row);
    }

    public getAll(): T[] {
        return this.ascribe<T[]>(this.rows);
    }

    /**
     * Warning! We break type soundness at this point by ascribing the desired type.
     * This is not safe in general, and you should be 100% sure, the value already has the desired type!
     */
    private ascribe<D>(value: DuckDBValue | DuckDBValue[] | DuckDBValue[][]): D {
        return value as D;
    }
}
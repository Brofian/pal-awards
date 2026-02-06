import database from "@/server/database/Database.ts";
import {readdir} from "node:fs/promises";
import {TABLE_MIGRATIONS} from "@/server/database/Tables.ts";
import logger from "@/server/util/Logger.ts";


/**
 * Read all existing filenames and their contents directly from the filesystem
 * @param migrationDirectory    The directory to read files from
 * @param ignoreFileNames       A set of filenames that are ignored and not loaded
 */
export async function readSqlMigrationFiles(migrationDirectory: string, ignoreFileNames: Set<string>): Promise<[string, string][]> {
    const filenames = (await readdir(migrationDirectory))
        .filter(fn => !ignoreFileNames.has(fn));
    filenames.sort();

    const result: [string, string][] = [];
    for (const filename of filenames) {
        const file = Bun.file(migrationDirectory + '/' + filename);
        const content = await file.text();
        result.push([filename, content]);
    }

    return result;
}

/**
 * Load the Set of all migration filenames from the database.
 * If the `migrations` table does not exist, return the empty Set
 */
async function getPreviousMigrations(): Promise<Set<string>> {
    const existingTables = await database.query<[string]>("SHOW TABLES");
    const migrationsTableExists = existingTables.find(t => t[0] === TABLE_MIGRATIONS) !== undefined;
    if (migrationsTableExists) {
        const migrations = await database.query<[string]>(`SELECT filename
                                                           FROM ${TABLE_MIGRATIONS}`);
        const migrationFileNames = migrations.getAll().map(row => row[0]);
        return new Set(migrationFileNames);
    }
    return new Set();
}

/**
 * Execute all migration files, that have not been executed already to bring the database up to date.
 * This should only be called once at server startup.
 */
export default async function migrateDatabase() {
    const previousMigrations = await getPreviousMigrations();
    const migrations = await readSqlMigrationFiles(import.meta.dir + "/migrations", previousMigrations);

    if (migrations.length === 0) {
        logger.info("All migrations already available in the database. Skipping...");
    } else {
        logger.info(`Now applying ${migrations.length} migrations...`);
    }

    for (const migration of migrations) {
        const [filename, query] = migration;
        logger.debug(`- applying ${filename}`);

        // execute the migration
        await database.query(query);
        // write the migration into the migration table
        await database.execute(`INSERT INTO ${TABLE_MIGRATIONS}
                                VALUES ($filename, current_localtimestamp())`, {
            "filename": filename,
        });
    }
}


const LOG_LEVELS = ['DEBUG', 'INFO', 'WARNING', 'ERROR'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export default class Logger {
    private readonly LOG_LEVEL: number = 1;

    constructor(logLevel?: LogLevel) {
        if (logLevel) {
            this.LOG_LEVEL = LOG_LEVELS.indexOf(logLevel);
        }
    }

    public debug(message: string, ...data: unknown[]): void {
        this.log('DEBUG', message, ...data);
    }

    public info(message: string, ...data: unknown[]): void {
        this.log('INFO', message, ...data);
    }

    public warning(message: string, ...data: unknown[]): void {
        this.log('WARNING', message, ...data);
    }

    public error(message: string, ...data: unknown[]): void {
        this.log('ERROR', message, ...data);
    }

    private log(logLevel: LogLevel, message: string, ...data: unknown[]): void {
        if (this.LOG_LEVEL <= LOG_LEVELS.indexOf(logLevel)) {
            const dateString = String(Date.now());
            console.log(
                `[${dateString}][${logLevel}] ${message}`,
                ...data
            );
        }
    }
}
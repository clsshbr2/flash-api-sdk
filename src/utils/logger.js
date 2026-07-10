// src/utils/logger.js
/**
 * Logger simples para debug
 */
export class Logger {
    constructor(prefix = '[Flash API SDK]', level = 'info') {
        this.prefix = prefix;
        this.level = level;
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
            silent: 4,
        };
    }

    /**
     * Log de debug
     */
    debug(message, data = null) {
        if (this.levels[this.level] <= this.levels.debug) {
            console.log(`${this.prefix} [DEBUG]`, message, data || '');
        }
    }

    /**
     * Log de info
     */
    info(message, data = null) {
        if (this.levels[this.level] <= this.levels.info) {
            console.log(`${this.prefix} [INFO]`, message, data || '');
        }
    }

    /**
     * Log de warning
     */
    warn(message, data = null) {
        if (this.levels[this.level] <= this.levels.warn) {
            console.warn(`${this.prefix} [WARN]`, message, data || '');
        }
    }

    /**
     * Log de erro
     */
    error(message, data = null) {
        if (this.levels[this.level] <= this.levels.error) {
            console.error(`${this.prefix} [ERROR]`, message, data || '');
        }
    }

    /**
     * Define nível de log
     */
    setLevel(level) {
        if (this.levels.hasOwnProperty(level)) {
            this.level = level;
        }
    }
}
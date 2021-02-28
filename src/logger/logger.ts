import { Console } from "node:console";
import * as Winston from "winston";

class Logger {

    private logger: Winston.Logger;

    constructor(){

    }

    public initializeLogger(name: String){
        if (this.logger === undefined){
            this.logger = Winston.createLogger({
                transports: [
                    new Winston.transports.Console(),
                    new Winston.transports.File({
                        filename: `./logs/${name}/error.log`,
                        level: "error",
                    }),
                    new Winston.transports.File({
                        filename: `./logs/${name}/debug.log`,
                        level: "debug",
                    }),
                    new Winston.transports.File({
                        filename: `./logs/${name}/info.log`,
                    }),
                ],
                format: Winston.format.combine(
                    Winston.format.timestamp({
                        format: "YYYY-MM-DD HH:mm:ss",
                    }),
                    Winston.format.printf(
                        (log) =>
                            `[${log.level.toUpperCase()}]\t[${
                                log.timestamp
                            }] [${name}] - ${log.message}`
                    )
                ),
            });
        }
    }

    public log(level: string, message: string){
        if (!(this.logger === undefined)){
            this.logger.log(level, message);
        }
    }
}

export const logger = new Logger();
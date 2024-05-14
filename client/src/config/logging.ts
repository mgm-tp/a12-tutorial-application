import { Container } from "@com.mgmtp.a12.client/client-core/lib/core/configuration";
import { ConsoleLoggingStrategy } from "@com.mgmtp.a12.utils/utils-logging";
import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api";

import { isProduction } from "./";

if (isProduction) {
    Container.config
        .bind(Container.identifier.LoggingStrategy)
        .toConstantValue(new ConsoleLoggingStrategy(console, LogLevel.ERROR));
} else {
    Container.config
        .bind(Container.identifier.LoggingStrategy)
        .toConstantValue(new ConsoleLoggingStrategy(console, LogLevel.LOG));
}

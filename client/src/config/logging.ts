import { Settings, ConsoleLoggingStrategy } from "@com.mgmtp.a12.utils/utils-logging";
import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api";

import { isProduction } from "./";

Settings.LogStrategy = new ConsoleLoggingStrategy(console, isProduction ? LogLevel.ERROR : LogLevel.LOG);

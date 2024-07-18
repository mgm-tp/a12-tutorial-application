package com.mgmtp.a12.tutorial.server.init.migration;

import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import org.springframework.context.annotation.Configuration;


/**
 * This {@link MigrationConfiguration} class prevents {@link CommonDataServicesEventListener} in {@link PersonMigration}
 * from calling multiple times even the migration task is already executed.
 * This improves the application's performance.
 **/
@Configuration
public class MigrationConfiguration {
    private boolean isEnabled = false;

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }
}

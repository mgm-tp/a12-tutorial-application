package com.mgmtp.a12.template.server.migration;

import com.mgmtp.a12.dataservices.events.DataServicesEventListener;
import org.springframework.context.annotation.Configuration;


/**
 * This {@link MigrationConfiguration} class prevents {@link DataServicesEventListener} in {@link PersonMigration}
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

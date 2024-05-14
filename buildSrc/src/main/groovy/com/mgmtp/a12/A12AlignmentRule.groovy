package com.mgmtp.a12

import org.gradle.api.artifacts.ComponentMetadataContext
import org.gradle.api.artifacts.ComponentMetadataRule

/**
 * Creates virtual BOMs for A12 products without own BOM.
 *
 * @link https://docs.gradle.org/7.4.2/userguide/dependency_version_alignment.html
 */
class A12AlignmentRule implements ComponentMetadataRule {
    void execute(ComponentMetadataContext ctx) {
        ctx.details.with {
            if (id.group == "com.mgmtp.a12.base") {
                belongsTo("com.mgmtp.a12.base:base-virtual-bom:${id.version}")
            }
        }
    }
}

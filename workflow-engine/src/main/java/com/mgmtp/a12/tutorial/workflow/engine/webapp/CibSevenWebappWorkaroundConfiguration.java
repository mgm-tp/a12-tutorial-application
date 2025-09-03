/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

package com.mgmtp.a12.tutorial.workflow.engine.webapp;

import jakarta.servlet.Filter;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/**
 * Makes the CIB 7 Cockpit, Tasklist and Admin webapps usable in this tutorial.
 *
 * <p>A12 Workflows 13.0.1 ships {@code WebAppBlockFilter}, an unconditional {@code @Component} that answers every
 * request below the configured {@code camunda.bpm.webapp.application-path} with HTTP 403. In CIB 7 2.2.0 that path
 * defaults to {@code /webapp}, so the webapps are unreachable there. The legacy {@code /camunda} alias is not
 * matched by the filter, but its plugin assets fail to resolve -- see {@link CibSevenPluginAssetFilter}.
 *
 * <p>This configuration therefore does two things: it keeps the block filter from being registered, and it
 * registers the filter that serves the plugin assets.
 *
 * <p>Temporary workaround for A12WF-1632, which removes the block filter upstream and puts the webapps behind UAA
 * instead. Delete this class and {@link CibSevenPluginAssetFilter} once A12 Workflows ships that change. Note that
 * while this workaround is in place the webapps are reachable without authentication, which is acceptable for local
 * development only.
 */
@Configuration
public class CibSevenWebappWorkaroundConfiguration {

    /**
     * Registers the A12 Workflows block filter as disabled, which stops Spring Boot from registering it itself.
     *
     * <p>Resolved through an {@link ObjectProvider} so that the application still starts once the upstream fix has
     * removed the bean.
     */
    @Bean
    public FilterRegistrationBean<Filter> webAppBlockFilterDisabling(
            @Qualifier("webAppBlockFilter") ObjectProvider<Filter> webAppBlockFilter) {

        Filter blockFilter = webAppBlockFilter.getIfAvailable(
                () -> (request, response, chain) -> chain.doFilter(request, response));

        FilterRegistrationBean<Filter> registration = new FilterRegistrationBean<>(blockFilter);
        registration.setEnabled(false);
        return registration;
    }

    /**
     * Registers the plugin asset filter ahead of the webapp servlet so that it can answer the asset requests.
     */
    @Bean
    public FilterRegistrationBean<CibSevenPluginAssetFilter> cibSevenPluginAssetFilter() {
        FilterRegistrationBean<CibSevenPluginAssetFilter> registration =
                new FilterRegistrationBean<>(new CibSevenPluginAssetFilter());
        registration.addUrlPatterns("/*");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }
}

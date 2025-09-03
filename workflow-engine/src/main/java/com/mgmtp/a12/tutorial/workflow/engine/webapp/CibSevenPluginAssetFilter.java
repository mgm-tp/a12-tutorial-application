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

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaTypeFactory;

/**
 * Serves the aggregated CIB 7 webapp plugin assets that the Cockpit, Tasklist and Admin front ends request.
 *
 * <p>The front ends ask for {@code <prefix>/api/<app>/plugin/<app>Plugins/static/app/plugin.js}. That endpoint
 * resolves the asset as the classpath resource {@code plugin/<app>/app/plugin.js}, derived from
 * {@code CockpitPlugins.getAssetDirectory()}. In CIB 7 2.2.0 the assets are packaged in
 * {@code cibseven-webapp-webjar} under {@code META-INF/resources/plugin/<app>/app/} instead, so the lookup misses
 * and the request fails. Because the webapp sets {@code require.waitSeconds = 0}, RequireJS never times out and
 * the page keeps showing its loading spinner.
 *
 * <p>This filter bridges the two locations by resolving the requested asset from
 * {@code META-INF/resources/plugin/}. Requests that do not match a known asset are passed on unchanged.
 *
 * <p>Temporary workaround for A12WF-1632. Remove together with {@link CibSevenWebappWorkaroundConfiguration}
 * once A12 Workflows ships the fix.
 */
public class CibSevenPluginAssetFilter extends HttpFilter {

    private static final Pattern ASSET_REQUEST =
            Pattern.compile(".*/api/(cockpit|tasklist|admin|welcome)/plugin/[^/]+/static/(.+)");

    private static final String ASSET_ROOT = "META-INF/resources/plugin/";

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        Resource asset = resolveAsset(request.getRequestURI());
        if (asset == null) {
            chain.doFilter(request, response);
            return;
        }

        MediaTypeFactory.getMediaType(asset).ifPresent(mediaType -> response.setContentType(mediaType.toString()));
        response.setContentLengthLong(asset.contentLength());
        try (InputStream assetStream = asset.getInputStream()) {
            assetStream.transferTo(response.getOutputStream());
        }
    }

    private Resource resolveAsset(String requestUri) {
        Matcher matcher = ASSET_REQUEST.matcher(requestUri);
        if (!matcher.matches()) {
            return null;
        }

        String assetPath = matcher.group(2);
        if (assetPath.contains("..")) {
            return null;
        }

        Resource asset = new ClassPathResource(ASSET_ROOT + matcher.group(1) + "/" + assetPath);
        return asset.exists() && asset.isReadable() ? asset : null;
    }
}

import "styled-components";

import type { DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/schema.js";

declare module "styled-components" {
    /* eslint-disable  @typescript-eslint/no-empty-object-type */
    export interface DefaultTheme extends DefaultThemeType {}
}

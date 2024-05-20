import "styled-components";

import type { DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core";

declare module "styled-components" {
    /* eslint-disable  @typescript-eslint/no-empty-object-type */
    export interface DefaultTheme extends DefaultThemeType {}
}

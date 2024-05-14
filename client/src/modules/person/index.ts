import { Module } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { ApplicationModel } from "@com.mgmtp.a12.client/client-core/lib/core/model";

import * as model from "./person-appmodel.json";

const module = (): Module => ({
    id: "PersonModule",
    model: () => model as ApplicationModel
});

export default module;

import { configure } from "mobx";

configure({ enforceActions: "observed" });

if (__DEV__) {
  import("./utils/mobxLogger").then(logger => {
    logger.default();
  });
}

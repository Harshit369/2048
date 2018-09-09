import { configure } from "mobx";

configure({ enforceActions: "observed" });

if (__DEV__ && Boolean(window.navigator.userAgent)) {
  import("./utils/mobxLogger").then(logger => {
    logger.default();
  });
}

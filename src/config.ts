import { configure } from "mobx";

configure({ enforceActions: "strict" });

if (__DEV__) {
  import("./utils/mobxLogger");
}

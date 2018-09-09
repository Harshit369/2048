import { spy } from "mobx";

const DEFAULT_STYLE = "color: #006d92; font-weight:bold;";

// Just call this function after MobX initialization
// As argument you can pass an object with:
// - collapsed: true   -> shows the log collapsed
// - style             -> the style applied to the action description
const startLogging = ({
  collapsed = true,
  style
}: {
  collapsed?: boolean;
  style?: string;
} = {}) => {
  spy(event => {
    if (["action"].includes(event.type)) {
      if (collapsed) {
        // tslint:disable-next-line:no-console
        console.groupCollapsed(
          `Action @ ${formatTime(new Date())} ${event.name}`
        );
      } else {
        // tslint:disable-next-line:no-console
        console.group(`Action @ ${formatTime(new Date())} ${event.name}`);
      }
      // tslint:disable-next-line:no-console
      console.log("%cType: ", style || DEFAULT_STYLE, event.type);
      // tslint:disable-next-line:no-console
      console.log("%cName: ", style || DEFAULT_STYLE, event.name);
      // tslint:disable-next-line:no-console
      console.log("%cTarget: ", style || DEFAULT_STYLE, event.object);
      // tslint:disable-next-line:no-console
      console.log("%cArguments: ", style || DEFAULT_STYLE, event.arguments);
      // tslint:disable-next-line:no-console
      console.groupEnd();
    }
  });
};

export default startLogging;

const repeat = (str: string, times: number) => new Array(times + 1).join(str);
const pad = (num: number, maxLength: number) =>
  repeat("0", maxLength - num.toString().length) + num;
const formatTime = (time: Date) =>
  `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(
    time.getSeconds(),
    2
  )}.${pad(time.getMilliseconds(), 3)}`;

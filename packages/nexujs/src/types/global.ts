import "../lib/global";

declare global {
  interface Logger {
    loggerIds: Set<string>;
    pushId: (id: string) => void;
    info: (msg: string, id: string) => void;
    success: (msg: string, id: string) => void;
    warning: (msg: string, id: string) => void;
    hasStartServer: boolean;
    setServerStarted: (status: boolean) => void;
    clear: () => void;
  }

  var serverLog: Logger | undefined;
}

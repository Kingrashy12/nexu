const desc = `
╔═╗┌─┐┌─┐┌┬┐  ┌─┐┬  ┌─┐─┐ ┬┬┌┐ ┬  ┌─┐   ┌─┐┌┐┌┌┬┐  ┌─┐┌┐┌┌─┐┬─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐
╠╣ ├─┤└─┐ │   ├┤ │  ├┤ ┌┴┬┘│├┴┐│  ├┤    ├─┤│││ ││  ├┤ ││││  ├┬┘└┬┘├─┘ │ ├┤  ││
╚  ┴ ┴└─┘ ┴┘  └  ┴─┘└─┘┴ └─┴└─┘┴─┘└─┘┘  ┴ ┴┘└┘─┴┘  └─┘┘└┘└─┘┴└─ ┴ ┴   ┴ └─┘─┴┘
`;

const nexuSend = `\n\n\n
 ███╗   ██╗███████╗██╗  ██╗██╗   ██╗           ██╗███████╗
 ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║           ██║██╔════╝
 ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║█████╗     ██║███████╗
 ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════╝██   ██║╚════██║
 ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝      ╚█████╔╝███████║
 ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝        ╚════╝ ╚══════╝
                                                                
                                                            
${desc}
`;

const nexuLog = `
 ███╗   ██╗███████╗██╗  ██╗██╗   ██╗           ██╗███████╗
 ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║           ██║██╔════╝
 ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║█████╗     ██║███████╗
 ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════╝██   ██║╚════██║
 ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝      ╚█████╔╝███████║
 ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝        ╚════╝ ╚══════╝
`;

/**
 * Generates and returns the welcome message for NexuJs.
 *
 * This function is specifically designed to provide the welcome message and should
 * not be used for other purposes. It returns an object containing two properties:
 * - `log`: A string representation of the NexuJs log.
 * - `send`: The formatted message to be displayed as part of the welcome message.
 *
 */
export function sendMsg() {
  return {
    log: nexuLog,
    send: nexuSend,
  };
}

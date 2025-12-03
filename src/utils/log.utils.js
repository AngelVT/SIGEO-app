const RESET = "\x1b[0m";
const COLOR = "\x1b[37m";

export function consoleInfo(msg) {
    const bg = "\x1b[42m";

    console.log(`${bg}${COLOR}Info:${RESET}`);
    console.log(`   ${msg}`);
}

export function consoleApi(msg) {
    const bg = "\x1b[46m";

    console.log(`${bg}${COLOR}API:${RESET}`);
    console.log(`   ${msg}`);
}

export function consoleAuth(msg) {
    const bg = "\x1b[45m";

    console.log(`${bg}${COLOR}Auth:${RESET}`);
    console.log(`   ${msg}`);
}

export function consoleError(msg) {
    const bg = "\x1b[41m";

    console.log(`${bg}${COLOR}Error:${RESET}`);
    console.log(`   ${msg}`);
}
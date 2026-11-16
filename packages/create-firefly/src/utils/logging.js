const colors = {
    reset: "\x1b[0m",
    green: "\x1b[38;2;173;255;47m",
    yellow: "\x1b[33m",
    red: "\x1b[31m"
};

export const firefly = (text) => `${colors.green}${text}${colors.reset}`;

export const logger = {
    log: (...message) => console.log(`${colors.green}[firefly]${colors.reset} - `, ...message),
    warn: (...message) => console.log(`${colors.yellow}[firefly]${colors.reset} - `, ...message),
    error: (...message) => console.log(`${colors.red}[firefly]${colors.reset} - `, ...message)
};
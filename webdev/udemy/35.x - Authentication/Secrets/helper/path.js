import path from "path";

function getCallerFilePath(level = 0) {
    let stack = new Error().stack.split('\n')
    level = level + 2
    return decodeURI(stack[level].slice(
        stack[level].lastIndexOf(' ') + 1,
        stack[level].lastIndexOf('.js') + 3
    )).replace('file:///', '');
}

export default function getPath(relPath) {
    let caller = getCallerFilePath(1);
    return path.resolve(path.dirname(caller), relPath);
}
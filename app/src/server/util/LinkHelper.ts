export function createLocalUrl(path: string): string {
    const host = Bun.env.PUBLIC_HOST || 'localhost';
    const port = parseInt(Bun.env.HTTP_PORT || '443');

    if (port === 443) {
        return `https://${host}${path}`;
    }
    return `https://${host}:${port}${path}`;
}
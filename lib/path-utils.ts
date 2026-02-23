export const BASE_PATH = '/IRA';

export const getAssetPath = (path: string) => {
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_PATH}${cleanPath}`;
};

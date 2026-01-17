export type ConfigValue = {
    site: {
        name: string;
        serverUrl: string;
        assetURL: string;
        basePath: string;
    };
    auth: {
        method: 'jwt';
        skip: boolean;
    };
};

export const CONFIG: ConfigValue = {
    site: {
        name: 'NBR- DGInfoTech',
        serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
        assetURL: import.meta.env.VITE_ASSET_URL ?? '',
        basePath: import.meta.env.VITE_BASE_PATH ?? '',
    },
    auth: {
        method: 'jwt',
        skip: false,
    },
};
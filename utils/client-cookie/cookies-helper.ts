export const getClientSideCookie = (name: string): string | undefined => {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`))
        ?.split('=')[1];

        return cookieValue ? decodeURIComponent(cookieValue) : undefined;
};

export const setClientSideCookie = (
    name: string,
    value: string|boolean,
    options: { path?: string; expires?: number | Date; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' } = {}
): void => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    
    if (options.path) {
        cookieString += `; path=${options.path}`;
    }

    
    if (options.expires) {
        const expires = typeof options.expires === 'number'
            ? new Date(Date.now() + options.expires * 1000) // expires in seconds
            : options.expires;
        cookieString += `; expires=${expires.toUTCString()}`;
    }

 
    if (options.secure) {
        cookieString += '; secure';
    }

  
    if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
};

export const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString();
};

export const generateId = () => {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
};

export const copyToClipboard = (text) => {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(input);
            resolve();
        } catch (err) {
            document.body.removeChild(input);
            reject(err);
        }
    });
};
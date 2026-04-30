import * as FileSystem from 'expo-file-system/legacy';

const STORAGE_DIR = `${FileSystem.documentDirectory}ibugtong`;

const ensureStorageDirectory = async () => {
    const dirInfo = await FileSystem.getInfoAsync(STORAGE_DIR);

    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
    }
};

const getFileUri = (key: string) => `${STORAGE_DIR}/${key}.json`;

export const readJsonFile = async <T>(key: string, fallback: T): Promise<T> => {
    try {
        await ensureStorageDirectory();
        const fileUri = getFileUri(key);
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
            return fallback;
        }

        const content = await FileSystem.readAsStringAsync(fileUri);
        return JSON.parse(content) as T;
    } catch (error) {
        console.error(`Failed to read local data for ${key}:`, error);
        return fallback;
    }
};

export const writeJsonFile = async <T>(key: string, value: T) => {
    try {
        await ensureStorageDirectory();
        const fileUri = getFileUri(key);
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to write local data for ${key}:`, error);
    }
};

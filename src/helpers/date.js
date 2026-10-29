export const MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
];

export const toDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    // Format database Laravel memakai spasi, Date.parse stabil dengan ISO 8601.
    const normalized = String(value).trim().replace(' ', 'T');
    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value) => {
    const date = toDate(value);
    if (!date) return '-';

    return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatTime = (value) => {
    const date = toDate(value);
    if (!date) return null;

    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const buildDateInfo = (item, isTrashed = false) => {
    if (isTrashed) {
        return {
            isTrashed: true,
            date: formatDate(item?.deleted_at),
            time: formatTime(item?.deleted_at)
        };
    }

    const created = toDate(item?.created_at);
    const updated = toDate(item?.updated_at);

    return {
        isTrashed: false,
        date: formatDate(item?.created_at),
        time: formatTime(item?.created_at),
        updatedDate: formatDate(item?.updated_at),
        updatedTime: formatTime(item?.updated_at),
        hasUpdate: Boolean(created && updated && updated.getTime() !== created.getTime())
    };
};

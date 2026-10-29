const MONTHS = [
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

export const buildDateInfo = (item, isTrashed) => {
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

export const filterDivisions = (items, filters, dateField) => {
    const search = String(filters?.search ?? '').trim().toLowerCase();
    const year = String(filters?.year ?? '');
    const month = String(filters?.month ?? '');
    const sort = filters?.sort ?? 'terbaru';

    return items
        .filter((item) => {
            const name = String(item?.title ?? item?.name ?? '').toLowerCase();
            if (search && !name.includes(search)) return false;

            const date = toDate(item?.[dateField]);
            if (year && (!date || String(date.getFullYear()) !== year)) return false;
            if (month && (!date || String(date.getMonth() + 1) !== month)) return false;

            return true;
        })
        .sort((rowA, rowB) => {
            if (sort === 'nama-asc') {
                const labelA = String(rowA?.title ?? rowA?.name ?? '');
                const labelB = String(rowB?.title ?? rowB?.name ?? '');
                return labelA.localeCompare(labelB, 'id');
            }

            const timeA = toDate(rowA?.[dateField])?.getTime() ?? 0;
            const timeB = toDate(rowB?.[dateField])?.getTime() ?? 0;

            return sort === 'terlama' ? timeA - timeB : timeB - timeA;
        });
};

export const filterCollabs = filterDivisions;

export const pageWindow = (totalPages, currentPage) => {
    const delta = 1;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    const pages = [1];
    if (left > 2) pages.push('…');
    for (let page = left; page <= right; page++) pages.push(page);
    if (right < totalPages - 1) pages.push('…');
    pages.push(totalPages);

    return pages;
};

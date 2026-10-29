import { toDate } from './date';

export * from './date';

export const filterTableItems = (items = [], filters = {}, dateField = 'created_at') => {
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

export const filterDivisions = filterTableItems;
export const filterCollabs = filterTableItems;

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

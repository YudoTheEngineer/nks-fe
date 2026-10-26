const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export function formatDate(date = new Date()) {
    const parsed = date instanceof Date ? date : new Date(date)

    if (Number.isNaN(parsed.getTime())) {
        return ''
    }

    const dayName = DAY_NAMES[parsed.getDay()]
    const month = MONTH_NAMES[parsed.getMonth()]
    const dayOfMonth = String(parsed.getDate()).padStart(2, '0')
    const year = parsed.getFullYear()

    return `${dayName}, ${dayOfMonth} ${month} ${year}`
}

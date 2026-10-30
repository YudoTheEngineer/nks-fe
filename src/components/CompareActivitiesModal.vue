<script setup>
    import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRaw } from 'vue';

    const props = defineProps({
        activity: { type: Object, required: true }
    });

    const emit = defineEmits(['close', 'update']);

    const clone = (value) => JSON.parse(JSON.stringify(value));

    const draft = ref(clone(toRaw(props.activity)));
    const pick = ref({ anggaran: null, lokasi: null });
    const rejecting = ref(null);
    const reason = ref('');
    const reasonErr = ref(false);
    const closeRef = ref(null);
    const dialogRef = ref(null);
    const summaryRef = ref(null);
    const approvalRef = ref(null);

    const NAME = { jabar: 'PD Jabar', brin: 'BRIN' };
    const TAG = { jabar: 'PD JABAR', brin: 'BRIN' };
    const STATUS_META = {
        draft: { label: 'Draft', icon: 'fa-pen', tone: 'text-gray-500' },
        proses: { label: 'Proses', icon: 'fa-clock', tone: 'text-sky-600' },
        disetujui: { label: 'Disetujui', icon: 'fa-circle-check', tone: 'text-green-600' },
        setujui: { label: 'Disetujui', icon: 'fa-circle-check', tone: 'text-green-600' },
        ditolak: { label: 'Ditolak', icon: 'fa-circle-xmark', tone: 'text-red-600' }
    };
    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const sent = (side) => Boolean(side) && side.status !== 'draft';
    const same = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
    const otherKey = (key) => (key === 'jabar' ? 'brin' : 'jabar');

    const rp = (n) => (n == null || n === '' ? '' : `Rp ${Number(n).toLocaleString('id-ID')}`);

    const fd = (iso) => {
        if (!iso) return '-';
        const date = new Date(String(iso).replace(' ', 'T'));
        if (Number.isNaN(date.getTime())) return '-';
        const p2 = (n) => String(n).padStart(2, '0');
        return `${date.getDate()} ${MON[date.getMonth()]} ${date.getFullYear()}, ${p2(date.getHours())}:${p2(date.getMinutes())}`;
    };

    const bothSent = computed(() => sent(draft.value.jabar) && sent(draft.value.brin));

    const diffFields = computed(() => {
        if (!bothSent.value) return [];
        const fields = [];
        if (draft.value.jabar.anggaran !== draft.value.brin.anggaran) fields.push('anggaran');
        if (!same(draft.value.jabar.lokasi, draft.value.brin.lokasi)) fields.push('lokasi');
        return fields;
    });

    const locked = computed(() => !bothSent.value || diffFields.value.length > 0);

    const collabState = computed(() => {
        if (!bothSent.value) return { key: 'wait', text: 'Menunggu laporan kedua' };
        if (diffFields.value.length) return { key: 'diff', text: 'Perlu disamakan' };

        const statuses = [draft.value.jabar.status, draft.value.brin.status];
        if (statuses.every((status) => status === 'disetujui')) return { key: 'done', text: 'Kedua pihak disetujui' };
        if (statuses.includes('ditolak')) return { key: 'rej', text: 'Ada laporan ditolak' };

        const approved = statuses.filter((status) => status === 'disetujui').length;
        return {
            key: 'ready',
            text: approved ? `Data sama, ${approved} pihak disetujui` : 'Data sama, menunggu persetujuan'
        };
    });

    const stateChipClass = computed(() => ({
        wait: 'bg-gray-100 text-gray-600',
        diff: 'bg-sky-100 text-sky-800',
        ready: 'bg-sky-100 text-sky-800',
        done: 'bg-green-100 text-green-800',
        rej: 'bg-red-100 text-red-800'
    }[collabState.value.key]));

    const statusMeta = (status) => STATUS_META[status] ?? { label: status, icon: 'fa-clock', tone: 'text-gray-500' };

    const fieldLabel = { anggaran: 'Anggaran', lokasi: 'Lokasi pelaksanaan' };
    const fieldValue = (field, side) => (field === 'anggaran' ? rp(side.anggaran) : side.lokasi || '-');
    const fieldSub = (field, side) => (field === 'anggaran' ? side.sumber || 'Sumber belum dicantumkan' : `Periode: ${side.periode || '-'}`);

    const fieldDelta = (field) => {
        if (field === 'lokasi') return 'Lokasi di kedua laporan tidak sama';
        const a = draft.value.jabar.anggaran ?? 0;
        const b = draft.value.brin.anggaran ?? 0;
        return `Selisih ${rp(Math.abs(a - b))}. ${a > b ? 'PD Jabar' : 'BRIN'} lebih tinggi`;
    };

    const cardClass = (field, key) => {
        const chosen = pick.value[field];
        if (chosen === key) return 'border-sky-600 bg-white ring-1 ring-sky-600';
        if (chosen) return 'border-gray-200 bg-gray-50/70 opacity-70';
        return 'border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50/40';
    };

    const applyMessage = computed(() => {
        const labels = { anggaran: 'anggaran', lokasi: 'lokasi' };
        const pending = diffFields.value.filter((field) => !pick.value[field]);
        if (pending.length) {
            return `Pilih ${pending.map((field) => labels[field]).join(' dan ')} yang berlaku untuk kedua laporan.`;
        }
        return `Kedua laporan akan memakai ${diffFields.value.map((field) => `${labels[field]} ${NAME[pick.value[field]]}`).join(' dan ')}.`;
    });

    const fixedRows = computed(() => ['anggaran', 'lokasi']
        .filter((field) => !diffFields.value.includes(field))
        .map((field) => (field === 'anggaran'
            ? { label: 'Anggaran sama', value: rp(draft.value.jabar.anggaran) }
            : { label: 'Lokasi sama', value: draft.value.jabar.lokasi || '-' })));

    const harmonizedSource = (field) => {
        const h = draft.value.harmonized;
        if (!h) return '';
        return h.from?.[field] === 'sama' ? 'Sudah sama sejak awal' : `Mengikuti ${NAME[h.from?.[field]]}`;
    };

    const anyApproved = computed(() =>
        [draft.value.jabar, draft.value.brin].some((side) => side.status === 'disetujui'));

    const detailGroups = computed(() => {
        const text = (key) => (side) => side?.[key] || '';
        const diffs = diffFields.value;

        return [
            {
                title: 'Identitas kegiatan',
                rows: [
                    { label: 'Lembaga / instansi', value: text('lembaga') },
                    { label: 'Unit / OPD', value: text('divisi') },
                    { label: 'Periode pelaksanaan', value: text('periode') },
                    { label: 'Lokasi kegiatan', value: text('lokasi'), variant: diffs.includes('lokasi') ? 'diff' : '' },
                    { label: 'Sumber anggaran', value: text('sumber') },
                    {
                        label: 'Total anggaran',
                        money: true,
                        variant: diffs.includes('anggaran') ? 'diff' : '',
                        value: (side) => (side.anggaran == null ? '' : rp(side.anggaran))
                    }
                ]
            },
            {
                title: 'Progres',
                rows: [{ label: 'Capaian penyelesaian', progress: true }]
            },
            {
                title: 'Pelaksanaan',
                rows: [
                    { label: 'Progres pelaksanaan', value: text('capaian') },
                    { label: 'Kendala yang dihadapi', value: text('kendala'), variant: 'warn' },
                    { label: 'Rekomendasi tindak lanjut', value: text('rekomendasi'), variant: 'good' }
                ]
            },
            {
                title: 'Dokumen pendukung',
                rows: [
                    { label: 'Dokumen KAK (kerangka acuan kerja)', value: text('kak') },
                    { label: 'Dokumentasi kegiatan (foto/video)', value: text('foto') },
                    { label: 'Dokumen pendukung lainnya', value: text('lain') }
                ]
            },
            {
                title: 'Laporan akhir',
                rows: [
                    { label: 'Ringkasan eksekutif', value: text('ringkasan') },
                    { label: 'Dokumen laporan akhir yang telah disahkan', value: text('laporanAkhir') }
                ]
            },
            {
                title: 'Riwayat',
                rows: [
                    { label: 'Dibuat pada', value: () => fd(draft.value.created_at) },
                    { label: 'Terakhir diperbarui', value: () => fd(draft.value.updated_at) }
                ]
            }
        ];
    });

    const cellHasValue = (row, side) => sent(side) && Boolean(row.progress || row.value?.(side));

    // Hanya sel yang punya sinyal (beda/kendala/rekomendasi) diberi warna; sel biasa tetap netral.
    const cellClass = (row, side) => {
        if (!sent(side)) return 'bg-gray-50 text-gray-400';
        if (row.variant === 'warn' && cellHasValue(row, side)) return 'bg-red-50/80 text-red-900';
        if (row.variant === 'good' && cellHasValue(row, side)) return 'bg-green-50/70 text-green-900';
        if (row.variant === 'diff') return 'bg-sky-50/70 text-gray-800';
        return 'bg-gray-50 text-gray-700';
    };

    const commit = () => {
        draft.value.updated_at = new Date().toISOString();
        emit('update', clone(toRaw(draft.value)));
    };

    const close = () => emit('close');

    const focusables = () => Array.from(
        dialogRef.value?.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        ) ?? []
    ).filter((element) => element.offsetParent !== null);

    const onKeydown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }

        if (event.key !== 'Tab') return;

        const items = focusables();
        if (!items.length) return;

        const first = items[0];
        const last = items[items.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const applyPick = async () => {
        const fields = diffFields.value;
        if (!fields.length || fields.some((field) => !pick.value[field])) return;

        const from = { anggaran: 'sama', lokasi: 'sama' };
        const orig = {
            jabar: {
                anggaran: draft.value.jabar.anggaran,
                lokasi: draft.value.jabar.lokasi,
                periode: draft.value.jabar.periode
            },
            brin: {
                anggaran: draft.value.brin.anggaran,
                lokasi: draft.value.brin.lokasi,
                periode: draft.value.brin.periode
            }
        };

        fields.forEach((field) => {
            const source = draft.value[pick.value[field]];
            const target = draft.value[otherKey(pick.value[field])];
            target[field] = source[field];
            if (field === 'lokasi') target.periode = source.periode;
            from[field] = pick.value[field];
        });

        draft.value.harmonized = { at: new Date().toISOString(), by: 'Admin', from, orig };
        pick.value = { anggaran: null, lokasi: null };
        commit();
        await nextTick();
        summaryRef.value?.focus();
    };

    const reopen = () => {
        const harmonized = draft.value.harmonized;
        if (!harmonized || anyApproved.value) return;

        ['jabar', 'brin'].forEach((key) => {
            const saved = harmonized.orig?.[key] ?? {};
            if ('anggaran' in saved) draft.value[key].anggaran = saved.anggaran;
            if ('lokasi' in saved) draft.value[key].lokasi = saved.lokasi;
            if ('periode' in saved) draft.value[key].periode = saved.periode;
        });

        draft.value.harmonized = null;
        pick.value = { anggaran: null, lokasi: null };
        commit();
    };

    const focusApproval = async () => {
        await nextTick();
        approvalRef.value?.focus();
    };

    const approve = async (key) => {
        if (locked.value) return;
        const side = draft.value[key];
        side.status = 'disetujui';
        side.catatan = '';
        commit();
        await focusApproval();
    };

    const startReject = async (key) => {
        if (locked.value) return;
        rejecting.value = key;
        reason.value = '';
        reasonErr.value = false;
        await nextTick();
        document.getElementById(`reason-${key}`)?.focus();
    };

    const cancelReject = async () => {
        const side = rejecting.value;
        rejecting.value = null;
        reason.value = '';
        reasonErr.value = false;
        await nextTick();
        document.getElementById(`reject-${side}`)?.focus();
    };

    const sendReject = async () => {
        const value = reason.value.trim();
        if (!value) {
            reasonErr.value = true;
            document.getElementById(`reason-${rejecting.value}`)?.focus();
            return;
        }

        const side = draft.value[rejecting.value];
        side.status = 'ditolak';
        side.catatan = value;
        rejecting.value = null;
        reason.value = '';
        reasonErr.value = false;
        commit();
        await focusApproval();
    };

    const revert = async (key) => {
        const side = draft.value[key];
        side.status = 'proses';
        side.catatan = '';
        commit();
        await focusApproval();
    };

    let lastFocused = null;
    let previousOverflow = '';

    onMounted(() => {
        lastFocused = document.activeElement;
        previousOverflow = document.body.style.overflow;
        window.addEventListener('keydown', onKeydown);
        document.body.style.overflow = 'hidden';
        closeRef.value?.focus();
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onKeydown);
        document.body.style.overflow = previousOverflow;
        if (lastFocused instanceof HTMLElement && document.contains(lastFocused)) lastFocused.focus();
    });
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
            <div class="absolute inset-0 bg-gray-900/55 backdrop-blur-[2px]" @click="close" aria-hidden="true"></div>

            <div
                ref="dialogRef"
                role="dialog"
                aria-modal="true"
                aria-labelledby="compare-title"
                aria-describedby="compare-desc"
                class="compare-pop relative flex max-h-[calc(100dvh-0.75rem)] w-full max-w-[66rem] flex-col overflow-hidden rounded-t-2xl bg-white text-gray-800 antialiased shadow-[0_24px_80px_-20px_rgba(3,45,66,0.45)] sm:max-h-[calc(100dvh-3rem)] sm:rounded-2xl"
            >
                <header class="flex shrink-0 items-start gap-3 border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                            <h2 id="compare-title" class="text-[18px] font-bold leading-tight tracking-tight text-gray-900 sm:text-[19px]">
                                {{ bothSent ? 'Bandingkan kegiatan' : 'Detail kegiatan' }}
                            </h2>

                            <span
                                class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold"
                                :class="stateChipClass"
                                aria-live="polite"
                            >
                                <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                                {{ collabState.text }}
                            </span>
                        </div>

                        <p id="compare-desc" class="mt-1 max-w-[72ch] text-[12.5px] leading-relaxed text-gray-500">
                            {{ bothSent
                                ? 'Tinjau dua laporan, samakan anggaran dan lokasi, lalu setujui tiap pihak secara terpisah.'
                                : 'Baru satu pihak yang mengirim laporan. Perbandingan dan persetujuan terbuka setelah keduanya mengirim.' }}
                        </p>
                    </div>

                    <button
                        ref="closeRef"
                        type="button"
                        aria-label="Tutup perbandingan"
                        class="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        @click="close"
                    >
                        <i class="fas fa-xmark text-[16px]" aria-hidden="true"></i>
                    </button>
                </header>

                <div class="flex-1 overscroll-contain overflow-y-auto bg-gray-50/70 px-4 pb-6 sm:px-6">
                    <h3 class="pt-4 text-[20px] font-bold leading-tight tracking-tight text-gray-900 sm:pt-5 sm:text-[22px]">
                        {{ draft.title }}
                    </h3>

                    <section v-if="bothSent" aria-labelledby="same-heading" class="mt-5 rounded-2xl bg-sky-50/70 p-4 sm:p-5">
                        <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                            <div class="min-w-0">
                                <h4
                                    id="same-heading"
                                    ref="summaryRef"
                                    tabindex="-1"
                                    class="rounded text-[14px] font-bold tracking-tight text-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                >
                                    Samakan anggaran dan lokasi
                                </h4>
                                <p class="mt-0.5 max-w-[64ch] text-[12.5px] leading-relaxed text-sky-900/65">
                                    {{ diffFields.length
                                        ? 'Pilih nilai yang berlaku untuk kedua laporan sebelum persetujuan dibuka.'
                                        : 'Anggaran dan lokasi kedua laporan sudah memakai nilai yang sama.' }}
                                </p>
                            </div>

                            <span
                                class="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold"
                                :class="diffFields.length ? 'text-red-700' : 'text-green-700'"
                            >
                                <i :class="diffFields.length ? 'fas fa-triangle-exclamation' : 'fas fa-check'" class="text-[10px]" aria-hidden="true"></i>
                                {{ diffFields.length ? 'Perlu dipilih' : 'Selesai' }}
                            </span>
                        </div>

                        <template v-if="diffFields.length">
                            <fieldset v-for="field in diffFields" :key="field" class="mt-4">
                                <legend class="w-full">
                                    <span class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                                        <span class="text-[13px] font-semibold text-gray-800">{{ fieldLabel[field] }}</span>
                                        <span class="text-[12px] font-medium text-sky-700">{{ fieldDelta(field) }}</span>
                                    </span>
                                </legend>

                                <div class="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 sm:gap-3">
                                    <label
                                        v-for="key in ['jabar', 'brin']"
                                        :key="key"
                                        class="relative block cursor-pointer"
                                        :class="key === 'brin' ? 'order-3' : 'order-1'"
                                    >
                                        <input
                                            v-model="pick[field]"
                                            type="radio"
                                            class="peer sr-only"
                                            :name="`pick-${field}`"
                                            :value="key"
                                        >
                                        <span
                                            class="flex h-full flex-col gap-1 rounded-xl border px-3 py-3 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-600 sm:px-4"
                                            :class="cardClass(field, key)"
                                        >
                                            <span class="flex items-center justify-between gap-2">
                                                <span
                                                    class="inline-block rounded px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white"
                                                    :class="key === 'jabar' ? 'bg-sky-700' : 'bg-sky-500'"
                                                >
                                                    {{ TAG[key] }}
                                                </span>
                                                <span
                                                    class="grid h-5 w-5 place-items-center rounded-full border-[1.5px] transition-colors"
                                                    :class="pick[field] === key
                                                        ? 'border-sky-600 bg-sky-600 text-white'
                                                        : 'border-gray-300 bg-white text-transparent'"
                                                    aria-hidden="true"
                                                >
                                                    <i class="fas fa-check text-[10px]"></i>
                                                </span>
                                            </span>

                                            <span
                                                class="break-words text-[15px] font-bold leading-snug tracking-tight tabular-nums sm:text-[16px]"
                                                :class="pick[field] && pick[field] !== key
                                                    ? 'text-gray-400 line-through decoration-[1.5px]'
                                                    : 'text-gray-900'"
                                            >
                                                {{ fieldValue(field, draft[key]) }}
                                            </span>
                                            <span class="text-[12px] leading-relaxed text-gray-500">{{ fieldSub(field, draft[key]) }}</span>

                                            <span v-if="pick[field] === key" class="mt-0.5 text-[12px] font-semibold text-sky-700">
                                                Dipakai kedua laporan
                                            </span>
                                            <span v-else-if="pick[field]" class="mt-0.5 text-[12px] font-semibold text-gray-500">
                                                Akan diganti menjadi {{ fieldValue(field, draft[otherKey(key)]) }}
                                            </span>
                                        </span>
                                    </label>

                                    <span
                                        class="order-2 self-center justify-self-center text-[14px]"
                                        :class="pick[field] ? 'text-sky-600' : 'text-sky-600'"
                                        aria-hidden="true"
                                    >
                                        <i v-if="pick[field]" class="fas" :class="pick[field] === 'brin' ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                                        <i v-else class="fas fa-not-equal text-[12px]"></i>
                                    </span>
                                </div>
                            </fieldset>

                            <dl v-if="fixedRows.length" class="mt-4 grid gap-x-6 gap-y-1 border-t border-sky-200/70 pt-3 sm:grid-cols-2">
                                <div v-for="line in fixedRows" :key="line.label" class="flex flex-wrap gap-x-1.5 text-[12.5px] leading-relaxed">
                                    <dt class="text-sky-900/55">{{ line.label }}</dt>
                                    <dd class="font-semibold text-sky-900">{{ line.value }}</dd>
                                </div>
                            </dl>

                            <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sky-200/70 pt-4">
                                <p class="max-w-[60ch] text-[12.5px] leading-relaxed text-sky-900/65" aria-live="polite">
                                    {{ applyMessage }}
                                </p>
                                <button
                                    type="button"
                                    class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sky-700 px-3.5 text-[12.5px] font-bold text-white transition-colors hover:bg-sky-800 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                                    :disabled="diffFields.some((field) => !pick[field])"
                                    @click="applyPick"
                                >
                                    <i class="fas fa-check text-[10px]" aria-hidden="true"></i>
                                    Terapkan ke kedua laporan
                                </button>
                            </div>
                        </template>

                        <template v-else>
                            <dl class="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6">
                                <div>
                                    <dt class="text-[11.5px] font-medium text-sky-900/55">Anggaran berlaku</dt>
                                    <dd class="mt-0.5 text-[19px] font-bold tracking-tight tabular-nums text-gray-900">
                                        {{ rp(draft.jabar.anggaran) }}
                                    </dd>
                                    <dd class="mt-0.5 text-[12px] leading-relaxed text-sky-900/55">
                                        {{ draft.harmonized ? harmonizedSource('anggaran') : 'Sudah sama sejak awal' }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-[11.5px] font-medium text-sky-900/55">Lokasi berlaku</dt>
                                    <dd class="mt-0.5 text-[17px] font-bold leading-snug tracking-tight text-gray-900">
                                        {{ draft.jabar.lokasi }}
                                    </dd>
                                    <dd class="mt-0.5 text-[12px] leading-relaxed text-sky-900/55">
                                        {{ draft.harmonized ? harmonizedSource('lokasi') : 'Sudah sama sejak awal' }}
                                    </dd>
                                </div>
                            </dl>

                            <p v-if="draft.harmonized" class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-sky-200/70 pt-3 text-[12.5px] leading-relaxed text-sky-900/65">
                                <span>Disamakan oleh {{ draft.harmonized.by }} pada {{ fd(draft.harmonized.at) }}.</span>
                                <span v-if="anyApproved">Untuk mengubah pilihan, kembalikan laporan yang sudah disetujui ke proses.</span>
                                <button
                                    v-else
                                    type="button"
                                    class="rounded font-semibold text-sky-700 underline underline-offset-2 transition-colors hover:text-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                    @click="reopen"
                                >
                                    Ubah pilihan
                                </button>
                            </p>
                        </template>
                    </section>

                    <section aria-labelledby="detail-heading" class="mt-6">
                        <h4 id="detail-heading" class="mb-2 text-[14px] font-bold tracking-tight text-gray-900">Detail laporan</h4>

                        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <div class="sticky top-0 z-10 grid grid-cols-2 gap-3 border-b border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur-sm lg:grid-cols-[10.5rem_1fr_1fr] lg:px-5">
                                <span class="hidden text-[11px] font-semibold text-gray-400 lg:block">Bidang</span>

                                <div v-for="side in ['jabar', 'brin']" :key="side" class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                    <span
                                        class="inline-block rounded px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white"
                                        :class="side === 'jabar' ? 'bg-sky-700' : 'bg-sky-500'"
                                    >
                                        {{ TAG[side] }}
                                    </span>
                                    <span v-if="sent(draft[side])" class="inline-flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-semibold text-gray-800">
                                        <i class="fas text-[10px]" :class="[statusMeta(draft[side].status).icon, statusMeta(draft[side].status).tone]" aria-hidden="true"></i>
                                        {{ statusMeta(draft[side].status).label }}
                                    </span>
                                </div>
                            </div>

                            <div class="px-4 sm:px-5">
                                <section
                                    v-for="(group, index) in detailGroups"
                                    :key="group.title"
                                    class="pb-4"
                                    :class="index ? 'border-t border-gray-100 pt-4' : 'pt-4'"
                                >
                                    <h5 class="mb-1 text-[11.5px] font-semibold text-gray-500">{{ group.title }}</h5>

                                    <dl class="divide-y divide-gray-100">
                                        <div
                                            v-for="row in group.rows"
                                            :key="row.label"
                                            class="grid gap-1.5 py-2.5 lg:grid-cols-[10.5rem_1fr_1fr] lg:gap-3 lg:py-2"
                                        >
                                            <dt class="flex items-start gap-1.5 text-[12px] font-medium leading-snug lg:pt-1.5">
                                                <i v-if="row.variant === 'diff'" class="fas fa-not-equal mt-1 text-[9.5px] text-sky-600" aria-hidden="true"></i>
                                                <span :class="row.variant === 'diff' ? 'text-sky-800' : 'text-gray-500'">{{ row.label }}</span>
                                            </dt>

                                            <dd class="grid grid-cols-2 gap-2 lg:col-span-2 lg:gap-3">
                                                <div
                                                    v-for="side in ['jabar', 'brin']"
                                                    :key="side"
                                                    class="min-w-0 break-words rounded-lg px-2.5 py-1.5 text-[12.5px] leading-relaxed"
                                                    :class="cellClass(row, draft[side])"
                                                >
                                                    <template v-if="!sent(draft[side])">
                                                        <span class="italic text-gray-400">Belum dikirim</span>
                                                    </template>
                                                    <template v-else-if="row.progress">
                                                        <div class="flex items-center gap-2">
                                                            <div
                                                                class="h-1.5 flex-1 overflow-hidden rounded-full bg-sky-100"
                                                                role="progressbar"
                                                                :aria-label="`Progres ${NAME[side]}`"
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                                :aria-valuenow="draft[side].progress ?? 0"
                                                            >
                                                                <div class="h-full rounded-full bg-sky-600" :style="{ width: `${draft[side].progress ?? 0}%` }"></div>
                                                            </div>
                                                            <b class="text-[11.5px] font-bold tabular-nums text-sky-800">{{ draft[side].progress ?? 0 }}%</b>
                                                        </div>
                                                    </template>
                                                    <template v-else-if="row.value(draft[side])">
                                                        <span :class="row.money
                                                            ? ['font-semibold tabular-nums', row.variant === 'diff' ? 'text-sky-900' : 'text-gray-900']
                                                            : ''">{{ row.value(draft[side]) }}</span>
                                                    </template>
                                                    <span v-else class="italic text-gray-400">Belum ada</span>
                                                </div>
                                            </dd>
                                        </div>
                                    </dl>
                                </section>
                            </div>
                        </div>
                    </section>

                    <section aria-labelledby="approval-heading" class="mt-6">
                        <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <h4
                                id="approval-heading"
                                ref="approvalRef"
                                tabindex="-1"
                                class="rounded text-[14px] font-bold tracking-tight text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                            >
                                Persetujuan tiap pihak
                            </h4>
                            <span v-if="locked" class="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
                                <i class="fas fa-lock text-[9px]" aria-hidden="true"></i>
                                Terkunci
                            </span>
                        </div>

                        <p v-if="locked" class="mb-2.5 text-[12.5px] leading-relaxed text-gray-500">
                            {{ bothSent
                                ? 'Samakan anggaran dan lokasi dulu. Tombol setujui dan tolak terbuka setelah datanya sama.'
                                : 'Tombol setujui dan tolak terbuka setelah PIC kedua pihak mengirim kegiatan.' }}
                        </p>

                        <div class="grid divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                            <article v-for="side in ['jabar', 'brin']" :key="side" class="flex flex-col p-4 sm:p-5">
                                <header class="flex flex-wrap items-center justify-between gap-2">
                                    <span
                                        class="inline-block rounded px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white"
                                        :class="side === 'jabar' ? 'bg-sky-700' : 'bg-sky-500'"
                                    >
                                        {{ TAG[side] }}
                                    </span>
                                    <span v-if="sent(draft[side])" class="inline-flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-semibold text-gray-800">
                                        <i class="fas text-[10px]" :class="[statusMeta(draft[side].status).icon, statusMeta(draft[side].status).tone]" aria-hidden="true"></i>
                                        {{ statusMeta(draft[side].status).label }}
                                    </span>
                                </header>

                                <div class="mt-3 flex flex-1 flex-col gap-3">
                                    <p v-if="!sent(draft[side])" class="text-[12.5px] italic leading-relaxed text-gray-400">
                                        PIC {{ NAME[side] }} belum mengirim kegiatan ini ke admin.
                                    </p>

                                    <template v-else-if="rejecting === side">
                                        <div>
                                            <label :for="`reason-${side}`" class="mb-1.5 block text-[12.5px] font-semibold text-gray-600">
                                                Catatan untuk PIC {{ NAME[side] }}
                                            </label>
                                            <textarea
                                                :id="`reason-${side}`"
                                                v-model="reason"
                                                rows="3"
                                                placeholder="Jelaskan bagian yang perlu diperbaiki"
                                                :aria-invalid="reasonErr"
                                                :aria-describedby="reasonErr ? `reason-error-${side}` : undefined"
                                                class="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] leading-relaxed outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            ></textarea>
                                            <p v-if="reasonErr" :id="`reason-error-${side}`" role="alert" class="mt-1 text-[12px] font-medium text-red-700">
                                                Isi catatan agar PIC tahu apa yang harus diperbaiki.
                                            </p>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                class="inline-flex h-9 items-center rounded-lg border border-red-200 bg-white px-3 text-[12.5px] font-bold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                                                @click="sendReject"
                                            >
                                                Tolak laporan
                                            </button>
                                            <button
                                                type="button"
                                                class="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-[12.5px] font-bold text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                                @click="cancelReject"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </template>

                                    <div v-else-if="draft[side].status === 'proses'" class="mt-auto flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sky-700 px-3 text-[12.5px] font-bold text-white transition-colors hover:bg-sky-800 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                            :disabled="locked"
                                            @click="approve(side)"
                                        >
                                            <i class="fas fa-check text-[10px]" aria-hidden="true"></i>
                                            Setujui {{ NAME[side] }}
                                        </button>
                                        <button
                                            :id="`reject-${side}`"
                                            type="button"
                                            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-[12.5px] font-bold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white"
                                            :disabled="locked"
                                            @click="startReject(side)"
                                        >
                                            <i class="fas fa-xmark text-[10px]" aria-hidden="true"></i>
                                            Tolak
                                        </button>
                                    </div>

                                    <template v-else-if="draft[side].status === 'disetujui'">
                                        <div class="flex gap-2 text-[12.5px] leading-relaxed text-green-800">
                                            <i class="fas fa-circle-check mt-0.5 text-[12px]" aria-hidden="true"></i>
                                            <p>
                                                <b class="font-bold">Disetujui dan tampil di dashboard publik.</b>
                                                Persetujuan pihak lain tidak terpengaruh.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            class="mt-auto self-start rounded text-[12.5px] font-semibold text-sky-700 underline underline-offset-2 transition-colors hover:text-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                            @click="revert(side)"
                                        >
                                            Kembalikan ke proses
                                        </button>
                                    </template>

                                    <template v-else-if="draft[side].status === 'ditolak'">
                                        <div class="flex gap-2 text-[12.5px] leading-relaxed text-red-800">
                                            <i class="fas fa-circle-xmark mt-0.5 text-[12px]" aria-hidden="true"></i>
                                            <p>
                                                <b class="font-bold">Dikembalikan ke PIC dengan catatan.</b>
                                                {{ draft[side].catatan }}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            class="mt-auto self-start rounded text-[12.5px] font-semibold text-sky-700 underline underline-offset-2 transition-colors hover:text-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                            @click="revert(side)"
                                        >
                                            Batalkan penolakan
                                        </button>
                                    </template>
                                </div>
                            </article>
                        </div>
                    </section>
                </div>

                <footer class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <p class="flex items-start gap-2 text-[12px] leading-relaxed text-gray-500">
                        <i class="fas fa-circle-info mt-0.5 text-[11px] text-sky-500" aria-hidden="true"></i>
                        <span>Anggaran dan lokasi dipakai bersama. Persetujuan laporan tetap terpisah untuk tiap pihak.</span>
                    </p>
                    <button
                        type="button"
                        class="inline-flex h-9 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-[12.5px] font-bold text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:w-auto"
                        @click="close"
                    >
                        Tutup
                    </button>
                </footer>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
    @keyframes compare-pop {
        from {
            opacity: 0;
            transform: translateY(10px) scale(0.985);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }

    .compare-pop {
        animation: compare-pop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @media (prefers-reduced-motion: reduce) {
        .compare-pop {
            animation: none;
        }
    }
</style>

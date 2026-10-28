<script setup>
    import { computed, useAttrs } from 'vue';

    defineOptions({ inheritAttrs: false });

    const props = defineProps({
        icon: { type: String, default: null },
        title: { type: String, default: 'Title' },
        type: { type: String, default: 'text' },
        name: { type: String, default: 'name' },
        length: { type: [Number, String], default: 255 },
        placeholder: { type: String, default: 'Placeholder' },
        message: { type: String, default: null },
        required: { type: Boolean, default: false }
    });

    const model = defineModel({ type: [String, Number], default: '' });

    const attrs = useAttrs();
    const inputId = computed(() => attrs.id ?? props.name);
</script>

<template>
    <div class="flex flex-col gap-2">
        <label :for="inputId" class="text-[11.5px] font-bold text-sky-800 uppercase tracking-wide flex items-center gap-2">
            <i v-if="icon" :class="['fas', icon]" class="text-sky-500 text-xs"></i>
            {{ title }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <input
            v-model="model"
            v-bind="$attrs"
            :id="inputId"
            :type="type"
            :name="name"
            :maxlength="length"
            :placeholder="placeholder"
            :required="required"
            autocomplete="off"
            class="w-full text-sm font-medium px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-sky-200 bg-white outline-none transition-all hover:border-sky-400 focus:border-sky-500"
        />
        <span v-if="message" class="text-xs text-slate-400 font-medium">{{ message }}</span>
    </div>
</template>

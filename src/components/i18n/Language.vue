<template>
    <div>
      <select v-model="currentLanguage" @change="changeLanguage">
        <option value="en" :selected="locale === 'en'">English</option>
        <option value="vi" :selected="locale === 'vi'">Tiếng Việt</option>
      </select>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref , watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import eventBus from '@/eventbus/eventBus';

  
  const { t, locale } = useI18n();
  console.log(locale.value)
  const language = ref(localStorage.getItem('language') || 'en'); 
  const currentLanguage = ref(language.value !== undefined ? language.value :locale.value);

  const changeLanguage = () => {
    locale.value = currentLanguage.value;
    localStorage.setItem('language', currentLanguage.value);
    eventBus.emit('languageChanged', currentLanguage.value); 

  };
  
  locale.value = localStorage.getItem('language') || 'en';
  
watch(locale, (newValue) => {
  currentLanguage.value = newValue; 
});


  </script>
  
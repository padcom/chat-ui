import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'

config.global.plugins = [
  createI18n({}),
]

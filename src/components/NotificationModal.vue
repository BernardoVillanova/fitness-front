<template>
  <Transition name="modal-fade">
    <div v-if="visible" class="notification-overlay" @click="close">
      <div class="notification-modal" :class="typeClass" @click.stop>
        <div class="modal-icon">
          <font-awesome-icon :icon="iconConfig.icon" :class="iconConfig.class" />
        </div>
        <div class="modal-content">
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>
        </div>
        <button class="modal-close" @click="close">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
/* eslint-disable no-undef */
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'update:visible'])

const typeClass = computed(() => `modal-${props.type}`)

const iconConfig = computed(() => {
  const configs = {
    success: { icon: ['fas', 'check-circle'], class: 'icon-success' },
    error: { icon: ['fas', 'xmark'], class: 'icon-error' },
    warning: { icon: ['fas', 'exclamation-triangle'], class: 'icon-warning' },
    info: { icon: ['fas', 'info-circle'], class: 'icon-info' }
  }
  return configs[props.type] || configs.info
})

const close = () => {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  font-family: "Inter", sans-serif;
}

.notification-modal {
  position: relative;
  background: var(--card-bg);
  border-radius: 20px;
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-modal,
.notification-modal * {
  font-family: "Inter", sans-serif !important;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.75rem;
  position: relative;
  overflow: hidden;
}

.modal-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.15;
}

.modal-success .modal-icon::before {
  background: #10b981;
}

.modal-error .modal-icon::before {
  background: #ef4444;
}

.modal-warning .modal-icon::before {
  background: #f59e0b;
}

.modal-info .modal-icon::before {
  background: #3b82f6;
}

.icon-success {
  color: #10b981;
  filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3));
}

.icon-error {
  color: #ef4444;
  filter: drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3));
}

.icon-warning {
  color: #f59e0b;
  filter: drop-shadow(0 4px 8px rgba(245, 158, 11, 0.3));
}

.icon-info {
  color: #3b82f6;
  filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
}

.modal-content {
  flex: 1;
  min-width: 0;
}

.modal-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
}

.modal-message {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  font-size: 0.875rem;
}

.modal-close:hover {
  color: #ef4444;
}

@media (max-width: 480px) {
  .notification-modal {
    padding: 1.5rem;
    gap: 1rem;
  }

  .modal-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-message {
    font-size: 0.875rem;
  }
}
</style>

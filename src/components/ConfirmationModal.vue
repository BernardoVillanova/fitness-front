<template>
  <div v-if="show" class="confirmation-overlay" @click="handleOverlayClick">
    <div :class="isDarkMode ? 'modal-dark' : 'modal-light'" class="confirmation-modal" @click.stop>
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <div class="icon-wrapper" :class="iconType">
            <svg v-if="iconType === 'warning'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <svg v-else-if="iconType === 'danger'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <svg v-else-if="iconType === 'success'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <h3 class="modal-title">{{ title }}</h3>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="modal-body">
          <p class="message" v-html="message"></p>
          
          <!-- Input para confirmação por texto -->
          <div v-if="requireTextConfirmation" class="text-confirmation">
            <label class="confirmation-label">
              Digite "<strong>{{ confirmationText }}</strong>" para confirmar:
            </label>
            <input 
              v-model="userInput" 
              type="text" 
              class="confirmation-input"
              :placeholder="confirmationText"
              @keyup.enter="confirm"
              ref="confirmationInput"
            >
            <div v-if="showError" class="error-message">
              ❌ Texto incorreto. Digite exatamente "{{ confirmationText }}"
            </div>
          </div>

          <!-- Lista de detalhes -->
          <div v-if="details && details.length" class="details-list">
            <h4 class="details-title">Detalhes:</h4>
            <ul class="details-items">
              <li v-for="detail in details" :key="detail.label" class="detail-item">
                <span class="detail-label">{{ detail.label }}:</span>
                <span class="detail-value">{{ detail.value }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button 
            class="btn btn-secondary" 
            @click="close"
            :disabled="loading"
          >
            {{ cancelText || 'Cancelar' }}
          </button>
          <button 
            class="btn btn-primary" 
            :class="buttonClass"
            @click="confirm"
            :disabled="isConfirmDisabled || loading"
          >
            <div v-if="loading" class="spinner"></div>
            {{ confirmText || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  name: 'ConfirmationModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    iconType: {
      type: String,
      default: 'info', // warning, danger, success, info
      validator: value => ['warning', 'danger', 'success', 'info'].includes(value)
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    },
    buttonClass: {
      type: String,
      default: 'btn-danger'
    },
    requireTextConfirmation: {
      type: Boolean,
      default: false
    },
    confirmationText: {
      type: String,
      default: 'EXCLUIR'
    },
    details: {
      type: Array,
      default: () => []
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  data() {
    return {
      userInput: '',
      showError: false,
      loading: false
    }
  },
  computed: {
    isConfirmDisabled() {
      if (this.requireTextConfirmation) {
        return this.userInput !== this.confirmationText;
      }
      return false;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.userInput = '';
        this.showError = false;
        this.loading = false;
        this.$nextTick(() => {
          if (this.requireTextConfirmation && this.$refs.confirmationInput) {
            this.$refs.confirmationInput.focus();
          }
        });
      }
    },
    userInput() {
      this.showError = false;
    }
  },
  methods: {
    close() {
      if (!this.loading) {
        this.$emit('close');
      }
    },
    
    async confirm() {
      if (this.isConfirmDisabled) {
        this.showError = true;
        return;
      }
      
      this.loading = true;
      try {
        await this.$emit('confirm');
      } finally {
        this.loading = false;
      }
    },
    
    handleOverlayClick() {
      if (this.closeOnOverlayClick) {
        this.close();
      }
    }
  }
}
</script>

<style scoped>
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.confirmation-modal {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

/* Theme Variables */
.modal-light {
  --card-bg: #ffffff;
  --text-color: #0f172a;
  --text-muted: #64748b;
  --text-secondary: #475569;
  --border-color: #e2e8f0;
  --bg-secondary: #f8fafc;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.modal-dark {
  --card-bg: #1e1e2d;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --text-secondary: #6b7280;
  --border-color: #2d2d3f;
  --bg-secondary: #171723;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.modal-content {
  padding: 0;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 24px 20px;
  border-bottom: 1px solid var(--border-color);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper.warning {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.icon-wrapper.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.icon-wrapper.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.icon-wrapper.info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.modal-title {
  flex: 1;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.close-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 14px;
}

.close-btn:hover {
  background: var(--border-color);
  color: var(--text-color);
}

.modal-body {
  padding: 20px 24px;
}

.message {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 20px 0;
  white-space: pre-line;
}

.text-confirmation {
  margin: 20px 0;
}

.confirmation-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.confirmation-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--card-bg);
  color: var(--text-color);
  transition: all 0.2s ease;
}

.confirmation-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.error-message {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #ef4444;
  font-weight: 500;
}

.details-list {
  margin: 20px 0;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.details-title {
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.details-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: var(--text-muted);
}

.detail-value {
  font-weight: 600;
  color: var(--text-color);
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 20px 24px 24px;
  border-top: 1px solid var(--border-color);
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--border-color);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .confirmation-overlay {
    padding: 16px;
  }
  
  .modal-header {
    padding: 20px 20px 16px;
  }
  
  .modal-body {
    padding: 16px 20px;
  }
  
  .modal-actions {
    flex-direction: column;
    padding: 16px 20px 20px;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .icon-wrapper {
    width: 40px;
    height: 40px;
  }
}
</style>
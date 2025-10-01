<template>
  <div class="empty-state" :class="{ 'dark-mode': isDarkMode }">
    <div class="empty-icon">
      <i :class="icon || 'fas fa-inbox'"></i>
    </div>
    <h3 class="empty-title">{{ title || 'Nenhum dado disponível' }}</h3>
    <p class="empty-message">{{ message || 'Não há informações para exibir no momento.' }}</p>
    
    <button 
      v-if="actionLabel" 
      @click="$emit('action')" 
      class="empty-action"
    >
      <i v-if="actionIcon" :class="actionIcon"></i>
      <span>{{ actionLabel }}</span>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useThemeStore } from '@/store/theme';

export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: 'fas fa-inbox'
    },
    title: {
      type: String,
      default: 'Nenhum dado disponível'
    },
    message: {
      type: String,
      default: 'Não há informações para exibir no momento.'
    },
    actionLabel: {
      type: String,
      default: ''
    },
    actionIcon: {
      type: String,
      default: ''
    }
  },
  emits: ['action'],
  setup() {
    const themeStore = useThemeStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);
    
    return {
      isDarkMode
    };
  }
};
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-state.dark-mode {
  background: rgba(30, 30, 46, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(0, 86, 179, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.dark-mode .empty-icon {
  background: linear-gradient(135deg, rgba(100, 65, 165, 0.15) 0%, rgba(139, 95, 217, 0.15) 100%);
}

.empty-icon i {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.6;
}

.dark-mode .empty-icon i {
  background: linear-gradient(135deg, #6441a5 0%, #8b5fd9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state:hover .empty-icon {
  transform: scale(1.05);
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.dark-mode .empty-title {
  color: #f1f5f9;
}

.empty-message {
  font-size: 1.05rem;
  color: #64748b;
  margin: 0 0 2rem 0;
  max-width: 400px;
  line-height: 1.6;
}

.dark-mode .empty-message {
  color: #94a3b8;
}

.empty-action {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
}

.dark-mode .empty-action {
  background: linear-gradient(135deg, #6441a5 0%, #8b5fd9 100%);
  box-shadow: 0 4px 16px rgba(100, 65, 165, 0.3);
}

.empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.4);
}

.dark-mode .empty-action:hover {
  box-shadow: 0 8px 24px rgba(100, 65, 165, 0.4);
}

.empty-action i {
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .empty-state {
    padding: 3rem 1.5rem;
    border-radius: 16px;
  }
  
  .empty-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 1.5rem;
  }
  
  .empty-icon i {
    font-size: 3rem;
  }
  
  .empty-title {
    font-size: 1.25rem;
  }
  
  .empty-message {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .empty-action {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    width: 80px;
    height: 80px;
  }
  
  .empty-icon i {
    font-size: 2.5rem;
  }
  
  .empty-title {
    font-size: 1.15rem;
  }
  
  .empty-message {
    font-size: 0.95rem;
  }
}
</style>

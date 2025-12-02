<template>
  <section class="clean-filter-section">
    <div class="clean-filter-container">
      <!-- Categories Grid -->
      <div class="clean-categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          :class="['clean-category-card', { 'card-selected': selectedCategory === category.id }]"
          @click="selectCategory(category.id)"
        >
          <div class="category-icon-clean">
            <i :class="category.icon"></i>
          </div>
          <div class="category-content-clean">
            <h3 class="category-title-clean">{{ category.name }}</h3>
            <span class="category-count-clean">{{ category.count }} {{ itemLabel }}</span>
          </div>
          <div class="category-arrow-clean" v-if="selectedCategory === category.id">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="results-section-clean" v-if="selectedCategory && selectedCategory !== 'todos'">
        <div class="results-info-wrapper">
          <div class="results-badge-clean">
            <div class="results-icon-clean">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            </div>
            <span class="results-text-clean">
              {{ filteredCount }} {{ itemLabel }} encontrado{{ filteredCount !== 1 ? 's' : '' }}
            </span>
            <span class="active-filter-chip">{{ getSelectedCategoryName() }}</span>
          </div>
        </div>
        <div class="results-actions-clean">
          <button class="clear-filters-btn" @click="clearFilters">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CategoryFilter',
  props: {
    categories: {
      type: Array,
      required: true,
     
    },
    selectedCategory: {
      type: String,
      default: null
    },
    filteredCount: {
      type: Number,
      required: true
    },
    itemLabel: {
      type: String,
      default: 'itens'
     
    }
  },
  emits: ['category-selected', 'clear-filters'],
  methods: {
    selectCategory(categoryId) {
      this.$emit('category-selected', categoryId);
    },
    clearFilters() {
      this.$emit('clear-filters');
    },
    getSelectedCategoryName() {
      const category = this.categories.find(cat => cat.id === this.selectedCategory);
      return category ? category.name : '';
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

.clean-filter-section {
  margin-bottom: 32px;
  font-family: "Inter", sans-serif;
}

.clean-filter-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.clean-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.clean-category-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.clean-category-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
  box-shadow: var(--shadow);
}

.card-selected {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.category-icon-clean {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.card-selected .category-icon-clean {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.category-content-clean {
  flex: 1;
}

.category-title-clean {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.card-selected .category-title-clean {
  color: white;
}

.category-count-clean {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.card-selected .category-count-clean {
  color: rgba(255, 255, 255, 0.8);
}

.category-arrow-clean {
  width: 20px;
  height: 20px;
  color: white;
}

.category-arrow-clean svg {
  width: 100%;
  height: 100%;
}

/* Results Section */
.results-section-clean {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px 24px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-info-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.results-badge-clean {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 10px;
}

.results-icon-clean {
  width: 20px;
  height: 20px;
  color: var(--primary-color);
}

.results-icon-clean svg {
  width: 100%;
  height: 100%;
}

.results-text-clean {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.active-filter-chip {
  padding: 4px 12px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.results-actions-clean {
  display: flex;
  gap: 12px;
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn svg {
  width: 16px;
  height: 16px;
}

.clear-filters-btn:hover {
  border-color: var(--error);
  color: var(--error);
  background: rgba(239, 68, 68, 0.1);
  transform: translateX(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .clean-categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .clean-category-card {
    padding: 16px;
  }

  .category-icon-clean {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }

  .results-section-clean {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .results-info-wrapper {
    width: 100%;
  }

  .results-badge-clean {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .clean-categories-grid {
    grid-template-columns: 1fr;
  }

  .category-title-clean {
    font-size: 0.875rem;
  }

  .category-count-clean {
    font-size: 0.75rem;
  }
}
</style>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Editar' : 'Criar' }} Plano de Exercícios</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="savePlan" class="modal-form">
        <!-- Nome do Plano -->
        <div class="form-group">
          <label class="form-label">Nome do Plano *</label>
          <input 
            v-model="formData.name" 
            type="text" 
            required 
            class="form-input"
            placeholder="Ex: Hipertrofia Iniciante"
          >
        </div>

        <!-- Divisões de Treino -->
        <div class="divisions-section">
          <div class="section-header">
            <h3>Divisões de Treino</h3>
            <button 
              type="button" 
              @click="addDivision" 
              class="add-btn"
            >
              + Adicionar Divisão
            </button>
          </div>

          <div 
            v-for="(division, divisionIndex) in formData.divisions" 
            :key="divisionIndex"
            class="division-card"
          >
            <div class="division-header">
              <div class="form-group division-name">
                <label class="form-label">Nome da Divisão *</label>
                <input 
                  v-model="division.name" 
                  type="text" 
                  required 
                  class="form-input"
                  placeholder="Ex: Treino A - Peito/Tríceps"
                >
              </div>
              <button 
                type="button" 
                @click="removeDivision(divisionIndex)"
                class="remove-btn"
                :disabled="formData.divisions.length === 1"
              >
                🗑️
              </button>
            </div>

            <!-- Exercícios da Divisão -->
            <div class="exercises-section">
              <div class="exercises-header">
                <h4>Exercícios</h4>
                <button 
                  type="button" 
                  @click="addExercise(divisionIndex)" 
                  class="add-exercise-btn"
                >
                  + Adicionar Exercício
                </button>
              </div>

              <div 
                v-for="(exercise, exerciseIndex) in division.exercises" 
                :key="exerciseIndex"
                class="exercise-card"
              >
                <div class="exercise-header">
                  <div class="form-group exercise-name">
                    <label class="form-label">Nome do Exercício *</label>
                    <input 
                      v-model="exercise.name" 
                      type="text" 
                      required 
                      class="form-input"
                      placeholder="Ex: Supino Reto"
                    >
                  </div>
                  <button 
                    type="button" 
                    @click="removeExercise(divisionIndex, exerciseIndex)"
                    class="remove-exercise-btn"
                    :disabled="division.exercises.length === 1"
                  >
                    ✕
                  </button>
                </div>

                <div class="form-group">
                  <label class="form-label">Descrição</label>
                  <textarea 
                    v-model="exercise.description" 
                    class="form-textarea"
                    rows="2"
                    placeholder="Descrição detalhada da execução..."
                  ></textarea>
                </div>

                <div class="exercise-details">
                  <div class="form-group">
                    <label class="form-label">Séries *</label>
                    <input 
                      v-model.number="exercise.sets" 
                      type="number" 
                      min="1" 
                      max="10"
                      required 
                      class="form-input"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Repetições *</label>
                    <input 
                      v-model.number="exercise.reps" 
                      type="number" 
                      min="1" 
                      max="100"
                      required 
                      class="form-input"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Peso Ideal (kg) *</label>
                    <input 
                      v-model.number="exercise.idealWeight" 
                      type="number" 
                      min="0" 
                      step="0.5"
                      required 
                      class="form-input"
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">URL da Imagem</label>
                  <input 
                    v-model="exercise.image" 
                    type="url" 
                    class="form-input"
                    placeholder="https://exemplo.com/imagem.jpg"
                  >
                  <div v-if="exercise.image" class="image-preview">
                    <img :src="exercise.image" alt="Preview" @error="handleImageError">
                  </div>
                </div>
              </div>

              <div v-if="division.exercises.length === 0" class="no-exercises">
                <p>Nenhum exercício adicionado ainda.</p>
                <button type="button" @click="addExercise(divisionIndex)" class="add-first-exercise-btn">
                  Adicionar Primeiro Exercício
                </button>
              </div>
            </div>
          </div>

          <div v-if="formData.divisions.length === 0" class="no-divisions">
            <p>Nenhuma divisão criada ainda.</p>
            <button type="button" @click="addDivision" class="add-first-division-btn">
              Criar Primeira Divisão
            </button>
          </div>
        </div>

        <!-- Ações do Modal -->
        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-save" :disabled="!isFormValid">
            {{ isEditing ? 'Salvar Alterações' : 'Criar Plano' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkoutPlanModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    planData: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      formData: {
        name: '',
        divisions: []
      }
    }
  },
  computed: {
    isFormValid() {
      if (!this.formData.name.trim()) return false;
      if (this.formData.divisions.length === 0) return false;
      
      return this.formData.divisions.every(division => {
        if (!division.name.trim()) return false;
        if (division.exercises.length === 0) return false;
        
        return division.exercises.every(exercise => {
          return exercise.name.trim() && 
                 exercise.sets > 0 && 
                 exercise.reps > 0 && 
                 exercise.idealWeight >= 0;
        });
      });
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initializeForm();
      }
    },
    planData: {
      handler() {
        if (this.show) {
          this.initializeForm();
        }
      },
      deep: true
    }
  },
  methods: {
    initializeForm() {
      if (this.planData && this.isEditing) {
        // Clonar dados para edição
        this.formData = JSON.parse(JSON.stringify(this.planData));
      } else if (this.planData && !this.isEditing) {
        // Para duplicar plano
        const duplicatedPlan = JSON.parse(JSON.stringify(this.planData));
        delete duplicatedPlan._id;
        duplicatedPlan.divisions.forEach(division => {
          delete division._id;
          division.exercises.forEach(exercise => {
            delete exercise._id;
          });
        });
        this.formData = duplicatedPlan;
      } else {
        // Novo plano
        this.formData = {
          name: '',
          divisions: [{
            name: '',
            exercises: [{
              name: '',
              description: '',
              image: '',
              sets: 3,
              reps: 12,
              idealWeight: 0
            }]
          }]
        };
      }
    },

    addDivision() {
      this.formData.divisions.push({
        name: '',
        exercises: [{
          name: '',
          description: '',
          image: '',
          sets: 3,
          reps: 12,
          idealWeight: 0
        }]
      });
    },

    removeDivision(index) {
      if (this.formData.divisions.length > 1) {
        this.formData.divisions.splice(index, 1);
      }
    },

    addExercise(divisionIndex) {
      this.formData.divisions[divisionIndex].exercises.push({
        name: '',
        description: '',
        image: '',
        sets: 3,
        reps: 12,
        idealWeight: 0
      });
    },

    removeExercise(divisionIndex, exerciseIndex) {
      const division = this.formData.divisions[divisionIndex];
      if (division.exercises.length > 1) {
        division.exercises.splice(exerciseIndex, 1);
      }
    },

    handleImageError(event) {
      event.target.style.display = 'none';
    },

    savePlan() {
      if (this.isFormValid) {
        this.$emit('save', { ...this.formData });
      }
    },

    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--card-bg, #ffffff);
  color: var(--text-color, #333);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid var(--border-color, #e9ecef);
  background: linear-gradient(135deg, var(--primary-color, #007bff), var(--primary-color, #007bff)aa);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.close-btn:hover {
  opacity: 1;
}

.modal-form {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color, #333);
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color, #e9ecef);
  border-radius: 8px;
  background: var(--card-bg, #ffffff);
  color: var(--text-color, #333);
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color, #007bff);
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

/* Sections */
.divisions-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-color, #e9ecef);
}

.section-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color, #333);
}

.add-btn {
  background: var(--primary-color, #007bff);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Division Cards */
.division-card {
  background: var(--card-bg, #f8f9fa);
  border: 2px solid var(--border-color, #e9ecef);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
}

.division-header {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  margin-bottom: 20px;
}

.division-name {
  flex: 1;
  margin-bottom: 0;
}

.remove-btn {
  background: var(--danger-color, #dc3545);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  height: fit-content;
}

.remove-btn:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Exercises */
.exercises-section {
  margin-top: 15px;
}

.exercises-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.exercises-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color, #333);
}

.add-exercise-btn {
  background: var(--success-color, #28a745);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-exercise-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

.exercise-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #dee2e6);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 15px;
}

.exercise-header {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  margin-bottom: 15px;
}

.exercise-name {
  flex: 1;
  margin-bottom: 0;
}

.remove-exercise-btn {
  background: var(--danger-color, #dc3545);
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  height: fit-content;
}

.remove-exercise-btn:hover:not(:disabled) {
  background: #c82333;
}

.remove-exercise-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.exercise-details {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.image-preview {
  margin-top: 10px;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  border: 2px solid var(--border-color, #e9ecef);
}

/* Empty States */
.no-exercises,
.no-divisions {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-color, #6c757d);
}

.no-exercises p,
.no-divisions p {
  margin-bottom: 15px;
  font-size: 1rem;
}

.add-first-exercise-btn,
.add-first-division-btn {
  background: var(--primary-color, #007bff);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-first-exercise-btn:hover,
.add-first-division-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding: 24px 32px;
  border-top: 2px solid var(--border-color, #e9ecef);
  background: var(--card-bg, #f8f9fa);
}

.btn-cancel,
.btn-save {
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-cancel {
  background: transparent;
  color: var(--secondary-color, #6c757d);
  border: 2px solid var(--secondary-color, #6c757d);
}

.btn-cancel:hover {
  background: var(--secondary-color, #6c757d);
  color: white;
}

.btn-save {
  background: var(--primary-color, #007bff);
  color: white;
  border: 2px solid var(--primary-color, #007bff);
}

.btn-save:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    margin: 10px;
  }
  
  .modal-form {
    padding: 20px;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .exercise-details {
    grid-template-columns: 1fr;
  }
  
  .division-header,
  .exercise-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .division-name,
  .exercise-name {
    width: 100%;
  }
  
  .modal-actions {
    flex-direction: column;
    padding: 20px;
  }
  
  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}
</style>
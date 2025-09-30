<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ student ? 'Editar Aluno' : 'Novo Aluno' }}</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="form-grid">
          <div class="form-section">
            <h3>Informações Pessoais</h3>
            
            <div class="form-group">
              <label>Peso (kg)</label>
              <input 
                type="number" 
                v-model="form.personalInfo.weight"
                step="0.1"
                min="0"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Altura (cm)</label>
              <input 
                type="number" 
                v-model="form.personalInfo.height"
                step="1"
                min="0"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Experiência</label>
              <select v-model="form.personalInfo.trainingExperience" required class="form-select">
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
                <option value="atleta">Atleta</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>Localização</h3>
            
            <div class="form-group">
              <label>Cidade</label>
              <input 
                type="text" 
                v-model="form.personalInfo.location.city"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Bairro</label>
              <input 
                type="text" 
                v-model="form.personalInfo.location.neighborhood"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>Restrições de Saúde</h3>
            
            <div class="form-group">
              <label>Condições Crônicas</label>
              <textarea 
                v-model="form.healthRestrictions.chronicConditions"
                placeholder="Descreva condições crônicas, se houver"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Medicamentos</label>
              <textarea 
                v-model="form.healthRestrictions.medications"
                placeholder="Liste medicamentos em uso, se houver"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group checkbox">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="form.healthRestrictions.medicalAuthorization"
                  class="checkbox-input"
                >
                <span>Possui autorização médica para prática de exercícios</span>
              </label>
            </div>
          </div>

          <div class="form-section">
            <h3>Status e Objetivos</h3>
            
            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status" required class="form-select">
                <option value="active">Ativo</option>
                <option value="paused">Em Pausa</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div class="form-group">
              <label>Objetivos</label>
              <textarea 
                v-model="form.goals"
                placeholder="Descreva os objetivos do aluno"
                required
                class="form-textarea"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            {{ student ? 'Atualizar' : 'Cadastrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<!-- eslint-disable no-undef -->
<script setup>
import { ref, onMounted } from 'vue'
import { createStudent, updateStudent } from '@/api'

const props = defineProps({
  student: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  personalInfo: {
    weight: 0,
    height: 0,
    trainingExperience: 'iniciante',
    location: {
      city: '',
      neighborhood: ''
    }
  },
  healthRestrictions: {
    chronicConditions: '',
    medications: '',
    medicalAuthorization: false
  },
  status: 'active',
  goals: ''
})

const handleSubmit = async () => {
  try {
    const data = { ...form.value }
    
    // Converter para arrays
    data.healthRestrictions.chronicConditions = data.healthRestrictions.chronicConditions
      .split('\n')
      .filter(item => item.trim())
    
    data.healthRestrictions.medications = data.healthRestrictions.medications
      .split('\n')
      .filter(item => item.trim())
    
    data.goals = [{
      description: data.goals,
      targetValue: 0
    }]

    if (props.student) {
      await updateStudent(props.student._id, data)
      console.log('Aluno atualizado com sucesso')
    } else {
      await createStudent(data)
      console.log('Aluno cadastrado com sucesso')
    }

    emit('save')
  } catch (error) {
    console.error('Erro ao salvar aluno:', error)
  }
}

onMounted(() => {
  if (props.student) {
    // Preencher formulário com dados do aluno
    form.value = {
      personalInfo: {
        weight: props.student.personalInfo?.weight || 0,
        height: props.student.personalInfo?.height || 0,
        trainingExperience: props.student.personalInfo?.trainingExperience || 'iniciante',
        location: {
          city: props.student.personalInfo?.location?.city || '',
          neighborhood: props.student.personalInfo?.location?.neighborhood || ''
        }
      },
      healthRestrictions: {
        chronicConditions: (props.student.healthRestrictions?.chronicConditions || []).join('\n'),
        medications: (props.student.healthRestrictions?.medications || []).join('\n'),
        medicalAuthorization: props.student.healthRestrictions?.medicalAuthorization || false
      },
      status: props.student.status || 'active',
      goals: props.student.goals?.[0]?.description || ''
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-color, #ffffff);
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: var(--highlight-color, #007bff);
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: var(--highlight-color, #007bff);
  background: #f3f4f6;
}

.form-container {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section h3 {
  margin: 0 0 1.5rem;
  color: var(--text-color, #333);
  font-size: 1.1rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color, #333);
  font-size: 0.875rem;
  font-weight: 500;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #333);
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--highlight-color, #007bff);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex !important;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.checkbox-input {
  width: auto !important;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--button-color, #007bff);
  color: white;
}

.btn-primary:hover {
  background: var(--button-hover-color, #0056b3);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  border: 1px solid #d1d5db;
  color: var(--text-color, #333);
}

.btn-secondary:hover {
  border-color: var(--highlight-color, #007bff);
  color: var(--highlight-color, #007bff);
}

/* Dark mode styles */
.dark-mode .modal-content {
  background: var(--bg-color, #1a1a1a);
  color: var(--text-color, #f4f4f4);
}

.dark-mode .modal-header {
  border-color: #374151;
}

.dark-mode .form-section {
  background: #111827;
  border-color: #374151;
}

.dark-mode .form-input,
.dark-mode .form-select,
.dark-mode .form-textarea {
  background: #1f2937;
  border-color: #374151;
  color: var(--text-color, #f4f4f4);
}

.dark-mode .form-actions {
  border-color: #374151;
}

.dark-mode .btn-secondary {
  border-color: #374151;
  color: var(--text-color, #f4f4f4);
}
</style>
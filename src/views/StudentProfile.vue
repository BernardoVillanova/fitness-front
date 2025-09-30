<template>
  <div class="student-profile">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-user"></i>
        Meu Perfil
      </h1>
      <p class="page-subtitle">Gerencie suas informações pessoais</p>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="studentData.avatar" :alt="studentData.name" class="avatar-image" />
            <button class="avatar-edit-btn">
              <i class="fas fa-camera"></i>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-section">
            <h3>Informações Pessoais</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Nome Completo</label>
                <input v-model="studentData.name" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="studentData.email" type="email" class="form-input" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Telefone</label>
                <input v-model="studentData.phone" type="tel" class="form-input">
              </div>
              <div class="form-group">
                <label>Data de Nascimento</label>
                <input v-model="studentData.birthDate" type="date" class="form-input">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Informações Físicas</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Altura (cm)</label>
                <input v-model="studentData.height" type="number" class="form-input">
              </div>
              <div class="form-group">
                <label>Peso Atual (kg)</label>
                <input v-model="studentData.weight" type="number" step="0.1" class="form-input">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Objetivo</label>
                <select v-model="studentData.goal" class="form-select">
                  <option value="lose-weight">Perder peso</option>
                  <option value="gain-muscle">Ganhar massa muscular</option>
                  <option value="maintain">Manter forma física</option>
                  <option value="strength">Aumentar força</option>
                </select>
              </div>
              <div class="form-group">
                <label>Nível de Atividade</label>
                <select v-model="studentData.activityLevel" class="form-select">
                  <option value="sedentary">Sedentário</option>
                  <option value="light">Levemente ativo</option>
                  <option value="moderate">Moderadamente ativo</option>
                  <option value="active">Muito ativo</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Informações Médicas</h3>
            <div class="form-group">
              <label>Condições Médicas</label>
              <textarea v-model="studentData.medicalConditions" class="form-textarea" 
                        placeholder="Descreva qualquer condição médica relevante..."></textarea>
            </div>
            <div class="form-group">
              <label>Medicamentos</label>
              <textarea v-model="studentData.medications" class="form-textarea"
                        placeholder="Liste medicamentos em uso..."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="resetForm" class="btn-secondary">
              <i class="fas fa-undo"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              <i class="fas fa-save"></i>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'StudentProfile',
  setup() {
    const studentData = reactive({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      birthDate: '1995-06-15',
      height: 175,
      weight: 78.5,
      goal: 'gain-muscle',
      activityLevel: 'moderate',
      medicalConditions: '',
      medications: '',
      avatar: 'https://via.placeholder.com/120x120/6366f1/white?text=JS'
    });

    const originalData = { ...studentData };

    const saveProfile = () => {
      console.log('Saving profile:', studentData);
      // Here you would typically send data to API
      alert('Perfil salvo com sucesso!');
    };

    const resetForm = () => {
      Object.assign(studentData, originalData);
    };

    return {
      studentData,
      saveProfile,
      resetForm
    };
  }
};
</script>

<style scoped>
.student-profile {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title i {
  color: var(--primary-color);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.profile-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
}

.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-color);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

@media (max-width: 768px) {
  .student-profile {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}

:root {
  --primary-color: #6366f1;
  --primary-hover: #5856eb;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
</style>
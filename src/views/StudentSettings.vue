<template>
  <div class="student-settings">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-cog"></i>
        Configurações
      </h1>
      <p class="page-subtitle">Personalize sua experiência no app</p>
    </div>

    <div class="settings-content">
      <!-- Appearance Settings -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-palette"></i> Aparência</h3>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <label>Modo Escuro</label>
            <p>Ativar tema escuro para reduzir cansaço visual</p>
          </div>
          <div class="setting-control">
            <div class="toggle-switch">
              <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode" id="darkModeToggle">
              <label for="darkModeToggle" class="toggle-label">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Settings -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-bell"></i> Notificações</h3>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <label>Lembretes de Treino</label>
            <p>Receber notificações para não perder seus treinos</p>
          </div>
          <div class="setting-control">
            <div class="toggle-switch">
              <input type="checkbox" v-model="settings.workoutReminders" id="workoutReminders">
              <label for="workoutReminders" class="toggle-label">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <label>Notificações por Email</label>
            <p>Receber atualizações importantes por email</p>
          </div>
          <div class="setting-control">
            <div class="toggle-switch">
              <input type="checkbox" v-model="settings.emailNotifications" id="emailNotifications">
              <label for="emailNotifications" class="toggle-label">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <label>Horário dos Lembretes</label>
            <p>Definir quando receber lembretes de treino</p>
          </div>
          <div class="setting-control">
            <select v-model="settings.reminderTime" class="setting-select">
              <option value="07:00">07:00</option>
              <option value="08:00">08:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-shield-alt"></i> Privacidade</h3>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <label>Perfil Público</label>
            <p>Permitir que outros usuários vejam seu progresso</p>
          </div>
          <div class="setting-control">
            <div class="toggle-switch">
              <input type="checkbox" v-model="settings.publicProfile" id="publicProfile">
              <label for="publicProfile" class="toggle-label">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <label>Compartilhar Dados de Treino</label>
            <p>Permitir análise anônima para melhorar o app</p>
          </div>
          <div class="setting-control">
            <div class="toggle-switch">
              <input type="checkbox" v-model="settings.shareWorkoutData" id="shareWorkoutData">
              <label for="shareWorkoutData" class="toggle-label">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-user-cog"></i> Conta</h3>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <label>Alterar Senha</label>
            <p>Atualizar sua senha de acesso</p>
          </div>
          <div class="setting-control">
            <button @click="showPasswordModal = true" class="btn-secondary">
              <i class="fas fa-key"></i>
              Alterar
            </button>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <label>Backup de Dados</label>
            <p>Fazer backup dos seus dados de treino</p>
          </div>
          <div class="setting-control">
            <button @click="exportData" class="btn-secondary">
              <i class="fas fa-download"></i>
              Exportar
            </button>
          </div>
        </div>
        <div class="setting-item danger">
          <div class="setting-info">
            <label>Excluir Conta</label>
            <p>Remover permanentemente sua conta e dados</p>
          </div>
          <div class="setting-control">
            <button @click="showDeleteModal = true" class="btn-danger">
              <i class="fas fa-trash"></i>
              Excluir
            </button>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="settings-actions">
        <button @click="saveSettings" class="btn-primary">
          <i class="fas fa-save"></i>
          Salvar Configurações
        </button>
      </div>
    </div>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Alterar Senha</h2>
          <button @click="closePasswordModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="changePassword">
            <div class="form-group">
              <label>Senha Atual</label>
              <input v-model="passwordForm.current" type="password" required class="form-input">
            </div>
            <div class="form-group">
              <label>Nova Senha</label>
              <input v-model="passwordForm.new" type="password" required class="form-input">
            </div>
            <div class="form-group">
              <label>Confirmar Nova Senha</label>
              <input v-model="passwordForm.confirm" type="password" required class="form-input">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closePasswordModal" class="btn-secondary">Cancelar</button>
          <button @click="changePassword" class="btn-primary">Alterar Senha</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';

export default {
  name: 'StudentSettings',
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { toggleDarkMode } = themeStore;

    const showPasswordModal = ref(false);
    const showDeleteModal = ref(false);

    const settings = reactive({
      workoutReminders: true,
      emailNotifications: false,
      reminderTime: '18:00',
      publicProfile: false,
      shareWorkoutData: true
    });

    const passwordForm = reactive({
      current: '',
      new: '',
      confirm: ''
    });

    const saveSettings = () => {
      console.log('Saving settings:', settings);
      alert('Configurações salvas com sucesso!');
    };

    const closePasswordModal = () => {
      showPasswordModal.value = false;
      passwordForm.current = '';
      passwordForm.new = '';
      passwordForm.confirm = '';
    };

    const changePassword = () => {
      if (passwordForm.new !== passwordForm.confirm) {
        alert('As senhas não coincidem!');
        return;
      }
      console.log('Changing password...');
      closePasswordModal();
      alert('Senha alterada com sucesso!');
    };

    const exportData = () => {
      console.log('Exporting user data...');
      alert('Dados exportados com sucesso!');
    };

    return {
      isDarkMode,
      toggleDarkMode,
      showPasswordModal,
      showDeleteModal,
      settings,
      passwordForm,
      saveSettings,
      closePasswordModal,
      changePassword,
      exportData
    };
  }
};
</script>

<style scoped>
.student-settings {
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

.settings-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.card-header h3 {
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.danger {
  background: var(--error-bg);
}

.setting-info {
  flex: 1;
}

.setting-info label {
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.25rem;
}

.setting-info p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.setting-control {
  flex-shrink: 0;
  margin-left: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  background: var(--border-color);
  border-radius: 24px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-label {
  background: var(--primary-color);
}

.toggle-switch input[type="checkbox"]:checked + .toggle-label .toggle-slider {
  transform: translateX(26px);
}

.setting-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
}

.settings-actions {
  text-align: center;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
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

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-danger {
  background: var(--error-color);
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
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

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .student-settings {
    padding: 1rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .setting-control {
    margin-left: 0;
    text-align: right;
  }
}

:root {
  --primary-color: #6366f1;
  --error-color: #ef4444;
  --error-bg: #fef2f2;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
</style>
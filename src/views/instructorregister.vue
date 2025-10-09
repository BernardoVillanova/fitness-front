<template>
  <div class="container">
    <aside class="sidebar">
      <h2 class="sidebar-title">Cadastro de Instrutor</h2>
      <ul class="sidebar-steps">
        <li :class="stepClass(1)">1. Certificações</li>
        <li :class="stepClass(2)">2. Especializações</li>
        <li :class="stepClass(3)">3. Confirmação</li>
      </ul>
    </aside>

    <main class="main">
      <div class="form-card">
        <!-- Etapa 1 -->
        <div v-if="step === 1">
          <h3 class="form-title">Certificações</h3>
          <input v-model="certInput" placeholder="Digite uma certificação" class="input" />
          <button class="btn" @click="addCert">Adicionar</button>
          <ul class="goal-list">
            <li v-for="(c, i) in form.certifications" :key="i">{{ c }}</li>
          </ul>
        </div>

        <!-- Etapa 2 -->
        <div v-if="step === 2">
          <h3 class="form-title">Especializações</h3>
          <input v-model="specInput" placeholder="Digite uma especialização" class="input" />
          <button class="btn" @click="addSpec">Adicionar</button>
          <ul class="goal-list">
            <li v-for="(s, i) in form.specialties" :key="i">{{ s }}</li>
          </ul>
        </div>

        <!-- Etapa 3 -->
        <div v-if="step === 3">
          <h3 class="form-title">Confirmação</h3>
          <p><strong>Certificações:</strong> {{ form.certifications.join(", ") }}</p>
          <p><strong>Especializações:</strong> {{ form.specialties.join(", ") }}</p>
        </div>

        <div class="form-nav">
          <button class="btn secondary" @click="prevStep" :disabled="step === 1">Voltar</button>
          <button class="btn primary" @click="nextStep">{{ step < maxStep ? 'Próximo' : 'Finalizar' }}</button>
        </div>

        <div v-if="step > maxStep" class="form-success">
          Instrutor cadastrado com sucesso!
        </div>
      </div>
    </main>
  </div>

    <!-- Notification Modal -->
    <NotificationModal
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
    />
</template>

<script>
import axios from 'axios';

import NotificationModal from '@/components/NotificationModal.vue';
export default {
  name: 'InstructorRegister',
  data() {
    return {
      notification: { visible: false, type: 'info', title: '', message: '' },
      step: 1,
      maxStep: 3,
      isSubmitting: false,
      certInput: '',
      specInput: '',
      form: {
        certifications: [],
        specialties: []
      }
    };
  },
  methods: {
    showNotification(type, title, message) {
      this.notification = {
        visible: true,
        type: type,
        title: title,
        message: message
      };
    },
    stepClass(n) {
      return {
        'active-step': this.step === n
      };
    },
    nextStep() {
      if (this.step === 1 && !this.form.certifications.length) {
        this.showNotification('info', 'Informacao', 'Adicione pelo menos uma certificação.');
        return;
      }
      if (this.step === 2 && !this.form.specialties.length) {
        this.showNotification('info', 'Informacao', 'Adicione pelo menos uma especialização.');
        return;
      }

      if (this.step < this.maxStep) {
        this.step++;
      } else {
        this.submitForm();
      }
    },
    prevStep() {
      if (this.step > 1) this.step--;
    },
    addCert() {
      const cert = this.certInput.trim();
      if (cert && !this.form.certifications.includes(cert)) {
        this.form.certifications.push(cert);
        this.certInput = '';
      }
    },
    addSpec() {
      const spec = this.specInput.trim();
      if (spec && !this.form.specialties.includes(spec)) {
        this.form.specialties.push(spec);
        this.specInput = '';
      }
    },
    async submitForm() {
      this.isSubmitting = true;
      const userId = this.$route.query.userId;

      if (!userId) {
        this.showNotification('info', 'Informacao', 'ID do usuário não encontrado. Volte ao início.');
        this.isSubmitting = false;
        return;
      }

      try {
        const res = await axios.post('http://localhost:3000/api/instructors', {
          userId,
          certifications: this.form.certifications,
          specialties: this.form.specialties
        });

        console.log('Instrutor criado:', res.data);
        this.step++;
        this.$router.push('/login')
      } catch (err) {
        console.error(err);
        this.showNotification('error', 'Erro', 'Erro ao cadastrar instrutor.');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #fff;
}

.sidebar {
  background: #f4fafa;
  padding: 2rem;
  width: 250px;
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.sidebar-steps {
  list-style: none;
  padding: 0;
}

.sidebar-steps li {
  padding: 0.75rem 1rem;
  border-left: 3px solid transparent;
  margin-bottom: 0.5rem;
  color: #555;
  border-radius: 4px;
}

.sidebar-steps li.active-step {
  background: #e0f7f7;
  border-left-color: #06b6d4;
  font-weight: 600;
}

.main {
  flex: 1;
  padding: 2rem 4rem;
  background-color: #fafefe;
  overflow-y: auto;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
}

.input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
  transition: border 0.3s;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn.primary {
  background-color: #06b6d4;
  color: #fff;
}

.btn.secondary {
  background-color: #ccc;
  color: #333;
  margin-right: 0.5rem;
}

.goal-list {
  margin-top: 1rem;
  padding-left: 1rem;
}

.form-nav {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

.form-success {
  text-align: center;
  font-weight: bold;
  color: #16a34a;
  font-size: 1.1rem;
  margin-top: 2rem;
}
</style>


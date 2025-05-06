<template>
  <div :class="isDarkMode ? 'full-screen dark' : 'full-screen light'">
    <div class="card-container">
      <div class="form-section">
        <h2 class="title">Cadastre-se</h2>
        <form @submit.prevent="register">
          <div class="input-group-single">
            <input type="text" v-model.trim="name" placeholder="Nome" required autocomplete="name" />
          </div>

          <div class="input-group">
            <input
              type="text"
              v-model.trim="cpf"
              v-mask="'###.###.###-##'"
              placeholder="CPF"
              required
              autocomplete="off"
            />
            <input
              type="text"
              v-model.trim="phone"
              v-mask="'(##) #####-####'"
              placeholder="Telefone"
              required
              autocomplete="tel"
            />
          </div>

          <div class="input-group-single">
            <input type="email" v-model.trim="email" placeholder="E-mail" required autocomplete="email" />
          </div>

          <div class="input-group-single">
            <input type="password" v-model="password" placeholder="Senha" required autocomplete="new-password" />
          </div>

          <div class="input-group-single">
            <input type="date" v-model="birthDate" required />
          </div>

          <div class="role-selector">
            <button
              type="button"
              :class="role === 'aluno' ? 'role-btn selected' : 'role-btn'"
              @click="role = 'aluno'"
            >
              <i class="fas fa-user-graduate"></i> Aluno
            </button>
            <button
              type="button"
              :class="role === 'personal' ? 'role-btn selected' : 'role-btn'"
              @click="role = 'personal'"
            >
              <i class="fas fa-dumbbell"></i> Instrutor
            </button>
          </div>

          <button type="submit">Criar Conta</button>
        </form>

        <p class="subtitle">
          Já tem uma conta?
          <router-link to="/login" class="login-link">Faça login</router-link>
        </p>
      </div>

      <div class="image-section">
        <img :src="roleImage" alt="Register Image" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";
import { mask } from 'vue-the-mask';

export default {
  name: "RegisterPage",
  directives: { mask },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  data() {
    return {
      name: "",
      cpf: "",
      email: "",
      password: "",
      phone: "",
      birthDate: "",
      role: "",
    };
  },
  computed: {
    roleImage() {
      if (this.role === "aluno") {
        return "https://source.unsplash.com/500x600/?student,notebook";
      } else if (this.role === "personal") {
        return "https://source.unsplash.com/500x600/?trainer,fitness";
      } else {
        return "https://source.unsplash.com/500x600/?gym,training";
      }
    },
  },
  methods: {
    async register() {
      if (!this.validateCPF(this.cpf)) {
        alert('CPF inválido');
        return;
      }
      if (!this.role) {
        alert("Selecione o tipo de usuário: Aluno ou Instrutor.");
        return;
      }

      try {
        await axios.post("http://localhost:3000/api/auth/register", {
          name: this.name,
          cpf: this.cpf,
          email: this.email,
          password: this.password,
          phone: this.phone,
          birthDate: this.birthDate,
          role: this.role,
        });

        alert("Cadastro realizado com sucesso!");

        if (this.role === "aluno") {
          this.$router.push("/student-register");
        } else {
          this.$router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao registrar:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Erro ao registrar. Tente novamente.");
      }
    },
    validateCPF(cpf) {
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
      let soma = 0, resto;
      for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf[9])) return false;
      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      return resto === parseInt(cpf[10]);
    },
  },
};
</script>

<style scoped>
:root {
  --card-bg: white;
  --form-bg: #fff;
  --image-bg: #2c3e50;
}

.light {
  background-color: #f4f4f4;
  color: #333;
  --button-bg: #007bff;
  --button-hover-bg: #0056b3;
}

.dark {
  background-color: #1a1a2e;
  color: white;
  --button-bg: #6441a5;
  --button-hover-bg: #4b2d91;
  --card-bg: #2c2c2c;
  --form-bg: #1e1e1e;
  --image-bg: #1a1a2e;
}

.full-screen {
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card-container {
  display: flex;
  max-width: 900px;
  width: 100%;
  background: var(--card-bg);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  overflow: hidden;
  flex-wrap: wrap;
}

.form-section {
  width: 60%;
  padding: 40px;
  background-color: var(--form-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.image-section {
  width: 40%;
  background: var(--image-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
}

.subtitle {
  font-size: 14px;
  margin-top: 20px;
  font-weight: bold;
}

.login-link {
  color: #ff5733;
  font-weight: bold;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

input,
button {
  padding: 12px;
  margin: 10px 0;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
}

input {
  border: 1px solid #ccc;
  width: 100%;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus,
input:not(:placeholder-shown) {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

input::placeholder {
  color: #888;
}

.dark input::placeholder {
  color: #aaa;
}

input[type="date"] {
  background-color: inherit;
  color: inherit;
  border: 1px solid #ccc;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.dark input[type="date"] {
  background-color: var(--form-bg);
  color: white;
  border: 1px solid #555;
}

input[type="date"]:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

button {
  background-color: var(--button-bg);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%;
}

button:hover {
  background-color: var(--button-hover-bg);
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-group input {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.input-group-single {
  margin-bottom: 10px;
}

.input-group-single input {
  width: 100%;
}

.role-selector {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  gap: 16px;
}

.role-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  font-size: 16px;
  border: 2px solid var(--button-bg);
  border-radius: 6px;
  background-color: transparent;
  color: var(--button-bg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.role-btn.selected {
  background-color: var(--button-bg);
  color: white;
}

.role-btn i {
  font-size: 18px;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }

  .card-container {
    flex-direction: column;
    max-width: 90%;
  }

  .form-section,
  .image-section {
    width: 100%;
  }

  .image-section {
    height: 200px;
  }

  .form-section {
    padding: 20px;
  }
}
</style>

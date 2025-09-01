<template>
  <NavBar />
  <div :class="isDarkMode ? 'full-screen dark' : 'full-screen light'">
    <div class="register-container">
      <div class="form-card">
        <div class="left-section">
          <div class="geometric-animations">
            <div class="geometric-shape circle-1"></div>
            <div class="geometric-shape circle-2"></div>
            <div class="geometric-shape triangle-1"></div>
            <div class="geometric-shape triangle-2"></div>
            <div class="geometric-shape square-1"></div>
            <div class="geometric-shape square-2"></div>
            <div class="geometric-shape hexagon-1"></div>
            <div class="geometric-shape line-1"></div>
            <div class="geometric-shape line-2"></div>
          </div>

          <div class="welcome-content">
            <h2 class="welcome-title">Comece sua jornada de treinos agora!</h2>
            <p class="welcome-text">
              Acompanhe sua evolução e receba planos personalizados com suporte
              dos instrutores.
            </p>
            <p class="signin-text">
              Já possui uma conta?
              <router-link to="/login" class="signin-link"
                >Conecte-se</router-link
              >
            </p>
          </div>
        </div>

        <div class="right-section">
          <div class="form-header">
            <h1 class="form-title">Criar conta</h1>
          </div>

          <form @submit.prevent="register" class="modern-form">
            <div class="input-container">
              <div class="input-wrapper">
                <i class="fas fa-user input-icon"></i>
                <input
                  type="text"
                  v-model.trim="name"
                  placeholder="Nome completo"
                  required
                  autocomplete="name"
                  class="styled-input"
                />
              </div>
            </div>

            <div class="input-container">
              <div class="input-wrapper">
                <i class="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  v-model.trim="email"
                  placeholder="E-mail"
                  required
                  autocomplete="email"
                  class="styled-input"
                />
              </div>
            </div>

            <div class="input-row">
              <div class="input-container half-width">
                <div class="input-wrapper">
                  <i class="fas fa-id-card input-icon"></i>
                  <input
                    type="text"
                    v-model.trim="cpf"
                    v-mask="'###.###.###-##'"
                    placeholder="CPF"
                    required
                    autocomplete="off"
                    class="styled-input"
                  />
                </div>
              </div>
              <div class="input-container half-width">
                <div class="input-wrapper">
                  <i class="fas fa-phone input-icon"></i>
                  <input
                    type="text"
                    v-model.trim="phone"
                    v-mask="'(##) #####-####'"
                    placeholder="Telefone"
                    required
                    autocomplete="tel"
                    class="styled-input"
                  />
                </div>
              </div>
            </div>

            <div class="input-container">
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  v-model="password"
                  placeholder="Senha"
                  required
                  autocomplete="new-password"
                  class="styled-input"
                />
              </div>
            </div>

            <div class="input-container">
              <div class="input-wrapper">
                <i class="fas fa-calendar input-icon"></i>
                <input
                  type="date"
                  v-model="birthDate"
                  required
                  class="styled-input date-field"
                />
              </div>
            </div>

            <div class="role-selection">
              <h3 class="role-title">Escolha seu perfil</h3>
              <div class="role-buttons">
                <button
                  type="button"
                  :class="role === 'aluno' ? 'role-btn active' : 'role-btn'"
                  @click="role = 'aluno'"
                >
                  <i class="fas fa-user-graduate"></i>
                  <span>Aluno</span>
                </button>
                <button
                  type="button"
                  :class="role === 'personal' ? 'role-btn active' : 'role-btn'"
                  @click="role = 'personal'"
                >
                  <i class="fas fa-dumbbell"></i>
                  <span>Instrutor</span>
                </button>
              </div>
            </div>

            <button type="submit" class="submit-btn">Criar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import { useThemeStore } from "@/store/theme";
import axios from "axios";
import { storeToRefs } from "pinia";
import { mask } from "vue-the-mask";

export default {
  name: "RegisterPage",
  components: {
    NavBar,
  },
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
        alert("CPF inválido");
        return;
      }
      if (!this.role) {
        alert("Selecione o tipo de usuário: Aluno ou Instrutor.");
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/register",
          {
            name: this.name,
            cpf: this.cpf,
            email: this.email,
            password: this.password,
            phone: this.phone,
            birthDate: this.birthDate,
            role: this.role,
          }
        );

        const userId = res.data.user._id;

        alert("Cadastro realizado com sucesso!");

        this.$router.push({
          path:
            this.role === "aluno"
              ? "/student-register"
              : "/instructor-register",
          query: { userId },
        });
      } catch (error) {
        // TODO - Necessário melhor tratativa de erros
        console.error("Erro ao registrar:", error.response?.data);
        alert(error.response?.data?.message);
      }
    },

    validateCPF(cpf) {
      // GPT para validação de CPF
      cpf = cpf.replace(/[^\d]+/g, "");

      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

      let soma = 0,
        resto;
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
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

* {
  font-family: "Inter", sans-serif;
}

.light {
  --bg-color: #f5f5f5;
  --card-bg: #ffffff;
  --blue-bg: #4285f4;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-white: #ffffff;
  --input-bg: #f8f9fa;
  --input-border: #e0e0e0;
  --input-focus: #4285f4;
  --button-primary: #4285f4;
  --button-hover: #3367d6;
  --left-section-bg: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
  --submit-btn-bg: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --role-btn-active-bg: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.dark {
  --bg-color: #1a1a1a;
  --card-bg: #2d2d2d;
  --blue-bg: #4285f4;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-white: #ffffff;
  --input-bg: #404040;
  --input-border: #555555;
  --input-focus: #4285f4;
  --button-primary: #4285f4;
  --button-hover: #3367d6;
  --left-section-bg: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
    #8b5cf6 100%
  );
  --submit-btn-bg: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --role-btn-active-bg: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.full-screen {
  min-height: 100vh;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 1000px;
  height: 650px;
}

.form-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.left-section {
  background: var(--left-section-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: var(--text-white);
  position: relative;
  overflow: hidden;
}

/* Animações geométricas */
.geometric-animations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.geometric-shape {
  position: absolute;
  opacity: 0.1;
}

/* Círculos */
.circle-1 {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  top: 20%;
  left: 10%;
  animation: float1 6s ease-in-out infinite;
}

.circle-2 {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  top: 60%;
  right: 15%;
  animation: float2 8s ease-in-out infinite;
}

/* Triângulos */
.triangle-1 {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 52px solid rgba(255, 255, 255, 0.15);
  top: 15%;
  right: 25%;
  animation: rotate1 10s linear infinite;
}

.triangle-2 {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid rgba(255, 255, 255, 0.1);
  bottom: 25%;
  left: 20%;
  animation: rotate2 12s linear infinite;
}

/* Quadrados */
.square-1 {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  top: 40%;
  left: 5%;
  animation: pulse1 7s ease-in-out infinite;
  transform-origin: center;
}

.square-2 {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  top: 70%;
  right: 10%;
  animation: pulse2 9s ease-in-out infinite;
  transform-origin: center;
}

/* Hexágono */
.hexagon-1 {
  width: 50px;
  height: 43.3px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  top: 35%;
  right: 5%;
  animation: float3 11s ease-in-out infinite;
}

.hexagon-1:before,
.hexagon-1:after {
  content: "";
  position: absolute;
  width: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
}

.hexagon-1:before {
  bottom: 100%;
  border-bottom: 14.43px solid rgba(255, 255, 255, 0.1);
}

.hexagon-1:after {
  top: 100%;
  border-top: 14.43px solid rgba(255, 255, 255, 0.1);
}

/* Linhas */
.line-1 {
  width: 100px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  top: 25%;
  left: 30%;
  animation: slideX1 8s ease-in-out infinite;
}

.line-2 {
  width: 2px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  bottom: 20%;
  right: 30%;
  animation: slideY1 10s ease-in-out infinite;
}

/* Animações */
@keyframes float1 {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-5px);
  }
  75% {
    transform: translateY(-30px) translateX(15px);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translateY(0px) translateX(0px) scale(1);
  }
  33% {
    transform: translateY(15px) translateX(-10px) scale(1.1);
  }
  66% {
    transform: translateY(-25px) translateX(20px) scale(0.9);
  }
}

@keyframes float3 {
  0%,
  100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) translateX(8px) rotate(90deg);
  }
  50% {
    transform: translateY(10px) translateX(-12px) rotate(180deg);
  }
  75% {
    transform: translateY(-25px) translateX(5px) rotate(270deg);
  }
}

@keyframes rotate1 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate2 {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes pulse1 {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.2) rotate(45deg);
    opacity: 0.2;
  }
}

@keyframes pulse2 {
  0%,
  100% {
    transform: scale(1) rotate(45deg);
    opacity: 0.15;
  }
  50% {
    transform: scale(0.8) rotate(0deg);
    opacity: 0.05;
  }
}

@keyframes slideX1 {
  0%,
  100% {
    transform: translateX(0px) rotate(0deg);
  }
  50% {
    transform: translateX(30px) rotate(90deg);
  }
}

@keyframes slideY1 {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-40px);
  }
}

.welcome-content {
  width: 100%;
  max-width: 400px;
  text-align: left;
  position: relative;
  z-index: 2;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 32px 0;
  color: var(--text-white);
  line-height: 1.3;
}

.welcome-text {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 32px 0;
  color: var(--text-white);
  opacity: 0.9;
}

.signin-text {
  font-size: 16px;
  margin: 0;
  color: var(--text-white);
  opacity: 0.9;
}

.signin-link {
  color: var(--text-white);
  text-decoration: underline;
  font-weight: 500;
}

.signin-link:hover {
  opacity: 0.8;
}

.right-section {
  background: var(--card-bg);
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 24px;
  text-align: center;
}

.form-title {
  font-size: 36px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.input-container {
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--text-secondary);
  font-size: 16px;
  z-index: 2;
  transition: color 0.3s ease;
}

.input-row {
  display: flex;
  gap: 16px;
}

.half-width {
  flex: 1;
}

.styled-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.styled-input:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

.styled-input:focus + .input-icon {
  color: var(--input-focus);
}

.styled-input::placeholder {
  color: var(--text-secondary);
}

.date-field {
  color-scheme: light;
}

.dark .date-field {
  color-scheme: dark;
}

.role-selection {
  margin: 16px 0;
}

.role-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-align: center;
}

.role-buttons {
  display: flex;
  gap: 12px;
}

.role-btn {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 400;
  font-size: 14px;
}

.role-btn:hover {
  border-color: var(--input-focus);
}

.role-btn.active {
  background: var(--role-btn-active-bg);
  border-color: var(--button-primary);
  color: white;
}

.role-btn i {
  font-size: 16px;
}

.submit-btn {
  background: var(--submit-btn-bg);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  width: 100%;
}

.submit-btn:hover {
  background: var(--submit-btn-bg);
  filter: brightness(1.1);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
}

.dark .submit-btn:hover {
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .right-section {
    padding: 30px 40px;
  }

  .form-title {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .form-card {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .left-section {
    padding: 40px 30px;
    min-height: 200px;
  }

  .right-section {
    padding: 40px 30px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .form-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .register-container {
    margin: 10px;
  }

  .input-row {
    flex-direction: column;
    gap: 20px;
  }

  .left-section,
  .right-section {
    padding: 30px 20px;
  }

  .role-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .role-btn {
    padding: 16px 12px;
  }
}
</style>

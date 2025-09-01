<template>
  <NavBar />
  <div :class="isDarkMode ? 'full-screen dark' : 'full-screen light'">
    <div class="card-container">
      <div class="image-section">
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

        <div class="welcome-message">
          <h1>Bem-vindo de volta!</h1>
          <p>
            Faça login para acessar sua conta e aproveitar todos os recursos.
          </p>
        </div>
      </div>

      <div class="form-section">
        <h2 class="title">Login</h2>
        <p class="subtitle">
          Não tem uma conta?
          <router-link to="/register" class="register-link"
            >Crie uma aqui!</router-link
          >
        </p>

        <form @submit.prevent="login">
          <input type="email" placeholder="Email" v-model="email" required />
          <input
            type="password"
            placeholder="Senha"
            v-model="password"
            required
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import NavBar from "@/components/NavBar.vue";
import { useThemeStore } from "@/store/theme";
import { jwtDecode } from "jwt-decode";
import { storeToRefs } from "pinia";

export default {
  name: "LoginPage",
  components: { NavBar },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
        });

        const token = response.data.token;
        const decodedToken = jwtDecode(token);

        if (!decodedToken.role) {
          throw new Error("Token inválido ou sem informações de papel.");
        }

        sessionStorage.setItem("token", token);

        if (decodedToken.role === "personal") {
          this.$router.push("/dashboard");
        } else {
          this.$router.push("/student-dashboard");
        }

        alert("Login bem-sucedido!");
      } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro no login. Verifique suas credenciais.");
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

:root {
  /* Tema Claro - Paleta Azul Sofisticada */
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-light: #dbeafe;
  --accent-color: #0ea5e9;

  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --form-bg: #ffffff;
  --image-bg: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);

  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;

  --border-color: #e2e8f0;
  --border-focus: #2563eb;

  --input-bg: #ffffff;
  --input-text: #0f172a;
  --input-placeholder: #94a3b8;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);

  --font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

.dark {
  /* Tema Escuro - Paleta Roxa Minimalista e Elegante */
  --primary-color: #8b5cf6;
  --primary-hover: #7c3aed;
  --primary-light: #2d1b69;
  --accent-color: #a855f7;

  --bg-color: #0a0a0f;
  --card-bg: #1a1a20;
  --form-bg: #1a1a20;
  --image-bg: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, #8b5cf6 100%);

  --text-primary: #f8fafc;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  --border-color: #2a2a32;
  --border-focus: #8b5cf6;

  --input-bg: #0f0f14;
  --input-text: #f8fafc;
  --input-placeholder: #71717a;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5),
    0 2px 4px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6),
    0 4px 6px -2px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7),
    0 10px 10px -5px rgba(0, 0, 0, 0.6);
}

.full-screen {
  min-height: 100vh;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: var(--font-family);
  transition: background-color 0.3s ease;
}

.card-container {
  display: flex;
  width: 100%;
  max-width: 960px;
  height: 560px;
  background: var(--card-bg);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.card-container:hover {
  transform: translateY(-2px);
}

.light .card-container:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dark .card-container:hover {
  box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.15);
  border-color: #3a3a42;
}

.image-section {
  background: var(--image-bg);
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.image-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(0.5px);
}

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

.welcome-message {
  position: relative;
  z-index: 2;
  color: #ffffff;
  text-align: center;
  padding: 0 40px;
  max-width: 320px;
}

.welcome-message h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-message p {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
  font-weight: 400;
}

.form-section {
  width: 55%;
  padding: 60px 50px;
  background: var(--form-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-left: 1px solid var(--border-color);
}

.title {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 32px;
  margin-bottom: 8px;
  text-align: center;
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  text-align: center;
  font-weight: 400;
}

.register-link {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input {
  width: 100%;
  padding: 16px 20px;
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 400;
  background: var(--input-bg);
  color: var(--input-text);
  box-sizing: border-box;
  transition: all 0.2s ease;
  outline: none;
}

input::placeholder {
  color: var(--input-placeholder);
  font-weight: 400;
}

input:focus {
  border-color: var(--border-focus);
  transform: translateY(-1px);
}

.light input:focus {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.dark input:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  background: #14141a;
}

button {
  width: 100%;
  padding: 16px 24px;
  background: var(--primary-color);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 8px;
  letter-spacing: 0.025em;
}

button:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.dark button:hover {
  box-shadow: 0 10px 25px -3px rgba(139, 92, 246, 0.4);
}

button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
    width: 100%;
    max-width: 480px;
    height: auto;
    border-radius: 20px;
    margin: 10px;
  }

  .image-section {
    width: 100%;
    height: 200px;
    border-radius: 20px 20px 0 0;
  }

  .welcome-message {
    padding: 0 30px;
  }

  .welcome-message h1 {
    font-size: 24px;
  }

  .welcome-message p {
    font-size: 15px;
  }

  .form-section {
    width: 100%;
    padding: 40px 30px;
    border-left: none;
    border-top: 1px solid var(--border-color);
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
    margin-bottom: 28px;
  }

  input {
    padding: 14px 18px;
    font-size: 15px;
  }

  button {
    padding: 14px 20px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .full-screen {
    padding: 10px;
  }

  .card-container {
    margin: 0;
    border-radius: 16px;
  }

  .image-section {
    height: 180px;
  }

  .form-section {
    padding: 32px 24px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 13px;
    margin-bottom: 24px;
  }

  .welcome-message {
    padding: 0 24px;
  }

  .welcome-message h1 {
    font-size: 22px;
  }

  .welcome-message p {
    font-size: 14px;
  }

  input {
    padding: 12px 16px;
    font-size: 14px;
  }

  button {
    padding: 12px 18px;
    font-size: 14px;
  }
}
</style>

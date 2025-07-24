<template>
  <NavBar />
  <div :class="isDarkMode ? 'full-screen dark' : 'full-screen light'">
    <div class="card-container">
      <!-- Seção da Imagem -->
      <div class="image-section">
        <img src="https://source.unsplash.com/500x600/?technology,dark" alt="Login Image" />
      </div>

      <!-- Seção do Formulário -->
      <div class="form-section">
        <h2 class="title">Login</h2>
        <p class="subtitle">
          Não tem uma conta? <router-link to="/register" class="register-link">Crie uma aqui!</router-link>
        </p>

        <form @submit.prevent="login">
          <input type="email" placeholder="Email" v-model="email" required />
          <input type="password" placeholder="Senha" v-model="password" required />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import api from "@/api";

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
:root {
  --primary-color: #007bff;
  --bg-color: #f4f4f4;
  --card-bg: #ffffff;
  --form-bg: #ffffff;
  --image-bg: #e9f1ff;
  --button-bg: #007bff;
  --button-hover-bg: #0056b3;
  --text-color: #333;
}

.dark {
  --primary-color: #6441a5;
  --bg-color: #121212;
  --card-bg: #1f1f2e;
  --form-bg: #252539;
  --image-bg: #1a1a2e;
  --button-bg: #6441a5;
  --button-hover-bg: #4a2d91;
  --text-color: #ffffff;
}

.full-screen {
  height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--text-color);
}

.card-container {
  display: flex;
  max-width: 1000px;
  width: 100%;
  background-color: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

.image-section {
  width: 45%;
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

.form-section {
  width: 55%;
  padding: 60px 40px;
  background-color: var(--form-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-color);
}

.subtitle {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 25px;
}

.register-link {
  color: var(--primary-color);
  font-weight: bold;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 14px;
  background-color: var(--button-bg);
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: var(--button-hover-bg);
}

@media (max-width: 900px) {
  .card-container {
    flex-direction: column;
    max-width: 95%;
  }
  .image-section {
    width: 100%;
    height: 200px;
  }
  .form-section {
    width: 100%;
    padding: 40px 25px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 24px;
  }
  .subtitle {
    font-size: 12px;
  }
  input {
    font-size: 14px;
  }
  button {
    font-size: 14px;
  }
}
</style>

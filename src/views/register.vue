<template>
  <div :class="['container', isDarkMode ? 'dark' : 'light']">
    <div class="form-container">
      <h2>Cadastre-se</h2>
      <form @submit.prevent="register">
        <input type="text" v-model="name" placeholder="Nome" required />
        <input type="email" v-model="email" placeholder="E-mail" required />
        <input type="password" v-model="password" placeholder="Senha" required />

        <div class="role-selector">
          <label>
            <input type="radio" v-model="role" value="aluno" required /> Aluno
          </label>
          <label>
            <input type="radio" v-model="role" value="personal" required /> Instrutor
          </label>
        </div>

        <button type="submit">Criar Conta</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  name: "RegisterPage",

  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);

    return { isDarkMode };
  },

  data() {
    return {
      name: "",
      email: "",
      password: "",
      role: "",
    };
  },

  methods: {
    async register() {
      try {
        const response = await axios.post("http://localhost:3000/api/auth/register", {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        });

        alert("Cadastro realizado com sucesso!");
        console.log("Resposta da API:", response.data);

        // Redirecionar para login ou página inicial
        this.$router.push("/login");
      } catch (error) {
        console.error("Erro ao registrar:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Erro ao registrar. Tente novamente.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  transition: background 0.3s;
}

.dark {
  background: #1a1a2e;
  color: #fff;
}

.light {
  background: #f0f0f0;
  color: #000;
}

.form-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input, button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}

button {
  background: #6441a5;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #007bff;
}

.role-selector {
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
}
</style>

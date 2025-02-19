<template>
    <div>
      <h2>Login</h2>
      <input v-model="email" placeholder="Email">
      <input v-model="password" type="password" placeholder="Senha">
      <button @click="login">Entrar</button>
    </div>
  </template>
  
  <script>
  import api from "@/api"; // Arquivo que configura axios
  
  export default {
    data() {
      return { email: "", password: "" };
    },
    methods: {
      async login() {
        try {
          const response = await api.post("/auth/login", { email: this.email, password: this.password });
          localStorage.setItem("token", response.data.token);
          alert("Login bem-sucedido!");
        } catch (error) {
          alert("Erro no login");
        }
      }
    }
  };
  </script>
  
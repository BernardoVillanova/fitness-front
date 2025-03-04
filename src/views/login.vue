<template>
  <NavBar/>
  <div class="full-screen">
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
import { jwtDecode } from 'jwt-decode';
import api from "@/api";

export default {
  name: "LoginPage",

  components: {
    NavBar,
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
        console.log('decodedToken: ', decodedToken);

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
.full-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  padding: 20px;
}

.card-container {
  display: flex;
  max-width: 800px;
  width: 100%;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.image-section {
  width: 40%;
  background: #2c3e50;
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
  width: 60%;
  padding: 40px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  font-weight: bold;
}

.register-link {
  color: #ff5733;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

.register-link:hover {
  text-decoration: underline;
}

input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
    max-width: 90%;
  }
  .image-section {
    width: 100%;
    height: 200px;
  }
  .form-section {
    width: 100%;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .full-screen {
    padding: 10px;
  }
  .card-container {
    max-width: 100%;
  }
  .form-section {
    padding: 15px;
  }
  .title {
    font-size: 20px;
  }
  .subtitle {
    font-size: 12px;
  }
  input {
    font-size: 14px;
    padding: 10px;
  }
  button {
    font-size: 14px;
    padding: 10px;
  }
}
</style>

<template>
    <div :class="{ 'dark-mode': isDarkMode, 'light-mode': !isDarkMode }" class="dashboard-container">
      <DashboardNavBar @toggle-theme="toggleTheme" />
      <main class="dashboard-main">
        <section class="staff-list">
          <header class="staff-header">
            <h2>Staff List</h2>
            <button @click="fetchStaff" class="refresh-button">Atualizar</button>
          </header>
          
          <!-- Verificação de fallback caso não haja funcionários -->
          <p v-if="staffList.length === 0" class="fallback-message">Nenhum funcionário encontrado.</p>
          
          <table v-else class="staff-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Dias de Trabalho</th>
                <th>Tratamento</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in staffList" :key="staff.id">
                <td>
                  <img :src="staff.avatar || 'default-avatar.png'" class="avatar" />
                  {{ staff.name }}
                </td>
                <td>{{ staff.contact }}</td>
                <td>
                  <span v-for="day in daysOfWeek" :key="day"
                        :class="{ 'active-day': staff.workingDays.includes(day) }"
                        class="day-badge">
                    {{ day }}
                  </span>
                </td>
                <td>{{ staff.treatment }}</td>
                <td :class="{ 'full-time': staff.type === 'FULL-TIME', 'part-time': staff.type === 'PART-TIME' }">
                  {{ staff.type }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import DashboardNavBar from "@/components/DashboardNavBar.vue";
  import { ref, onMounted } from "vue";
  
  export default {
    name: 'StudentList',

    components: { DashboardNavBar },
    setup() {
      const isDarkMode = ref(false);
      const staffList = ref([]);
      const daysOfWeek = ref(["S", "M", "T", "W", "T", "F", "S"]);
  
      /**
       * Função que busca a lista de funcionários do banco de dados.
       * Atualmente simula uma resposta da API.
       * Substituir esta função por uma chamada real ao backend.
       */
      const fetchStaff = async () => {
        try {
          // Simulação de chamada à API
          staffList.value = [
            { id: 1, name: "Ronald Richards", avatar: "avatar1.png", contact: "209-555-0104", workingDays: ["M", "W", "F"], treatment: "Dental Service", type: "PART-TIME" },
            { id: 2, name: "Drg. Jerald O'Hara", avatar: "avatar2.png", contact: "302-555-0107", workingDays: ["M", "T", "W", "T", "F"], treatment: "Dental & Oral Disease", type: "FULL-TIME" }
          ];
        } catch (error) {
          console.error("Erro ao buscar funcionários", error);
        }
      };
  
      /**
       * Alterna entre os modos claro e escuro
       */
      const toggleTheme = () => {
        isDarkMode.value = !isDarkMode.value;
      };
  
      onMounted(fetchStaff);
  
      return { isDarkMode, staffList, daysOfWeek, fetchStaff, toggleTheme };
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    transition: background 0.3s;
  }
  
  .dark-mode { background: #1a1a2e; color: white; }
  .light-mode { background: #f0f0f0; color: black; }
  
  .staff-list { width: 100%; max-width: 1200px; }
  .staff-header { display: flex; justify-content: space-between; align-items: center; }
  
  .fallback-message {
    text-align: center;
    font-size: 1.2em;
    color: gray;
    margin-top: 20px;
  }
  
  .staff-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  
  th, td { padding: 10px; text-align: left; }
  th { background: #007bff; color: white; }
  
  .avatar { width: 30px; height: 30px; border-radius: 50%; margin-right: 10px; }
  
  .day-badge {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    margin: 2px;
    border-radius: 50%;
    background: #ddd;
  }
  
  .active-day { background: #4caf50; color: white; }
  
  .full-time { color: green; }
  .part-time { color: orange; }
  
  @media (max-width: 768px) {
    .staff-table { font-size: 14px; }
    .day-badge { width: 20px; height: 20px; line-height: 20px; }
  }
  </style>
  
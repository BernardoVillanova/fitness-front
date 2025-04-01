<template>
  <div :class="{ 'dashboard-dark': isDarkMode, 'dashboard-light': !isDarkMode }" class="dashboard-container">
    <DashboardNavBar @toggle-theme="toggleTheme" />
    <main class="dashboard-main">
      <section class="dashboard-content">
        <div class="staff-list">
          <header class="staff-header">
            <h2>Lista de Alunos</h2>
            <button @click="fetchStaff" class="refresh-button">Atualizar</button>
          </header>
          <p v-if="staffList.length === 0" class="fallback-message">Nenhum aluno encontrado.</p>
          <table v-else class="staff-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Atividade</th>
                <th>Plano</th>
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
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

export default {
  name: 'StudentList',
  components: { DashboardNavBar },

  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const staffList = ref([]);
    const daysOfWeek = ref(["S", "M", "T", "W", "T", "F", "S"]);
    
    const fetchStaff = async () => {
      try {
        staffList.value = [
          { id: 1, name: "Ronald Richards", avatar: "avatar1.png", contact: "209-555-0104", workingDays: ["M", "W", "F"], treatment: "23", type: "Hipertrofia" },
          { id: 2, name: "Drg. Jerald O'Hara", avatar: "avatar2.png", contact: "302-555-0107", workingDays: ["M", "T", "W", "T", "F"], treatment: "56", type: "Fisoterapia" }
        ];
      } catch (error) {
        console.error("Erro ao buscar alunos", error);
      }
    };
    
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
    height: 100vh;
    overflow-x: hidden;
    margin-left: 80px;
  }

  .dashboard-main {
    flex: 1;
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  .dashboard-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .staff-list {
    width: 200vh;
    max-width: 1200px;
    background: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 20px;
  }

  .staff-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .staff-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  th, td {
    padding: 10px;
    text-align: left;
  }
  th {
    background: #007bff;
    color: white;
  }

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }

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

  .active-day {
    background: #4caf50;
    color: white;
  }

  .full-time {
    color: green;
  }
  .part-time {
    color: orange;
  }

  .dashboard-dark {
    background-color: #1a1a2e;
    color: white;
  }

  .dashboard-light {
    background-color: #f0f0f0;
    color: black;
  }

  @media (max-width: 768px) {
    .dashboard-content {
      grid-template-columns: 1fr;
    }
    .dashboard-container {
      margin-left: 0;
    }
  }
</style>

<template>
    <div :class="{ 'dashboard-dark': isDarkMode, 'dashboard-light': !isDarkMode }" class="dashboard-container">
      <DashboardNavBar />
      <main class="dashboard-main">
        <section class="dashboard-content">
          <div class="general-stats-card large">
            <h2>Estatísticas Gerais</h2>
          </div>
          <div class="chart-card extra-large">
            <h3>Gráfico de Dados</h3>
            <apexchart type="line" height="250" :options="chartOptions" :series="series"></apexchart>
          </div>
          <div class="platforms-card medium">
            <h1>Plataformas</h1>
          </div>
          <div class="sentiments-card small">
            <h2>Sentimentos</h2>
          </div>
          <div class="time-spent-card medium">
            <h3>Tempo Gasto</h3>
          </div>
          <div class="talk-listen-ratio-card large">
            <h2>Relação Falar/Ouvir</h2>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import DashboardNavBar from "@/components/DashboardNavBar.vue";
  import { useThemeStore } from "@/store/theme";
  import { storeToRefs } from "pinia";
  import VueApexCharts from "vue3-apexcharts";
  
  export default {
    name: "DashboardTech",
    components: { DashboardNavBar, apexchart: VueApexCharts },
    setup() {
      const themeStore = useThemeStore();
      const { isDarkMode } = storeToRefs(themeStore);
  
      const chartOptions = {
        chart: { id: "basic-line", toolbar: { show: false } },
        xaxis: { categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
        colors: ["#FF4560"],
        stroke: { curve: "smooth" },
      };
  
      const series = [{ name: "Progresso", data: [10, 40, 25, 50, 49, 60] }];
  
      return { isDarkMode, chartOptions, series };
    },
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
  }
  
  .dashboard-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .general-stats-card,
  .chart-card,
  .platforms-card,
  .sentiments-card,
  .time-spent-card,
  .talk-listen-ratio-card {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 10px;
    min-height: 150px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .dashboard-dark {
    background-color: #1a1a2e;
    color: white;
  }
  
  .dashboard-light {
    background-color: #f0f0f0;
    color: black;
  }
  
  .large {
    grid-column: span 2;
  }
  
  .medium {
    grid-column: span 1;
  }
  
  .small {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .extra-large {
    grid-column: span 3;
  }
  
  @media (max-width: 1024px) {
    .dashboard-container {
        margin-left: 80px;
    }
    .large,
    .extra-large {
      grid-column: span 1;
    }
  }
  
  @media (max-width: 768px) {
    .dashboard-content {
      grid-template-columns: 1fr;
    }

    .dashboard-container {
        margin-left: 0px;
    }
  
    .large,
    .medium,
    .small,
    .extra-large {
      grid-column: span 1;
    }
  }
</style>
  
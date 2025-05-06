<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    <main class="dashboard-main">
      <section class="dashboard-content">
        <div class="card general-stats-card large">
          <h2>Estatísticas Gerais</h2>
          <p>Total de Alunos: 250</p>
          <p>Novos este mês: 32</p>
        </div>

        <div class="card chart-card extra-large">
          <h3>Evolução de Matrículas</h3>
          <apexchart type="line" height="250" :options="lineChartOptions" :series="lineChartData" />
        </div>

        <div class="card bar-chart-card medium">
          <h3>Distribuição por Faixa Etária</h3>
          <apexchart type="bar" height="250" :options="barChartOptions" :series="barChartData" />
        </div>

        <div class="card pie-chart-card small">
          <h3>Gênero</h3>
          <apexchart type="pie" height="250" :options="pieChartOptions" :series="pieChartData" />
        </div>

        <div class="card time-spent-card medium">
          <h3>Tempo Médio de Treino</h3>
          <p>45 minutos</p>
        </div>

        <div class="card talk-listen-ratio-card large">
          <h2>Volume Semanal</h2>
          <apexchart type="area" height="250" :options="areaChartOptions" :series="areaChartData" />
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

    const lineChartData = [{ name: "Matrículas", data: [30, 45, 60, 50, 70, 90] }];
    const lineChartOptions = {
      chart: { toolbar: { show: false } },
      xaxis: { categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
      colors: ["#00E396"],
      stroke: { curve: "smooth" },
    };

    const barChartData = [{ name: "Alunos", data: [15, 35, 40, 30] }];
    const barChartOptions = {
      chart: { toolbar: { show: false } },
      xaxis: { categories: ["18-25", "26-35", "36-45", "46+"] },
      colors: ["#008FFB"],
    };

    const pieChartData = [60, 40];
    const pieChartOptions = {
      labels: ["Masculino", "Feminino"],
      colors: ["#775DD0", "#FF4560"],
    };

    const areaChartData = [
      {
        name: "Volume",
        data: [500, 800, 760, 1000, 950, 1100, 1200],
      },
    ];
    const areaChartOptions = {
      chart: { toolbar: { show: false } },
      xaxis: { categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"] },
      colors: ["#FEB019"],
      stroke: { curve: "smooth" },
    };

    return {
      isDarkMode,
      lineChartData,
      lineChartOptions,
      barChartData,
      barChartOptions,
      pieChartData,
      pieChartOptions,
      areaChartData,
      areaChartOptions,
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow-x: hidden;
  margin-left: 80px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dashboard-main {
  flex: 1;
  padding: 24px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background-color: var(--card-bg);
  color: var(--text-color);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dashboard-light {
  --card-bg: #ffffff;
  --text-color: #1a1a1a;
  background-color: #f4f4f8;
}

.dashboard-dark {
  --card-bg: #2b2b3d;
  --text-color: #f1f1f1;
  background-color: #1a1a2e;
}

.large {
  grid-column: span 2;
}
.medium {
  grid-column: span 1;
}
.small {
  grid-column: span 1;
}
.extra-large {
  grid-column: span 3;
}

@media (max-width: 1024px) {
  .large,
  .extra-large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    margin-left: 0px;
  }

  .dashboard-content {
    grid-template-columns: 1fr;
  }
}
</style>

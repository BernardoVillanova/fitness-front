<template>
  <div class="dashboard">
    <DashboardNavBar @toggle-theme="toggleTheme" />

    <!-- TO-DO - Dados mockados -->

    <div class="dashboard-container">
      <section class="profile-header">
        <img class="profile-photo" :src="user.photo" alt="Foto de perfil" />
        <div class="profile-info">
          <h2>{{ user.name }}</h2>
          <p class="role">
            <span class="highlight">{{ user.position }}</span> | {{ user.department }}
          </p>
        </div>
        <div class="profile-extra">
          <p><strong>Staff ID:</strong> {{ user.staffId }}</p>
          <p><strong>Phone number:</strong> {{ user.phone }}</p>
          <p><strong>Staff Account:</strong> {{ user.account }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
      </section>

      <!-- Seções de informação -->
      <div class="info-grid">
        <!-- Personal Information -->
        <div class="info-card">
          <h3>Personal information</h3>
          <div class="info-row" v-for="(value, label) in personalInfo" :key="label">
            <span class="label">{{ label }}</span>
            <span class="value">{{ value }}</span>
          </div>
        </div>

        <!-- Education Information -->
        <div class="info-card">
          <h3>Education information</h3>
          <div v-for="(edu, index) in education" :key="index" class="edu-item">
            <p class="edu-title">{{ edu.degree }}</p>
            <p class="edu-sub">{{ edu.institution }}</p>
            <p class="edu-date">{{ edu.period }}</p>
          </div>
        </div>

        <!-- Account Information -->
        <div class="info-card">
          <h3>Account information</h3>
          <div class="info-row" v-for="(value, label) in accountInfo" :key="label">
            <span class="label">{{ label }}</span>
            <span class="value">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardNavBar from "@/components/DashboardNavBar.vue";

export default {
  components: { DashboardNavBar },
  name: "StaffProfile",

  data() {
    return {
      user: {
        name: "Hang Minh Nguyen",
        position: "UI - UX Designer",
        department: "Product Department",
        staffId: "SJ53862",
        phone: "0913 854 235",
        account: "hangntm1",
        email: "hangntm@sjlable.com",
        photo: "https://via.placeholder.com/80"
      },
      personalInfo: {
        Gender: "Female",
        "Date of birth": "5th March, 1996",
        "Identify code": "3234611342",
        Hometown: "Hai Duong city",
        Nationality: "Vietnam",
        Religion: "None",
        Language: "Vietnamese, English",
        "Marital status": "Single",
        "Permanent address": "5. Nguyen Chi Thanh Street, Tan Binh Ward, Hai Duong",
        "Current address": "29. Nguyen Ngoc Doan Street, Dong Da District, Ha Noi"
      },
      education: [
        {
          degree: "Bachelor in Management Information System",
          institution: "National Economic University",
          period: "2014-2018"
        },
        {
          degree: "Certificate of Graphic Design",
          institution: "FPT Arena University",
          period: "2018-2019"
        }
      ],
      accountInfo: {
        "Bank account": "02520613401",
        "Account name": "Nguyen Thi Minh Hang",
        Bank: "TPBank Duy Tan",
        "Tax code": "8456120546",
        "Insurance code": "8456120546"
      }
    };
  },
  methods: {
    toggleTheme() {
      document.body.classList.toggle("dark");
    }
  }
};
</script>

<style scoped>
.dashboard {
  background-color: var(--bg-color);
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
}

.profile-tabs {
  display: flex;
  gap: 1.5rem;
  border-bottom: 1px solid var(--table-header-bg);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.profile-tabs a {
  cursor: pointer;
  color: var(--text-muted);
  font-weight: 500;
}
.profile-tabs a.active {
  color: var(--text-color);
  border-bottom: 2px solid #3b82f6;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
  flex-wrap: wrap;
}

.profile-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}
.profile-info .role {
  margin: 0;
  font-size: 0.95rem;
}
.highlight {
  color: #3b82f6;
}

.profile-extra {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.info-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
}

.info-card h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.label {
  color: var(--text-muted);
}
.value {
  color: var(--text-color);
  text-align: right;
}

.edu-item {
  margin-bottom: 1rem;
}
.edu-title {
  font-weight: bold;
  color: var(--text-color);
}
.edu-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
}
.edu-date {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Tema claro */
:root {
  --bg-color: #f9fafb;
  --text-color: #1f2937;
  --text-muted: #6b7280;
  --card-bg: #ffffff;
  --card-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  --table-header-bg: #f3f4f6;
}

/* Tema escuro */
body.dark {
  --bg-color: #111827;
  --text-color: #f3f4f6;
  --text-muted: #9ca3af;
  --card-bg: #1f2937;
  --card-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  --table-header-bg: #374151;
}
</style>

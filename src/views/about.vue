<template>
  <NavBar/>
    <div>
      <header class="hero">
        <h1 class="title">Rodrigo Carlos Neto & Bernardo Villanova de Santana</h1>
        <p class="subtitle">Soluções inovadoras para seu negócio</p>
      </header>
  
      <footer>
        <p>&copy; 2025 Rodrigo & Bernardo. Todos os direitos reservados.</p>
      </footer>
    </div>
  </template>
  
  <script>
  import NavBar from "@/components/NavBar.vue";

  export default {
    name: 'AboutUs',
    components: {
      NavBar,
    },

    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      handleScroll() {
        const parallax = this.$refs.parallax;
        if (parallax) {
          let scrollPosition = window.pageYOffset;
          parallax.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .hero {
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
  }
  
  .parallax-section {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
  }
  
  .services {
    text-align: center;
    padding: 50px 20px;
  }
  
  .service-list {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .service-item {
    background: #333;
    color: white;
    padding: 20px;
    border-radius: 10px;
  }
  
  footer {
    text-align: center;
    padding: 20px;
    background: #111;
    color: white;
  }
  </style>
  
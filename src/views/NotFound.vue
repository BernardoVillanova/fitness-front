<template>
  <div class="page-404">
    <div class="container">
      <div class="glitch-wrapper">
        <h1 class="glitch-text">404</h1>
        <h1 class="glitch-text-shadow">404</h1>
        <h1 class="glitch-text-shadow-2">404</h1>
      </div>

      <div class="message-wrapper">
        <p class="glitch-message">Página não encontrada.</p>
        <p class="glitch-subtitle">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>
      </div>

      <div class="button-wrapper">
        <a @click="goHome" class="home-button">
          <svg
            class="home-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Go Home
        </a>
      </div>

      <div class="glitch-lines">
        <div class="glitch-line glitch-line-1"></div>
        <div class="glitch-line glitch-line-2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'


const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;500;900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-404 {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.container {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
}

.glitch-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.glitch-text {
  font-size: 9rem;
  font-weight: 900;
  user-select: none;
  color: transparent;
  animation: glitch-main 2s infinite;
}

.glitch-text-shadow {
  position: absolute;
  inset: 0;
  font-size: 9rem;
  font-weight: 900;
  user-select: none;
  color: #f1f5f9;
  animation: glitch-shadow-1 2s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text-shadow-2 {
  position: absolute;
  inset: 0;
  font-size: 9rem;
  font-weight: 900;
  user-select: none;
  color: #171717;
  animation: glitch-shadow-2 2s infinite;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@media (min-width: 768px) {
  .glitch-text,
  .glitch-text-shadow,
  .glitch-text-shadow-2 {
    font-size: 12rem;
  }
}

.message-wrapper {
  margin-bottom: 2rem;
}

.glitch-message {
  font-size: 1.25rem;
  font-weight: 200;
  color: #737373;
  margin-bottom: 1rem;
  animation: glitch-flicker 3s infinite;
}

@media (min-width: 768px) {
  .glitch-message {
    font-size: 1.5rem;
  }
}

.glitch-subtitle {
  font-size: 0.875rem;
  font-weight: 200;
  color: #dc2626;
  animation: glitch-typing 4s infinite;
}

@media (min-width: 768px) {
  .glitch-subtitle {
    font-size: 1rem;
  }
}

.button-wrapper {
  padding-top: 1rem;
}

.home-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #171717;
  color: #f5f5f5;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.home-button:hover {
  background-color: #0a0a0a;
}

.home-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
}

.home-button:hover .home-icon {
  transform: scale(1.1);
}

.glitch-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.glitch-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #666, transparent);
  opacity: 0;
}

.glitch-line-1 {
  top: 15%;
  animation: glitch-scan-1 3s infinite;
}

.glitch-line-2 {
  top: 85%;
  animation: glitch-scan-3 3.5s infinite;
}

@keyframes glitch-main {
  0%,
  100% {
    transform: translate(0);
  }
  10% {
    transform: translate(-2px, -1px);
  }
  20% {
    transform: translate(2px, 1px);
  }
  30% {
    transform: translate(-1px, 2px);
  }
  40% {
    transform: translate(1px, -2px);
  }
  50% {
    transform: translate(-2px, 1px);
  }
  60% {
    transform: translate(2px, -1px);
  }
  70% {
    transform: translate(-1px, -2px);
  }
  80% {
    transform: translate(1px, 2px);
  }
  90% {
    transform: translate(-2px, -1px);
  }
}

@keyframes glitch-shadow-1 {
  0%,
  100% {
    transform: translate(0);
  }
  10% {
    transform: translate(-4px, -2px);
  }
  20% {
    transform: translate(4px, 2px);
  }
  30% {
    transform: translate(-2px, 4px);
  }
  40% {
    transform: translate(2px, -4px);
  }
  50% {
    transform: translate(-4px, 2px);
  }
  60% {
    transform: translate(4px, -2px);
  }
  70% {
    transform: translate(-2px, -4px);
  }
  80% {
    transform: translate(2px, 4px);
  }
  90% {
    transform: translate(-4px, -2px);
  }
}

@keyframes glitch-shadow-2 {
  0%,
  100% {
    transform: translate(0);
  }
  10% {
    transform: translate(3px, 1px);
  }
  20% {
    transform: translate(-3px, -1px);
  }
  30% {
    transform: translate(1px, -3px);
  }
  40% {
    transform: translate(-1px, 3px);
  }
  50% {
    transform: translate(3px, -1px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(1px, 3px);
  }
  80% {
    transform: translate(-1px, -3px);
  }
  90% {
    transform: translate(3px, 1px);
  }
}

@keyframes glitch-flicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  51% {
    opacity: 1;
  }
  52% {
    opacity: 0.9;
  }
  53% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  91% {
    opacity: 0.7;
  }
  92% {
    opacity: 1;
  }
}

@keyframes glitch-typing {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

@keyframes glitch-scan-1 {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 0.8;
    transform: translateY(20px);
  }
}

@keyframes glitch-scan-3 {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 0.4;
    transform: translateY(10px);
  }
}
</style>
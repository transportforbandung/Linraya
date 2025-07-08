<template>
  <header class="navbar">
    <div>
      <a href="/">
        <img src="@/assets/Linraya-by-TfB.svg" alt="Linraya Logo" width="150" height="60">
      </a>
    </div>
    <nav class="nav-links" :class="{ open: menuOpen }">
      <ul>
        <li><a href="/tentang" class="bold">Tentang Linraya</a></li>
        <li><a href="/perkakas" class="bold">Perkakas</a></li>
        <li><a href="https://transportforbandung.org" class="button" style="color: #FFFFFF;">Transport for Bandung</a></li>
      </ul>
    </nav>
    <!--Hamburger for phone-->
    <button class="hamburger" :class="{ active: menuOpen }" @click="toggleMenu" aria-label="Navigation Menu">
      <span class="hamburger-box">
        <span class="hamburger-inner"></span>
      </span>
    </button>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<style scoped>
.navbar {
  position: fixed;
  /* Keeps the navbar fixed at the top */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  height: 100px;
  background-color: #FFFFFF;
  transition: background-color 0.3s ease;
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  padding: 10px 25px;
  top: 0;
  left: 0;
  z-index: 1001;
}

.nav-links {
  min-width: 0;
}

.nav-links ul {
  list-style-type: none;
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0;
  min-width: 0;
}

.nav-links ul li a {
  color: #000000;
  text-decoration: none;
  font-size: 20px;
  transition: color 0.3s ease;
  white-space: nowrap;
  display: block;
  padding: 5px 10px;
}

.nav-links ul li a:hover {
  color: #ff6347;
}

.hamburger {
  display: none;
  /* Hidden by default */
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 10px;
  z-index: 1002;
}

.hamburger-box {
  width: 35px;
  height: 24px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  width: 100%;
  height: 3px;
  background-color: #000;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.2s ease;
}

.hamburger-inner::before,
.hamburger-inner::after {
  content: '';
  width: 100%;
  height: 3px;
  background-color: #000;
  position: absolute;
  left: 0;
  transition: transform 0.2s ease;
}

.hamburger-inner::before {
  top: -8px;
}

.hamburger-inner::after {
  top: 8px;
}

@media (max-width: 972px) {
  .navbar {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    height: 110px;
    background-color: #FFFFFF;
    transition: background-color 0.3s ease;
    box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.20);
    padding: 10px 25px;
    top: 0;
    left: 0;
    z-index: 1001;
  }

  .hamburger {
    display: block;
  }

  .hamburger.active .hamburger-inner {
    background-color: transparent;
  }

  .hamburger.active .hamburger-inner::before {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger.active .hamburger-inner::after {
    transform: translateY(-8px) rotate(-45deg);
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    display: none;
    flex-direction: column;
    gap: 0;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links ul {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

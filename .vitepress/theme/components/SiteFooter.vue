<script setup lang="ts">
// Static, deterministic footer — no Date.now()/new Date() so SSR stays stable.
</script>

<template>
  <footer class="dl-footer">
    <div class="dl-footer__inner">
      <span class="dl-footer__brand">DEVLOG</span>
      <span class="dl-footer__note">Engineering notes · built with VitePress</span>
    </div>
  </footer>
</template>

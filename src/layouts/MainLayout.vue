<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="modern-header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />

        <q-toolbar-title class="text-weight-medium">
          General Needs Assessment
        </q-toolbar-title>

        <q-chip outline color="white" text-color="white" class="version-chip">
          <q-icon name="new_releases" size="xs" class="q-mr-xs" />
          v0.01
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="modern-drawer"
    >
      <!-- User Profile Section -->
      <div class="user-profile q-pa-md">
        <q-avatar size="72px" class="q-mb-sm">
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
        <div class="text-weight-medium text-subtitle1">John Doe</div>
        <div class="text-caption">Administrator</div>
      </div>

      <q-separator />

      <q-list padding class="menu-list">
        <q-item-label header class="text-weight-bold q-pb-xs">Navigation</q-item-label>

        <!-- Tasks Section -->
        <q-item to="/tasks" clickable exact v-ripple class="nav-item">
          <q-item-section avatar>
            <q-icon name="task" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Tasks</q-item-label>
            <q-item-label caption>Manage your tasks</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Document Section -->
        <q-item to="/document" clickable exact v-ripple class="nav-item">
          <q-item-section avatar>
            <q-icon name="description" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Document</q-item-label>
            <q-item-label caption>View and edit documents</q-item-label>
          </q-item-section>
        </q-item>

        <!-- ...existing code... -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="scss">
.modern-header {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);

  .q-toolbar {
    height: 64px;
  }

  .version-chip {
    min-height: 24px;
    font-size: 0.7rem;
    border-radius: 12px;
  }
}

.modern-drawer {
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 24px;
    padding-bottom: 24px;
    background: linear-gradient(to bottom, rgba(247, 250, 252, 0.7), transparent);
  }

  .menu-list {
    .q-item-label.header {
      color: #4a5568;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      margin-top: 8px;
    }

    .nav-item {
      border-radius: 8px;
      margin: 4px 8px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.03);
      }

      &.q-router-link-exact-active {
        background-color: #e6f7ff;

        .q-icon {
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>

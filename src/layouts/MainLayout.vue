<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="modern-header shadow-3">
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
      elevated
      class="modern-drawer shadow-5"
    >
      <!-- User Profile Section -->
      <div class="user-profile q-pa-md">
        <q-avatar size="72px" class="q-mb-sm">
          <img src="https://avatars.githubusercontent.com/u/1234567?v=4">
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
            <q-icon name="task" color="blue-grey-2" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-blue-grey-2 text-h6">Tasks</q-item-label>
            <q-item-label class="text-blue-grey-4" caption>Manage your tasks</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Document Section -->
        <q-item to="/document" clickable exact v-ripple class="nav-item">
          <q-item-section avatar>
            <q-icon name="description" color="blue-grey-2" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-blue-grey-2 text-h6">Document</q-item-label>
            <q-item-label class="text-blue-grey-4" caption>View and edit documents</q-item-label>
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
  background: #2d3748; // Dark background color, similar to the header

  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 24px;
    padding-bottom: 24px;
    background: rgba(45, 55, 72, 0.7); // Darker translucent background

    .text-subtitle1, .text-caption {
      color: #fff; // Ensure text is readable on the dark background
    }
  }

  .menu-list {
    .q-item-label.header {
      color: #f7fafc; // Even lighter color for better readability on dark background
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      margin-top: 8px;
      font-weight: 600; // Make headers slightly bolder
    }

    .nav-item {
      border-radius: 10px; // Slightly more rounded corners
      margin: 6px 12px; // Adjusted margins for better spacing
      padding: 10px 16px; // Add padding to the items

      &:hover {
        background-color: rgba(255, 255, 255, 0.1); // Increased hover effect contrast
      }

      &.q-router-link-exact-active {
        background-color: #3182ce; // More visible active state with blue background
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); // Add subtle shadow to active item

        .q-item-section {
          color: #fff; // Ensure text is readable on the active background
        }
      }      .q-item-section {
        color: #f8fafc; // Slightly softer white for better eye comfort

        .q-item-label {
          font-weight: 500; // Make main labels slightly bolder
        }

        .q-item-label.caption {
          color: #f1f5f9; // Lighter caption text for better readability
          font-weight: 400;
          opacity: 0.85; // Add slight transparency for visual hierarchy
      }
    }
  }
}}
</style>

export const routes = [
  {
    path: '/',
    component: () => import('../layouts/main.vue'),
    children: [
      {
        name: 'home',
        path: '',
        meta: {
          public: true
        },
        component: () => import('../views/Home.vue')
      },
      {
        name: 'login',
        path: 'login',
        meta: {
          public: true
        },
        component: () => import('../views/Home.vue')
      },
      {
        name: 'register',
        path: 'register',
        meta: {
          public: true
        },
        component: () => import('../views/Home.vue')
      },
      {
        path: '/code/:code',
        name: 'Verify',
        meta: {
          public: true
        },
        component: () => import('../views/Home.vue')
      },
      {
        path: '/reset/:resetcode',
        name: 'Reset',
        meta: {
          public: true
        },
        component: () => import('../views/Home.vue')
      },
      {
        name: 'offers',
        path: 'offers',
        meta: {
          public: true
        },
        component: () => import('../views/Offers.vue')
      },
      {
        name: 'new-offer',
        path: '/configure',
        component: () => import('../views/Configure.vue')
      },
      {
        name: 'configure',
        path: '/configure/:id',
        component: () => import('../views/Configure.vue')
      },
      {
        name: 'offer',
        path: '/offer/:id',
        meta: {
          public: true
        },
        component: () => import('../views/Offer.vue')
      },
      // {
      //   name: 'companies',
      //   path: 'companies',
      //   meta: {
      //     public: true
      //   }
      //   // component: () => import('../views/Companies.vue')
      // },
      {
        name: 'profile',
        path: 'profile',
        component: () => import('../views/Profile.vue')
      },
      {
        name: 'userProfile',
        path: '/profile/:id',
        component: () => import('../views/Profile')
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../views/Settings.vue')
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../views/Users.vue')
      }
    ]
  }
]

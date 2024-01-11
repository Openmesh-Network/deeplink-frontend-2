import { Menu } from '@/types/menu'

const menuData: Menu[] = [
  // {
  //   id: 1,
  //   title: 'About',
  //   path: `https://open-mesh.gitbook.io/l3a-dao-documentation/about/openr-and-d-101`,
  //   newTab: false,
  // },
  {
    id: 2,
    title: 'Docs',
    path: 'https://open-mesh.gitbook.io/l3a-dao-documentation/about/openr-and-d-101',
    newTab: true,
  },
  {
    id: 3,
    title: 'Forum',
    path: 'https://discord.gg/e3XMT8846F',
    newTab: true,
  },
  // {
  //   id: 4,
  //   title: 'FAQs',
  //   path: `https://open-mesh.gitbook.io/l3a-dao-documentation/faqs`,
  //   newTab: true,
  // },
  {
    id: 5,
    title: 'Activities',
    path: `${
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
        ? `/openrd/activities`
        : `/activities`
    }`,
    newTab: false,
  },
  {
    id: 6,
    title: 'Staking',
    path: `${
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
        ? `/openrd/staking`
        : `/staking`
    }`,
    newTab: false,
  },
  {
    id: 7,
    title: 'Fundraising',
    path: `${
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
        ? `/openrd/fundraising`
        : `/fundraising`
    }`,
    newTab: false,
  },
  {
    id: 8,
    title: 'Profile',
    path: `${
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
        ? `/openrd/profile`
        : `/profile`
    }`,
    newTab: false,
  },
  // {
  //   id: 33,
  //   title: 'Blog',
  //   path: '/blog',
  //   newTab: false,
  // },
  // {
  //   id: 3,
  //   title: 'Support',
  //   path: '/contact',
  //   newTab: false,
  // },
  // {
  //   id: 4,
  //   title: 'Docs',
  //   newTab: false,
  //   submenu: [
  //     {
  //       id: 41,
  //       title: 'About Page',
  //       path: '/about',
  //       newTab: false,
  //     },
  //     {
  //       id: 42,
  //       title: 'Contact Page',
  //       path: '/contact',
  //       newTab: false,
  //     },
  //     {
  //       id: 43,
  //       title: 'Blog Grid Page',
  //       path: '/blog',
  //       newTab: false,
  //     },
  //     {
  //       id: 44,
  //       title: 'Blog Sidebar Page',
  //       path: '/blog-sidebar',
  //       newTab: false,
  //     },
  //     {
  //       id: 45,
  //       title: 'Blog Details Page',
  //       path: '/blog-details',
  //       newTab: false,
  //     },
  //     {
  //       id: 46,
  //       title: 'Sign In Page',
  //       path: '/signin',
  //       newTab: false,
  //     },
  //     {
  //       id: 47,
  //       title: 'Sign Up Page',
  //       path: '/signup',
  //       newTab: false,
  //     },
  //     {
  //       id: 48,
  //       title: 'Error Page',
  //       path: '/error',
  //       newTab: false,
  //     },
  //   ],
  // },
]
export default menuData

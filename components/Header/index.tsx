/* eslint-disable no-unused-vars */
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useContext } from 'react'
import ThemeToggler from './ThemeToggler'
import menuData from './menuData'
import { usePathname } from 'next/navigation'
import {
  useWeb3ModalTheme,
  Web3NetworkSwitch,
  Web3Button,
} from '@web3modal/react'
import { useNetwork, useAccount } from 'wagmi'
import { AccountContext } from '@/contexts/AccountContext'
import nookies, { parseCookies, destroyCookie } from 'nookies'
import axios from 'axios'

const Header = () => {
  const { address } = useAccount()
  const { chain, chains } = useNetwork()
  const pathname = usePathname()
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [isChainWrong, setIsChainWrong] = useState(false)
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen)
  }
  const [userNavbarOpen, setUserNavbarOpen] = useState(false)

  const { theme, setTheme } = useWeb3ModalTheme()
  const { user, setUser } = useContext(AccountContext)

  const cookies = parseCookies()
  const userHasAnyCookie = cookies.userSessionToken

  // Sticky Navbar
  const [sticky, setSticky] = useState(false)
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true)
    } else {
      setSticky(false)
    }
  }
  // Este useEffect está travando a aplicação, econtrar maneira de tratar isto.
  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar)
    if (chain && chain.name !== process.env.NEXT_PUBLIC_WALLET_ENVIRONMENT) {
      setIsChainWrong(true)
      setTheme({
        themeMode: 'dark',
        themeVariables: {
          '--w3m-accent-color': `${isChainWrong ? '#bf0d0d' : ''}`,
          // ...
        },
      })
    } else {
      setIsChainWrong(false)
      setTheme({
        themeVariables: {
          '--w3m-accent-color': '#000000',
          // ...
        },
      })
    }
  }, [chain, isChainWrong, setTheme, address])

  async function getUserData() {
    const { userSessionToken } = parseCookies()
    console.log('no user data')
    console.log(userSessionToken)
    if (userSessionToken) {
      const config = {
        method: 'post' as 'post',
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/getCurrentUser`,
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': userSessionToken,
          'Content-Type': 'application/json',
        },
      }
      let dado

      await axios(config).then(function (response) {
        if (response.data) {
          dado = response.data
          console.log(dado)
          setUser(dado)
        }
      })
    }
  }

  useEffect(() => {
    // if the user has the wallet connected and the login, we prioritize the wallet.
    if (userHasAnyCookie && !address) {
      console.log('user has cookis')
      console.log(userHasAnyCookie)
      console.log(cookies.userSessionToken)
      try {
        getUserData()
      } catch (err) {
        destroyCookie(undefined, 'userSessionToken')
        setUser(null)
      }
    } else {
      localStorage.removeItem('@scalable: user-state-1.0.0')
      destroyCookie(undefined, 'userSessionToken')
      setUser(null)
    }
  }, [])

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1)
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1)
    } else {
      setOpenIndex(index)
    }
  }

  function signOutUser() {
    destroyCookie(undefined, 'userSessionToken')
    localStorage.removeItem('@scalable: user-state-1.0.0')
    nookies.destroy(null, 'userSessionToken')
    setUser(null)
  }

  return (
    <>
      <header
        className={`header z-50 flex w-full items-center bg-[#fff] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)]`}
      >
        <div className="w-full px-[16px] md:px-[19.2px] lg:px-[22.4px] xl:px-[25.5px] 2xl:px-[34px]">
          <div className="relative  flex items-center  text-black">
            <div className="">
              <Link
                href={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? `/openrd/`
                    : `/`
                }`}
                className={`header-logo block w-[90px] md:mr-[62px] md:w-[80px] lg:mr-[71px] lg:w-[95px] xl:mr-[81.6px] xl:w-[109px]  2xl:mr-[102px] 2xl:w-[136px]`}
              >
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/header/logo.svg`}
                  alt="image"
                  className={`w-[90px] md:w-[80px] lg:w-[95px] xl:w-[109px] 2xl:w-[136px]`}
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between py-[25px] lg:py-[0px]">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300  ${
                      navbarOpen ? ' top-[7px] rotate-45' : ' '
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                      navbarOpen ? 'opacity-0 ' : ' '
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300  ${
                      navbarOpen ? ' top-[-8px] -rotate-45' : ' '
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white py-4 px-6 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:mr-[95px] lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? 'visibility top-full opacity-100'
                      : 'invisible top-[120%] opacity-0'
                  }`}
                >
                  <ul className="block  pt-[17px] pb-[19.5px] md:gap-x-[39px] md:pt-[20.5px] md:pb-[23.5px]  lg:flex lg:gap-x-[45.5px] lg:pt-[24px] lg:pb-[27px] xl:gap-x-[52px] xl:pt-[27px] xl:pb-[31px] 2xl:gap-x-[65px] 2xl:pt-[34px] 2xl:pb-[39px]">
                    {menuData.map((menuItem, index) => (
                      <li key={menuItem.id} className="group relative">
                        {menuItem.path ? (
                          menuItem.title === 'Profile' && !address ? null : (
                            <a
                              href={
                                menuItem.title === 'Profile'
                                  ? `${
                                      process.env.NEXT_PUBLIC_ENVIRONMENT ===
                                      'PROD'
                                        ? `/openrd/profile/${address}`
                                        : `/profile/${address}`
                                    }`
                                  : `${
                                      process.env.NEXT_PUBLIC_ENVIRONMENT ===
                                      'PROD'
                                        ? menuItem.path
                                        : menuItem.path
                                    }`
                              }
                              target={menuItem.newTab ? '_blank' : ''}
                              rel={menuItem.newTab ? 'noopener noreferrer' : ''}
                              className={`flex text-[7px] font-normal text-[#ffffff] group-hover:opacity-70 md:text-[8.4px] lg:mr-0 lg:inline-flex lg:px-0 lg:text-[9.8px] lg:text-[#000000] xl:text-[11.2px] 2xl:text-[14px] ${
                                pathname.includes(menuItem.path)
                                  ? 'font-bold'
                                  : ''
                              }`}
                            >
                              {menuItem.title}
                            </a>
                          )
                        ) : (
                          <>
                            <a
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="15" height="14" viewBox="0 0 15 14">
                                  <path
                                    d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </a>
                            <div
                              className={`submenu relative top-full left-0 rounded-md bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? 'block' : 'hidden'
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem) => (
                                <Link
                                  href={submenuItem.path}
                                  key={submenuItem.id}
                                  className="block rounded py-2.5 text-sm text-dark hover:opacity-70 lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                    <a
                      href={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? `/openrd/verified-contributor`
                          : `/verified-contributor`
                      }`}
                      target="_blank"
                      rel="nofollow noreferrer"
                      className={`flex py-2 text-[16px] font-medium text-[#ffffff] group-hover:opacity-70 lg:mr-0 lg:hidden lg:py-6 lg:px-0 lg:text-[#000000]`}
                    >
                      Verified contributor
                    </a>
                    <div className="lg:hidden">
                      <Web3Button />
                    </div>
                  </ul>
                </nav>
              </div>
              <div className="flex w-fit items-center justify-end gap-x-[15px]  pr-16 md:gap-x-[18px] lg:gap-x-[21px] lg:pr-0 xl:gap-x-[24px] 2xl:gap-x-[30px]">
                <a
                  href={`https://open-mesh.gitbook.io/l3a-dao-documentation/verified-contributor-guide/apply-as-verified-contributor`}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <div className="ml-[5px] hidden cursor-pointer items-center justify-center gap-x-[5px] rounded-[10px] border border-[#0354EC] px-[11px]  py-[5.25px]  font-semibold text-[#0354EC] hover:bg-[#0354EC] hover:text-[#fff] md:gap-x-[6px] md:px-[13px] md:py-[6.3px] lg:flex lg:gap-x-[7px] lg:px-[15.5px] lg:py-[7.35px] xl:gap-x-[8px] xl:px-[17.5px] xl:py-[8.4px] 2xl:gap-x-[10px] 2xl:px-[21.5px] 2xl:py-[10.5px]">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/header/check-blue.svg`}
                      alt="image"
                      className={`w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]`}
                    />
                    <a
                      href={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? `/openrd/verified-contributor`
                          : `/verified-contributor`
                      }`}
                      target="_blank"
                      rel="nofollow noreferrer"
                      className="text-[7px] font-semibold md:text-[8.4px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]"
                    >
                      Become a Contributor
                    </a>
                  </div>
                </a>
                {user?.sessionToken ? (
                  <div>
                    <img
                      src={
                        !user.profilePictureHash
                          ? `${
                              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                ? process.env.NEXT_PUBLIC_BASE_PATH
                                : ''
                            }/images/header/user-circle.svg`
                          : `https://cloudflare-ipfs.com/ipfs/${user.profilePictureHash}`
                      }
                      alt="image"
                      onClick={() => {
                        setUserNavbarOpen(!userNavbarOpen)
                      }}
                      className={`mr-[15px] h-[50px] w-[50px] cursor-pointer rounded-[100%] 2xl:mr-[15px]`}
                    />
                    <nav
                      className={`navbar absolute right-[50px] z-50 flex w-[200px] rounded-[8px] border-[.5px] bg-[#e6e4e4] pt-[19px] pr-1 pl-[35px] pb-[30px] text-[13px] text-[#fff] duration-300  ${
                        userNavbarOpen
                          ? 'visibility top-20 opacity-100'
                          : 'invisible top-20 opacity-0'
                      }`}
                    >
                      <div className="mt-[10px]">
                        {/* <div className=" grid gap-y-[15px] text-[15px]  font-medium !leading-[19px]">
                          <div className="flex h-full items-center">
                            <a
                              href={`${
                                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                  ? `/oec/my-account`
                                  : '/my-account'
                              }`}
                              className={`flex h-full cursor-pointer items-center text-[#000]  hover:text-[#313131]`}
                            >
                              My account
                            </a>
                          </div>
                          <div className="flex h-full items-center">
                            <a
                              href={`${
                                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                  ? `/oec/change-password`
                                  : '/change-password'
                              }`}
                              className={`flex h-full cursor-pointer items-center text-[#000]  hover:text-[#313131]`}
                            >
                              Change password
                            </a>
                          </div>
                        </div> */}
                        <div className="">
                          <a
                            onClick={signOutUser}
                            className=" cursor-pointer items-center rounded-[5px] border  border-[#000] bg-transparent py-[6px] px-[18px] text-[12px] font-bold !leading-[19px] text-[#575757] hover:bg-[#ececec]"
                          >
                            Sign out
                          </a>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setUserNavbarOpen(false)
                        }}
                        className="ml-[20px]  flex cursor-pointer justify-end text-[16px] font-bold text-[#000] hover:text-[#313131]"
                      >
                        x
                      </div>
                    </nav>
                  </div>
                ) : (
                  <div className="">
                    <div className="hidden lg:block">{<Web3Button />}</div>
                    <div className="">
                      {isChainWrong && <Web3NetworkSwitch />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header

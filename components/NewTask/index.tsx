// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable no-unused-vars */
// 'use client'
// // import { useState } from 'react'
// import { useEffect, useState } from 'react'
// import { usePathname, useSearchParams } from 'next/navigation'
// import { UserOutlined } from '@ant-design/icons'
// import TransactionList from '../TaskTransactionsList'

// const NewTask = (id: any) => {
//   const [filteredTasks, setFilteredTasks] = useState([])
//   const [departament, setDepartament] = useState('All')
//   const [isLoading, setIsLoading] = useState<boolean>(false)

//   useEffect(() => {
//     if (id) {
//       console.log('search for the task info on blockchain')
//       console.log(id)
//     }
//   }, [id])
//   function formatAddress(address) {
//     return `${address.slice(0, 6)}...${address.slice(-4)}`
//   }
//   // mock data for task
//   const task = [
//     {
//       id: 1,
//       logo: '/images/carousel/blockchainLogo.svg',
//       name: 'Trading research',
//       description:
//         'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
//       categories: ['Ai', 'Blockchain', 'Science'],
//       departament: 'Data and analytics',
//       submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
//       deadline: '210203921930',
//       status: 'Open',
//       budget: ['250 USDT'],
//     },
//   ]

//   return (
//     <section className="py-16 px-32 text-black md:py-20 lg:pt-40">
//       <div className="container  border-b-4 border-[#8d8d8d] pb-5">
//         <div className="-mx-4 flex flex-wrap items-start">
//           <div className="w-full px-4">
//             <div className="wow fadeInUp" data-wow-delay=".2s">
//               <div className="mb-1">
//                 <h3 className="mb-4 text-xl font-normal  sm:text-3xl lg:text-4xl xl:text-5xl">
//                   Create a task
//                 </h3>
//                 <form
//                   onSubmit={handleSubmit(onSubmit)}
//                   className="ms:h-[502px] ms:flex-col ms:pt-[29px] ms:px-[20px] ms:w-full flex h-[449px] w-[831px] flex-row justify-between px-[60px] pt-[35px]"
//                 >
//                   <div className="ms:w-full">
//                     <div className="border-grayLabel ms:mb-[10.41px] ms:w-full mb-[20px] flex w-[317px] flex-col border-b-[1px]">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         Nome da sua empresa
//                         <p className="text-red-500 ml-[8px] text-[13px] ">
//                           {errors.nomeEmpresa?.message}
//                         </p>
//                       </span>
//                       <input
//                         className="text-gray700 placeholder-grayLabel mt-[8px] h-[30px] border-none pl-0 text-[17px] font-semibold leading-[30px] shadow-none outline-0 focus:ring-0"
//                         type="text"
//                         placeholder="Insira o nome aqui"
//                         {...register('nomeEmpresa')}
//                       />
//                     </div>

//                     <div className="none border-grayLabel ms:mb-[10.41px] ms:w-full mb-[20px] flex w-[317px] flex-col border-b-[1px]">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         E-mail
//                         <p className="text-red-500 ml-[8px] text-[13px]">
//                           {errors.email?.message}
//                         </p>
//                       </span>
//                       <input
//                         className="text-gray700 placeholder-grayLabel mt-[8px] h-[30px] border-none pl-0 text-[17px] font-semibold leading-[30px] outline-0 focus:ring-0"
//                         type="text"
//                         placeholder="meuemail@mail.com"
//                         {...register('email')}
//                       />
//                     </div>

//                     <div className="none border-grayLabel ms:mb-[10.41px] ms:w-full mb-[20px] flex w-[317px] flex-col border-b-[1px] pl-0">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         Confirmação do e-mail
//                         <p className="text-red-500 ml-[8px] text-[13px]">
//                           {errors.comfirmEmail?.message}
//                         </p>
//                       </span>
//                       <input
//                         className="text-gray700 placeholder-grayLabel mt-[8px] h-[30px] border-none pl-0 text-[17px] font-semibold leading-[30px] outline-0 focus:ring-0"
//                         type="text"
//                         placeholder="meuemail@mail.com"
//                         {...register('comfirmEmail')}
//                       />
//                     </div>

//                     <div className="border-grayLabel ms:mb-[10.41px] ms:w-full mb-[20px] flex w-[317px] flex-col border-b-[1px] pl-[0px]">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         Senha
//                         <p className="text-red-500 ml-[8px] text-[13px]">
//                           {errors.senha?.message}
//                         </p>
//                       </span>
//                       <div className="flex w-full">
//                         <input
//                           className="text-gray700 placeholder-grayLabel mt-[8px] h-[30px] w-full border-none pl-0 text-[17px] font-semibold leading-[30px] outline-0 focus:ring-0"
//                           type={passwordVisibility ? 'password' : 'text'}
//                           placeholder="Minhasenha123!"
//                           {...register('senha')}
//                         />
//                         {passwordVisibility ? (
//                           <EyeSlash
//                             className="mt-4 cursor-pointer"
//                             onClick={() => setPasswordVisibility(false)}
//                           />
//                         ) : (
//                           <Eye
//                             className="mt-4 cursor-pointer"
//                             onClick={() => setPasswordVisibility(true)}
//                           />
//                         )}
//                       </div>
//                     </div>

//                     <div className="border-grayLabel ms:mb-[10.41px] ms:w-full mb-[20px] flex w-[317px] flex-col border-b-[1px]">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         CNPJ
//                         <p className="text-red-500 ml-[8px] text-[13px]">
//                           {errors.cnpj?.message}
//                         </p>
//                       </span>
//                       <input
//                         className="text-gray700 placeholder-grayLabel mt-[8px] h-[30px] border-none pl-0 text-[17px] font-semibold leading-[30px] outline-0 focus:ring-0"
//                         type="text"
//                         placeholder="xx.xxx.xxx/0001-xx"
//                         {...register('cnpj')}
//                         value={cnpjMask}
//                         onChange={(e) =>
//                           setCnpjMask(mascaraCnpj(e.target.value))
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="ms:w-full">
//                     <div className="border-grayLabel ms:mb-[10.41px] ms:w-full mb-[15px] flex w-[317px] flex-col border-b-[1px]">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         Website
//                         <p className="text-red-500 ml-[8px] text-[13px]">
//                           {errors.website?.message}
//                         </p>
//                       </span>
//                       <input
//                         className="text-gray700 placeholder-grayLabel mt-[8px] h-[30px] border-none pl-0 text-[17px] font-semibold leading-[30px] outline-0 focus:ring-0"
//                         type="text"
//                         placeholder="www.seusite.com.br"
//                         {...register('website')}
//                       />
//                     </div>
//                     <div className="ms:mb-[10.41px] ms:w-full mb-[15px] flex w-[317px] flex-col">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         Tipo de negócio
//                         <p className="text-red-500 ml-[8px] text-[13px]">
//                           {erroMessage}
//                         </p>
//                       </span>
//                       {/* DROPDOWN */}
//                       <DropdownComponent
//                         title="Selecione"
//                         dataList={businessList}
//                         onSet={setBussines}
//                       />
//                     </div>
//                     <div className="ms:mb-[10.41px] ms:w-full mb-[15px] flex w-[317px] flex-col">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         Localidade da empresa
//                         <p className="text-red-500 ml-[8px] text-[13px]">
//                           {erroMessage}
//                         </p>
//                       </span>
//                       {/* DROPDOWN */}
//                       <DropdownComponent
//                         title="Selecione"
//                         dataList={countryList}
//                         onSet={setPais}
//                       />
//                     </div>

//                     <div className="ms:mb-[15px] ms:w-full mb-[15px] flex w-[317px] flex-col">
//                       <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
//                         Como você ouviu falar da Scalable?
//                         <p className="text-red-500 ml-[8px] text-[13px]">
//                           {erroMessage}
//                         </p>
//                       </span>
//                       {/* DROPDOWN */}
//                       <DropdownComponent
//                         title="Selecione"
//                         dataList={socialmediaList}
//                         onSet={setVia}
//                       />
//                     </div>

//                     <div className="ms:justify-start ms:w-full flex justify-end">
//                       <button
//                         type="submit"
//                         className="bg-blue500 hover:bg-blue-400 ms:w-[317px] flex justify-between rounded-[10px] p-[15px] text-[14px] font-semibold leading-[18px] text-white"
//                         onClick={handleSubmit(onSubmit)}
//                       >
//                         <span>Create</span>
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default NewTask

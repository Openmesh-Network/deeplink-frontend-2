/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
import { FundingTx } from '@/types/fundingTx'
import { formatAddress } from '@/utils/functions'
import { formatDistanceToNow, format } from 'date-fns'

interface ModalProps {
  transactions: FundingTx[]
}

const Stats = ({ ...data }: ModalProps) => {
  function formatDeadline(dateReceived: string) {
    if (dateReceived) {
      const date = new Date(dateReceived)
      let difference = formatDistanceToNow(date)

      // Aqui estamos tratando a frase para exibir 'today' se a task foi criada no mesmo dia
      difference = `${difference.charAt(0).toUpperCase()}${difference.slice(
        1,
      )} ago`
      return difference
    } else {
      return ''
    }
  }

  function formatDeadline2(dateString) {
    if (dateString) {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy')
    } else {
      return ''
    }
  }

  const commonClasses =
    'pb-[17.5px] whitespace-nowrap font-bold md:pb-[21px] lg:pb-[24.5px] xl:pb-[28px] 2xl:pb-[35px] 2xl:text-[11px] xl:text-[8.8px] lg:text-[7.7px] md:text-[6.6px] text-[5.5px]'

  const renderTable = () => {
    return (
      <div className=" mx-auto flex w-full justify-between text-[#000]  xl:w-[1052px] 2xl:w-[1315px]">
        <table className="mx-auto w-full">
          <thead className="">
            <tr>
              <th
                scope="col"
                className="text-left  text-[8px]  font-normal tracking-wider md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]"
              >
                Wallet{' '}
              </th>
              <th
                scope="col"
                className="text-left text-[9px]  font-normal  tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Time
              </th>
              <th
                scope="col"
                className="text-left text-[9px]  font-normal  tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Amount
              </th>
              <th
                scope="col"
                className="text-left text-[9px]  font-normal  tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                OPEN token distribution{' '}
              </th>
              <th
                scope="col"
                className="text-left text-[9px]  font-normal  tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Status tx{' '}
              </th>
              <th
                scope="col"
                className="text-left text-[9px]  font-normal  tracking-wider md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]"
              >
                Early Validator Node Pass{' '}
              </th>
            </tr>
          </thead>
          <div className="mt-[25px]"></div>
          <tbody className="">
            {data.transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className={`${commonClasses}`}>
                  <div>{formatAddress(transaction.wallet)}</div>
                </td>
                <td className={commonClasses}>
                  {`${formatDeadline(transaction.createdAt)}, ${formatDeadline2(
                    transaction.createdAt,
                  )}`}
                </td>
                <td className={commonClasses}>{transaction.amount}</td>
                <td className={commonClasses}>{transaction.openTokenAmount}</td>
                <td className={commonClasses}>{transaction.status}</td>
                <td className={commonClasses}>
                  {transaction.validatorNodePass}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <section className="mx-auto w-full font-normal tracking-tight text-[#000]">
      <div className="mx-auto flex w-full justify-between text-center xl:w-[992px] 2xl:w-[1240px] 2xl:gap-x-[10px]">
        <div className="relative">
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[120%] xl:text-[16px] 2xl:text-[20px]">
            Week 01
          </div>
          <div className="mx-auto mt-[6px] text-[7px] font-normal md:text-[8.4px] lg:text-[9.8px] lg:!leading-[120%] xl:max-w-[136px] xl:text-[11.2px] 2xl:max-w-[170px] 2xl:text-[14px]">
            11:59PM UTC, 28th Nov - 11:59PM UTC, 05th Dec
          </div>
          <div className="mt-[12.5px] text-[10px] font-normal md:mt-[15px] md:text-[12px] lg:mt-[17.5px] lg:text-[14px] lg:!leading-[120%] xl:mt-[18px] xl:text-[16px] 2xl:mt-[22px] 2xl:text-[20px]">
            1ETH = 30,000 OPEN
          </div>
          <div className="flex justify-center">
            <img
              src={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? process.env.NEXT_PUBLIC_BASE_PATH
                  : ''
              }/images/staking/arrow-down.svg`}
              alt="image"
              className={`absolute -top-[11px] w-[6px] md:w-[7.2px] lg:w-[8.4px] xl:-top-[15px] xl:w-[9.6px] 2xl:-top-[18px] 2xl:w-[12px]`}
            />
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[120%] xl:text-[16px] 2xl:text-[20px]">
            Week 02
          </div>
          <div className="mx-auto mt-[6px] text-[7px] font-normal md:text-[8.4px] lg:text-[9.8px] lg:!leading-[120%] xl:max-w-[136px] xl:text-[11.2px] 2xl:max-w-[170px] 2xl:text-[14px]">
            11:59PM UTC, 28th Nov - 11:59PM UTC, 05th Dec
          </div>
          <div className="mt-[12.5px] text-[10px] font-normal md:mt-[15px] md:text-[12px] lg:mt-[17.5px] lg:text-[14px] lg:!leading-[120%] xl:mt-[18px] xl:text-[16px] 2xl:mt-[22px] 2xl:text-[20px]">
            1ETH = 30,000 OPEN
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[120%] xl:text-[16px] 2xl:text-[20px]">
            Week 03
          </div>
          <div className="mx-auto mt-[6px] text-[7px] font-normal md:text-[8.4px] lg:text-[9.8px] lg:!leading-[120%] xl:max-w-[136px] xl:text-[11.2px] 2xl:max-w-[170px] 2xl:text-[14px]">
            11:59PM UTC, 28th Nov - 11:59PM UTC, 05th Dec
          </div>
          <div className="mt-[12.5px] text-[10px] font-normal md:mt-[15px] md:text-[12px] lg:mt-[17.5px] lg:text-[14px] lg:!leading-[120%] xl:mt-[18px] xl:text-[16px] 2xl:mt-[22px] 2xl:text-[20px]">
            1ETH = 30,000 OPEN
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[120%] xl:text-[16px] 2xl:text-[20px]">
            Week 04
          </div>
          <div className="mx-auto mt-[6px] text-[7px] font-normal md:text-[8.4px] lg:text-[9.8px] lg:!leading-[120%] xl:max-w-[136px] xl:text-[11.2px] 2xl:max-w-[170px] 2xl:text-[14px]">
            11:59PM UTC, 28th Nov - 11:59PM UTC, 05th Dec
          </div>
          <div className="mt-[12.5px] text-[10px] font-normal md:mt-[15px] md:text-[12px] lg:mt-[17.5px] lg:text-[14px] lg:!leading-[120%] xl:mt-[18px] xl:text-[16px] 2xl:mt-[22px] 2xl:text-[20px]">
            1ETH = 30,000 OPEN
          </div>
        </div>
      </div>
      <div className="base:mt-[88.5px] mx-auto flex w-full justify-between text-center md:mt-[106.2px] lg:mt-[123.9px] xl:mt-[141.6px] xl:w-[992px] 2xl:mt-[177px] 2xl:w-[900px] 2xl:gap-x-[10px]">
        <div className="cursor-pointer text-[8px] underline underline-offset-4 hover:text-[#0354EC] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]">
          More details Openmesh Genesis
        </div>
        <a
          href="https://docs.openmesh.network/openmesh/openmesh-overview"
          target="_blank"
          rel="noreferrer"
        >
          <div className="cursor-pointer text-[8px] underline underline-offset-4 hover:text-[#0354EC] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]">
            Openmesh Vision{' '}
          </div>
        </a>

        <a
          href="https://boards.greenhouse.io/openmesh"
          target="_blank"
          rel="noreferrer"
        >
          <div className="cursor-pointer text-[8px] underline underline-offset-4 hover:text-[#0354EC] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]">
            Openmesh Career{' '}
          </div>
        </a>

        <a
          href="https://docs.openmesh.network/products/xnode"
          target="_blank"
          rel="noreferrer"
        >
          <div className="cursor-pointer text-[8px] underline underline-offset-4 hover:text-[#0354EC] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]">
            Openmesh Technology{' '}
          </div>
        </a>
      </div>
      <div className="mx-auto w-fit">
        <div className="mt-[75px] text-[8px] font-bold md:mt-[90px] md:text-[9.6px] lg:mt-[105px] lg:text-[11.2px] xl:mt-[120px] xl:text-[12.8px] 2xl:mt-[150px] 2xl:text-[16px]">
          Activities{' '}
        </div>
        <div className="mt-[24px] md:mt-[29px] lg:mt-[34px] xl:mt-[38px] 2xl:mt-[48px]">
          {renderTable()}
        </div>
      </div>
    </section>
  )
}

export default Stats

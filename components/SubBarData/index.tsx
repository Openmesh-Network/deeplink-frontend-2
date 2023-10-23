/* eslint-disable no-unused-vars */
import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'

/* eslint-disable react/no-unescaped-entities */
const SubBarData = ({ onValueChange }) => {
  const [presetId, setPresetId] = useState(0)
  const { selectionSideNavBar, setSelectionSideNavBar, next, setNext } =
    useContext(AccountContext)
  const [selectionSubBar, setSelectionSubBar] = useState<string>('')

  const categoriesOptions = [
    {
      title: 'Crypto Exchanges',
      isFree: true,
      enabled: true,
      dataOptions: [
        {
          icon: '/images/subNavBarData/binance.svg',
          title: 'Binance',
        },
        {
          icon: '/images/subNavBarData/coinbase.svg',
          title: 'Coinbase',
        },
        {
          icon: '/images/subNavBarData/bybit.svg',
          title: 'Bybit',
        },
        {
          icon: '/images/subNavBarData/okx.svg',
          title: 'OKX',
        },
        {
          icon: '/images/subNavBarData/krakan.svg',
          title: 'Krakan',
        },
        {
          icon: '/images/subNavBarData/hubai.svg',
          title: 'Hubai',
        },
        {
          icon: '/images/subNavBarData/gateio.svg',
          title: 'Gate.io',
        },
        {
          icon: '/images/subNavBarData/kucoin.svg',
          title: 'Kucoin',
        },
      ],
    },
    {
      title: 'Public Blockchains',
      isFree: true,
      enabled: true,
      dataOptions: [
        {
          icon: '/images/subNavBarData/binance.svg',
          title: 'Binance',
        },
        {
          icon: '/images/subNavBarData/coinbase.svg',
          title: 'Coinbase',
        },
        {
          icon: '/images/subNavBarData/bybit.svg',
          title: 'Bybit',
        },
        {
          icon: '/images/subNavBarData/okx.svg',
          title: 'OKX',
        },
        {
          icon: '/images/subNavBarData/krakan.svg',
          title: 'Krakan',
        },
        {
          icon: '/images/subNavBarData/hubai.svg',
          title: 'Hubai',
        },
        {
          icon: '/images/subNavBarData/gateio.svg',
          title: 'Gate.io',
        },
        {
          icon: '/images/subNavBarData/kucoin.svg',
          title: 'Kucoin',
        },
      ],
    },
    {
      title: 'Descentralized Finance (DeFi)',
      isFree: true,
      enabled: true,
      dataOptions: [
        {
          icon: '/images/subNavBarData/binance.svg',
          title: 'Binance',
        },
        {
          icon: '/images/subNavBarData/coinbase.svg',
          title: 'Coinbase',
        },
        {
          icon: '/images/subNavBarData/bybit.svg',
          title: 'Bybit',
        },
        {
          icon: '/images/subNavBarData/okx.svg',
          title: 'OKX',
        },
        {
          icon: '/images/subNavBarData/krakan.svg',
          title: 'Krakan',
        },
        {
          icon: '/images/subNavBarData/hubai.svg',
          title: 'Hubai',
        },
        {
          icon: '/images/subNavBarData/gateio.svg',
          title: 'Gate.io',
        },
        {
          icon: '/images/subNavBarData/kucoin.svg',
          title: 'Kucoin',
        },
      ],
    },
    {
      title: 'GameFi & Metaverses',
      isFree: true,
      enabled: true,
      dataOptions: [
        {
          icon: '/images/subNavBarData/binance.svg',
          title: 'Binance',
        },
        {
          icon: '/images/subNavBarData/coinbase.svg',
          title: 'Coinbase',
        },
        {
          icon: '/images/subNavBarData/bybit.svg',
          title: 'Bybit',
        },
        {
          icon: '/images/subNavBarData/okx.svg',
          title: 'OKX',
        },
        {
          icon: '/images/subNavBarData/krakan.svg',
          title: 'Krakan',
        },
        {
          icon: '/images/subNavBarData/hubai.svg',
          title: 'Hubai',
        },
        {
          icon: '/images/subNavBarData/gateio.svg',
          title: 'Gate.io',
        },
        {
          icon: '/images/subNavBarData/kucoin.svg',
          title: 'Kucoin',
        },
      ],
    },
    {
      title: 'Public Medical Research',
      enabled: false,
      isFree: false,
    },
    {
      title: 'Financial Data',
      enabled: false,
      isFree: false,
    },
    {
      title: 'Weather Report',
      enabled: false,
      isFree: false,
    },
    {
      title: 'Scientific Data',
      enabled: false,
      isFree: false,
    },
    {
      title: 'Cancer Research',
      enabled: false,
      isFree: false,
    },
    {
      title: 'Agricultural',
      enabled: false,
      isFree: false,
    },
  ]

  const dataUseCase = {
    'Financial Analysis':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/dV24UPM1pxtu3arLSfCk/getting-started/about-openmesh',
    Github: 'https://github.com/L3A-Protocol',
    'Blockchain Transactions':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/streaming-service/supported-feeds-and-symbols',
    'DEXs and CEXs':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/streaming-service/schema-reference',
    'Gas Optimization':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/query-service/overview',
    'Crypto Liquidity':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/infrastructure/data-flow',
  }

  function handleButtonClick(title: string) {
    if (title === selectionSubBar) {
      setSelectionSubBar('')
    } else {
      setSelectionSubBar(title)
    }
  }

  function renderSubOptions(option: any) {
    return (
      <div className="mt-[6.5px] mb-[25px] grid gap-y-[15px] pl-[19px] md:mt-[7.5px] md:mb-[30px] md:gap-y-[18px] md:pl-[22px] lg:mt-[8.5px] lg:mb-[35px] lg:gap-y-[21px] lg:pl-[27px] xl:mt-[10px] xl:mb-[40px] xl:gap-y-[24px] xl:pl-[30px]  2xl:mt-[12px]  2xl:mb-[50px]  2xl:gap-y-[30px] 2xl:pl-[38px]">
        {option.dataOptions.map((option, index) => (
          <div key={index} className="relative flex text-[#000]">
            <div className="flex gap-x-[9px]">
              <img
                src={option.icon}
                alt="image"
                className={`w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]`}
              />
              <div className="text-[7.5px] font-light md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                {option.title}
              </div>
            </div>
            <div
              onClick={() => {
                setNext(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="absolute right-0 -top-[2px] cursor-pointer rounded-[5px] bg-[#0354EC] px-[7px] py-[3px]  text-[6.5px] font-medium text-[#fff] hover:bg-[#123981]  md:text-[7px] lg:py-[2.8px] lg:px-[6px] lg:text-[8.5px] lg:!leading-[15px] xl:py-[3.2px] xl:px-[6.8px] xl:text-[9.5px]  2xl:py-[4px] 2xl:px-[8.5px] 2xl:text-[12px]"
            >
              <div>Add</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="z-100 relative bg-[#fff] px-[18px] py-[29px] pr-[33px] text-[#000] shadow-[0_0px_5px_0px_rgba(0,0,0,0.12)] md:px-[20px] md:py-[34.5px] md:pr-[40px] lg:px-[23px] lg:py-[40px] lg:pr-[47px] xl:px-[27px] xl:py-[45.5px] xl:pr-[54px] 2xl:py-[57px] 2xl:pl-[33px] 2xl:pr-[67px]">
        <div className="text-[9px] font-bold md:text-[11px] lg:text-[12.5px] xl:text-[14.5px] 2xl:text-[18px]">
          Categories
        </div>
        <img
          src="/images/lateralNavBar/close.svg"
          onClick={() => setSelectionSideNavBar('')}
          alt="image"
          className="absolute top-[15px] flex w-[8px] cursor-pointer items-center lg:right-[24px] lg:w-[9px] 2xl:right-[30px] 2xl:w-[11px]" // Adicionando uma transição de 2 segundos
        />
        <div className="">
          {categoriesOptions.map((option, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  if (option.enabled) {
                    handleButtonClick(option.title)
                  }
                }}
                className={`relative mt-[14px] flex w-fit ${
                  option.enabled
                    ? 'cursor-pointer hover:text-[#5b5b5b]'
                    : 'text-[#959595]'
                }  gap-x-[9px] text-[9px] font-normal  md:mt-[17px] md:text-[10px] lg:mt-[19.5px] lg:text-[11px] lg:!leading-[300%] xl:mt-[22.5px] xl:text-[13px] 2xl:mt-[28px] 2xl:text-[16px]`}
              >
                {selectionSubBar === option.title ? (
                  <img
                    src="/images/lateralNavBar/seta-baixo.svg"
                    alt="image"
                    className="flex w-[8px] items-center lg:w-[9px] 2xl:w-[11px]" // Adicionando uma transição de 2 segundos
                  />
                ) : (
                  <img
                    src="/images/lateralNavBar/seta-lado.svg"
                    alt="image"
                    className="flex w-[7px] items-center lg:w-[7px] 2xl:w-[9px]" // Adicionando uma transição de 2 segundos
                  />
                )}
                <div>{option.title}</div>
                {option.isFree && (
                  <div className="absolute -top-[14px] -right-[27px] text-[7.5px] font-normal text-[#12AD50] md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                    Free
                  </div>
                )}
              </div>

              {selectionSubBar === option.title && renderSubOptions(option)}
            </div>
          ))}
        </div>
        <div className="mt-[41px] pl-[5px] text-[8px] text-[#000] md:mt-[49px] md:w-fit md:text-[10px] lg:mt-[58px] lg:text-[11px] xl:mt-[66px] xl:text-[13px] 2xl:mt-[83px] 2xl:text-[16px]">
          <div className="font-bold ">Use Cases</div>
          <div className="mt-[7.5px] grid font-normal md:mt-[9px] lg:mt-[10.5px] lg:!leading-[300%] xl:mt-[12px] 2xl:mt-[15px]">
            {Object.entries(dataUseCase).map(([key, value], index, array) => (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
              >
                <div className={`w-fit cursor-pointer hover:text-[#0354EC]`}>
                  {key}
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-[21px] max-w-[110px] text-[9px] md:mt-[25px] md:max-w-[132px] md:text-[10px] lg:mt-[30px]  lg:max-w-[154px]  lg:text-[11px]  xl:mt-[34px] xl:max-w-[176px] xl:text-[13px] 2xl:mt-[43px] 2xl:max-w-[220px] 2xl:text-[16px]">
          <div className="border-b-[1px] border-t-[1px] border-[#D9D9D9] pb-[8px]  pt-[7.5px]  md:pt-[9px] lg:pb-[12px] lg:pt-[10.5px] xl:pt-[12px] 2xl:pb-[15px] 2xl:pt-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Support articles
            </div>
            <div className=" lg:!leading-[150%]">
              <a
                href={'https://www.openmesh.network/oec/register'}
                target="_blank"
                className="border-b-[1px] font-medium text-[#0354EC]"
                rel="noreferrer"
              >
                Join our community and let us know what you’d like to add!
              </a>
            </div>
          </div>
          <div className="mt-[8px] pb-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Provide a data source
            </div>
            <div className=" lg:!leading-[150%]">
              {' '}
              <a
                href={
                  'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases'
                }
                target="_blank"
                className="border-b-[1px] font-medium text-[#0354EC]"
                rel="noreferrer"
              >
                Run an Xnode today{' '}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubBarData

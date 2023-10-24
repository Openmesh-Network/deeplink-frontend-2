/* eslint-disable react/no-unescaped-entities */
const NewFooter = () => {
  const useCasesOptions = [
    'Financial Analysis',
    'Blockchain Transactions',
    'DEXs and CEXs',
    'Gas Optimization',
    'Crypto Liquidity',
  ]

  return (
    <>
      <section
        id="footer"
        className="border-t-[1px] border-[#CECECE] bg-white px-[15px] pt-[62px]  pb-[57px] text-[#000000] md:px-[17.4px] md:pt-[75px] md:pb-[68px]  lg:px-[20.3px] lg:pt-[87px] lg:pb-[80px] xl:px-[23px] xl:pt-[100px] xl:pb-[91px] 2xl:px-[29px] 2xl:pt-[124px] 2xl:pb-[114px]"
      >
        <div className="  md:flex md:gap-x-[168px] lg:gap-x-[196px] xl:gap-x-[224px] 2xl:gap-x-[280px]">
          <div className="lg:max-w-[615px]">
            <img
              src={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? process.env.NEXT_PUBLIC_BASE_PATH
                  : ''
              }/images/header/logo.svg`}
              alt="image"
              className={`w-[91px] md:w-[110px] lg:w-[128px] xl:w-[146px] 2xl:w-[183px]`}
            />
            <div className="mt-[15px] text-[12px] font-normal md:mt-[18px] md:text-[14.5px] lg:mt-[21px] lg:text-[17px] lg:!leading-[29px] xl:mt-[24px] xl:text-[19px] 2xl:mt-[30px] 2xl:text-[24px]">
              Building open-source decentralized data infrastructure in Web2 and
              Web3 data
            </div>
            <div className="mt-[32px] text-[8px] font-normal   md:mt-[38.5px]  md:text-[9px] lg:mt-[45px] lg:text-[11px]  lg:!leading-[19px] xl:mt-[51px] xl:text-[13px] 2xl:mt-[64px] 2xl:text-[16px]">
              Openmesh, 2023
            </div>
          </div>
          <div className="gap-x-[20px] text-[9px] font-normal text-[#959595] md:flex md:gap-x-[24px] md:text-[10px] lg:gap-x-[28px] lg:text-[11px] lg:!leading-[150%] xl:gap-x-[32px] xl:text-[13px] 2xl:gap-x-[40px] 2xl:text-[16px]">
            <div className="mt-[26px] border-t-[1px] border-[#D9D9D9] pb-[8px] pt-[4px] md:mt-[0px] lg:pt-[12px] lg:pb-[12px] 2xl:pt-[15px] 2xl:pb-[15px] ">
              <div className="min-w-[100px] md:pr-[4px] lg:pr-[28px] xl:pr-[32px] 2xl:pr-[40px]">
                <div className="pb-[8px]  font-bold text-[#000] lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
                  Use Cases
                </div>
                <div className="grid grid-cols-2 justify-between gap-y-[5px] md:block md:!leading-[160%] lg:!leading-[220%]">
                  {useCasesOptions.map((useCase, index) => (
                    <a
                      href="https://github.com/L3A-Protocol"
                      target="_blank"
                      key={index}
                      rel="noreferrer"
                    >
                      <div
                        className={`cursor-pointer text-[#000] hover:text-[#757575]`}
                      >
                        {useCase}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-[16px] text-[8px] md:mt-[0px]  md:max-w-[220px] md:text-[10px] lg:text-[12px]  xl:text-[13px] 2xl:text-[16px]">
              <div className="border-b-[1px] border-t-[1px] border-[#D9D9D9] pb-[8px]  pt-[4px] text-[#000] lg:pt-[12px] lg:pb-[12px]  2xl:pt-[15px] 2xl:pb-[15px] ">
                <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
                  Suggest a new feature
                </div>
                <div className=" lg:!leading-[150%]">
                  <a
                    href="https://www.openmesh.network/oen"
                    target="_blank"
                    rel="noreferrer"
                    className="border-b-[1px] font-medium text-[#0354EC]"
                  >
                    Join our community and let us know what you’d like to add!
                  </a>
                </div>
              </div>
              <div className="mt-[8px] pb-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
                <div className="pb-[8px] font-bold  text-[#000] lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
                  Have more questions?
                </div>
                <div className=" lg:!leading-[150%]">
                  {' '}
                  <a
                    href="https://www.openmesh.network/oen"
                    target="_blank"
                    rel="noreferrer"
                    className="border-b-[1px] font-medium text-[#0354EC]"
                  >
                    Schedule a call with an Openmesh Expert
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full border-b-[1px] text-[#D4D4D4]"></div>
    </>
  )
}

export default NewFooter

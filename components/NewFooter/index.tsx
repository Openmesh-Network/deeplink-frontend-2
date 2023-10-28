/* eslint-disable react/no-unescaped-entities */
const NewFooter = () => {
  const useCasesOptions = [
    {
      name: 'OpenR&D 101',
      link: 'https://open-mesh.gitbook.io/l3a-dao-documentation/about/openr-and-d-101',
    },
    {
      name: 'Apply to Projects',
      link: 'https://open-mesh.gitbook.io/l3a-dao-documentation/getting-started/apply-to-projects',
    },
    {
      name: 'Create a Project',
      link: 'https://open-mesh.gitbook.io/l3a-dao-documentation/getting-started/create-a-project',
    },
    {
      name: 'Apply as a Verified Contributor',
      link: 'https://open-mesh.gitbook.io/l3a-dao-documentation/verified-contributor-guide/apply-as-verified-contributor',
    },
    {
      name: 'OpenR&D v1 Architecture',
      link: 'https://open-mesh.gitbook.io/l3a-dao-documentation/technical/openr-and-d-v1-architecture',
    },
    {
      name: 'Governance',
      link: 'https://open-mesh.gitbook.io/l3a-dao-documentation/governance/overview',
    },
    {
      name: 'FAQs',
      link: 'https://open-mesh.gitbook.io/l3a-dao-documentation/faqs',
    },
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
              }/images/header/header.png`}
              alt="image"
              className={`w-[200px]`}
            />
            <div className="mt-[15px] text-[12px] font-normal md:mt-[18px] md:text-[14.5px] lg:mt-[21px] lg:text-[17px] lg:!leading-[29px] xl:mt-[24px] xl:text-[19px] 2xl:mt-[30px] 2xl:text-[24px]">
              Open-source platform designed to empower decentralized teams to
              collaborate seamlessly.
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
                      href={useCase.link}
                      target="_blank"
                      key={index}
                      rel="noreferrer"
                    >
                      <div
                        className={`cursor-pointer text-[#000] hover:text-[#757575]`}
                      >
                        {useCase.name}
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
                  <a className="border-b-[1px] font-medium text-[#0354EC]">
                    Join our community and let us know what you’d like to add!
                  </a>
                </div>
                <div className="mt-[10px] flex gap-x-[20px]">
                  <a
                    href={'https://discord.com/invite/YpaebaVpdx'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="/images/task/discord-logo.svg"
                      alt="image"
                      className={`w-[20px]`}
                    />
                  </a>
                  <a
                    href={
                      'https://join.slack.com/t/openmesh-network/shared_invite/zt-264jtwykh-q0LgEz6EQPKRud1mN8Z_sg'
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="/images/task/slack-logo.svg"
                      alt="image"
                      className={`w-[20px]`}
                    />
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
                    href="https://calendly.com/openmesh/ashton-call"
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

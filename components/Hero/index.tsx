/* eslint-disable react/no-unescaped-entities */
// import Image from 'next/image'

const Hero = () => {
  return (
    <section className="py-16 px-32 md:py-20 lg:pt-40">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4 lg:w-2/3">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1">
                <h3 className="xl:text-6xlxl mb-4 text-xl font-bold text-black sm:text-3xl lg:text-5xl">
                  Research & Development
                </h3>
                <p className="text-xs font-light !leading-tight text-black sm:text-base">
                  All-in-one platform for coordinating, displaying, and managing
                  tasks, jobs, and projects.
                </p>
                <p className="mt-4 text-xs font-light !leading-tight text-black sm:text-base">
                  We welcome all community developers to support our project.
                  You can view the desired department for project outlines,
                  budgets, deadlines, and project details. All projects are
                  recorded on a smart contract, and payments are held in escrow,
                  ensuring that developers never have to worry about not
                  receiving payment. It's similar to working for clients on
                  platforms like Upwork or Freelancer, where Upwork provides
                  support. In our case, the smart contract takes care of that.
                </p>
                <p className="mt-4 text-xs font-light !leading-tight text-black sm:text-base">
                  Tags: Smart contract, Ethereum adapters, front end, backend
                  design, documentation, running event
                </p>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/3">
            <div
              className="wow fadeInUp border-gray-300 relative mx-auto max-w-[500px] rounded-md bg-[#FAF7F7] p-4 text-center text-base font-normal text-black shadow-xl lg:m-0"
              data-wow-delay=".15s"
            >
              <div className="mb-12 flex">
                <p>Available Funding</p>{' '}
                <div className="ml-4 flex items-start justify-start px-2">
                  <img
                    src="/images/tokens/usd-coin-usdc-logo.svg"
                    alt="image"
                    className={`w-[22px]`}
                  />
                  <span className="ml-1 text-base text-[#000000]">1200</span>
                </div>
              </div>
              <div>
                <div className="flex border-b-[1px] border-[#e5e5e5]">
                  <p>No. of open projects:</p>{' '}
                  <p className="ml-4 mt-[2px] text-sm">14</p>
                </div>

                <div className="flex border-b-[1px] border-[#e5e5e5]">
                  <p>No. of completed projects:</p>{' '}
                  <p className="ml-4 mt-[2px] text-sm">19</p>
                </div>

                <div className="flex">
                  <p>Current members:</p>{' '}
                  <p className="ml-4 mt-[2px] text-sm">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

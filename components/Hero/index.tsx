/* eslint-disable react/no-unescaped-entities */
// import Image from 'next/image'

const Hero = () => {
  return (
    <section className="py-16 px-32 md:py-20 lg:py-40">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4 lg:w-2/3">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-2xl xl:text-4xl">
                  Research & Development
                </h3>
                <p className="text-xs font-light leading-relaxed text-black sm:text-sm sm:leading-relaxed">
                  All-in-one platform for coordinating, displaying, and managing
                  tasks, jobs, and projects.
                </p>
                <p className="mt-4 text-xs font-light leading-relaxed text-black sm:text-sm sm:leading-relaxed">
                  We welcome all community developers to support our project.
                  You can view the desired department for project outlines,
                  budgets, deadlines, and project details. All projects are
                  recorded on a smart contract, and payments are held in escrow,
                  ensuring that developers never have to worry about not
                  receiving payment. It's similar to working for clients on
                  platforms like Upwork or Freelancer, where Upwork provides
                  support. In our case, the smart contract takes care of that.
                </p>
                <p className="mt-4 text-xs font-light leading-relaxed text-black sm:text-sm sm:leading-relaxed">
                  Tags: Smart contract, Ethereum adapters, front end, backend
                  design, documentation, running event
                </p>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/3">
            <div
              className="wow fadeInUp border-gray-300 relative mx-auto max-w-[500px] rounded-md bg-[#FAF7F7] p-4 text-center text-base text-black shadow-xl lg:m-0"
              data-wow-delay=".15s"
            >
              <div className="mb-12 flex">
                <p>Available Funding</p> <p className="ml-4">1200</p>
              </div>
              <div>
                <div className="flex border-b-[1px] border-[#bcbaba]">
                  <p>No. of open projects:</p>{' '}
                  <p className="ml-4 mt-[2px] text-sm">14</p>
                </div>

                <div className="flex border-b-[1px] border-[#bcbaba]">
                  <p>No. of completed projects:</p>{' '}
                  <p className="ml-4 mt-[2px] text-sm">14</p>
                </div>

                <div className="flex">
                  <p>Current members:</p>{' '}
                  <p className="ml-4 mt-[2px] text-sm">14</p>
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

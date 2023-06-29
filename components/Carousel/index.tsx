'use client'
import { Carousel } from '@mantine/carousel'

function EmblaCarousel() {
  return (
    <Carousel
      maw={600}
      mx="auto"
      controlsOffset="5xs"
      withIndicators
      height={200}
      styles={{
        control: {
          '&[data-inactive]': {
            opacity: 0,
            cursor: 'default',
          },
          color: 'white',
        },
      }}
      className="mb-10"
    >
      <Carousel.Slide>
        <div className="flex">
          <img
            className="ml-10 w-1/2"
            src="/images/carousel/blockchainLogo.svg"
            alt="Bitcoin Logo"
          />
          <p className="ml-10 w-1/2">Dummy text for slide 2</p>
        </div>
      </Carousel.Slide>
      <Carousel.Slide>
        <div className="flex">
          <img
            className="ml-10 w-1/2"
            src="/images/carousel/blockchainLogo.svg"
            alt="Bitcoin Logo"
          />
          <p className="ml-10 w-1/2">Dummy text for slide 2</p>
        </div>
      </Carousel.Slide>
      <Carousel.Slide>
        <div className="flex">
          <img
            className="ml-10 w-1/2"
            src="/images/carousel/blockchainLogo.svg"
            alt="Bitcoin Logo"
          />
          <p className="ml-10 w-1/2">Dummy text for slide 2</p>
        </div>
      </Carousel.Slide>
      {/* ...other slides */}
    </Carousel>
  )
}

export default EmblaCarousel

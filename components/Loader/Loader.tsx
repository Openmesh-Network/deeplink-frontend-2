import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
// custom
export function Loader() {
  return (
    <>
      <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center text-center text-lg font-semibold lg:text-2xl">
        <span>
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 150,
                  marginBottom: '200%',
                  color: '#0354EC',
                }}
                spin
              />
            }
          />
        </span>
      </div>
    </>
  )
}

'use client'
import { Payment } from '@/types/task'
import DOMPurify from 'dompurify'
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser'

interface TasksModalProps {
  task: {
    internalId: string
    id: number
    title: string
    description: string
    deadline: string
    daysLeft: string
    isDraft: boolean
    payments: Payment[]
    status: string
    estimatedBudget: string
    skills: string[]
  }
  index: number
  isLoading: boolean
}

const TasksModal = ({ task, index, isLoading }: TasksModalProps) => {
  function transform(node, index) {
    // if (node.type === 'tag') {
    //   switch (node.name) {
    //     case 'h1':
    //       node.attribs.style = 'font-size: 2rem; font-weight: bold;'
    //       break
    //     case 'h2':
    //       node.attribs.style = 'font-size: 1.5rem; font-weight: bold;'
    //       break
    //     case 'ul':
    //       node.attribs.style = 'list-style: disc; margin-left: 40px;' // Ajuste o valor conforme necessário
    //       break
    //     case 'ol':
    //       node.attribs.style = 'list-style: decimal; margin-left: 40px;' // Ajuste o valor conforme necessário
    //       break
    //     case 'strong':
    //     case 'b':
    //       node.attribs.style = 'font-weight: bold;'
    //       break
    //     case 'em':
    //     case 'i':
    //       node.attribs.style = 'font-style: italic;'
    //       break
    //     case 'li':
    //       if (
    //         node.attribs.class &&
    //         node.attribs.class.includes('ql-indent-1')
    //       ) {
    //         node.attribs.style = 'margin-left: 30px;' // Adicione mais estilos se a classe ql-indent-1 tiver especificidades
    //       }
    //       break
    //     // Adicione mais casos conforme necessário
    //   }
    // }
    return convertNodeToElement(node, index, transform)
  }
  if (task.title) {
    return (
      <div
        className={`relative mr-1 ${
          index === 0 ? 'mt-[34px]' : 'mt-[25px]'
        } flex items-start justify-between overflow-x-auto border-b border-[#D4D4D4] pb-6 text-[12px] font-normal lg:text-[16px]`}
      >
        <div className="mr-4 w-[400px] items-center lg:w-[35%]">
          <a
            href={
              !task.isDraft
                ? `/task/${task.id}`
                : `/task-draft/${task.internalId}`
            }
            title={task.title}
            className="overflow-hidden pb-2 font-bold text-[#0354EC]"
          >
            {task.title}
          </a>
          <p
            title={task.description}
            className="w-[120px] overflow-hidden text-[10px] !leading-tight line-clamp-4 lg:w-full lg:text-[14px]"
          >
            {(() => {
              // const cleanHtml = DOMPurify.sanitize(
              //   '<h1>New project information</h1><p><br></p><h2>Specs</h2><ul><li><strong>Lorem ipsum religaris:</strong></li><li class="ql-indent-1">sddsaddsadsadsasasasasasasasasasasadsadasdsadsadasdasdasdsadwqopidmwqmodw</li><li class="ql-indent-1">qwmpodwopqdmopwqmdopwqmodpmwqopdmpowqmdop</li><li class="ql-indent-1">wqopmdmqwopdmopqwmdopqwpdqwmkopwqmdpowqmdopqwmdopmqwmdop</li><li><strong>Lorem ipsum religaris:</strong></li><li class="ql-indent-1">sddsaddsadsadsasasasasasasasasasasadsadasdsadsadasdasdasdsadwqopidmwqmodw</li><li class="ql-indent-1">qwmpodwopqdmopwqmdopwqmodpmwqopdmpowqmdop</li><li class="ql-indent-1">wqopmdmqwopdmopqwmdopqwpdqwmkopwqmdpowqmdopqwmdopmqwmdop</li></ul><p><br></p><h2>Scope</h2><ul><li><strong>Lorem ipsum religaris:</strong></li><li><strong>Lorem ipsum religaris:</strong></li><li><strong>Lorem ipsum religaris: dsad</strong></li><li><strong>Lorem ipsum religaris:</strong></li><li><strong>Lorem ipsum religaris:</strong></li><li><strong>Lorem ipsum religaris:</strong></li><li><strong>Lorem ipsum religaris:</strong></li></ul>',
              // )
              const config = {
                FORBID_TAGS: ['img'],
              }
              const cleanHtml = DOMPurify.sanitize(task.description, config)

              const htmlTransformado = ReactHtmlParser(cleanHtml, {
                transform,
              })

              return <div>{htmlTransformado}</div>
            })()}
          </p>
        </div>
        <div className="mr-[25px] flex w-[200px] items-center lg:mr-0 lg:w-[15%]">
          <p
            className="max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap"
            title={task.skills && task.skills.join(' | ')}
          >
            {task.skills && task.skills.join(', ')}
          </p>
        </div>
        <div className=" mr-[25px] flex w-[300px] items-center lg:mr-0 lg:w-[10%]">
          {task.estimatedBudget && (
            <div className="flex">
              <p key={index}>$</p>
              <p
                title={Number(task.estimatedBudget).toLocaleString('en-US')}
                className="mr-1 w-[50px] overflow-hidden text-ellipsis whitespace-nowrap lg:w-full lg:max-w-[100px]"
                key={index}
              >
                {Number(task.estimatedBudget).toLocaleString('en-US')}
              </p>
              <p>{`(`}</p>
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/tokens/usd-coin-usdc-logo.svg`}
                alt="image"
                className={`w-[12px] lg:w-[14px]`}
              />
              <p>{`)`}</p>
            </div>
          )}
        </div>
        <div className="mr-[10px]  flex items-center lg:mr-0 lg:w-[8%]">
          <p className="w-[100px] lg:w-full">{task.daysLeft}</p>
        </div>
        <div className="flex w-[200px] lg:w-[12%]">
          <a
            href={
              !task.isDraft
                ? `/task/${task.id}`
                : `/task-draft/${task.internalId}`
            }
            className="ml-auto cursor-pointer rounded-[5px] border border-[#0354EC] bg-white py-[8px] px-[15px] text-[12px] font-normal text-[#0354EC] hover:bg-[#0354EC] hover:text-white lg:py-[10px] lg:px-[22px] lg:text-[16px]"
          >
            View more
          </a>
        </div>
      </div>
    )
  }
}

export default TasksModal

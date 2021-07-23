import { useHistory, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Question } from '../components/Question/Question'
import { RoomCode } from '../components/RoomCode'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import '../styles/room.scss'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

type RoomParams = {
    id: string
}

export function AdminRoom(){
    const params = useParams<RoomParams>()
    const history = useHistory()
    
    const roomId = params.id
    const { title, questions } = useRoom(roomId)

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Você tem certeza que deseja excluir essa pergunta?")){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswer: true
        })
    }

    async function handleHighLightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button onClick={() => handleEndRoom()} isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 &&
                        <span>{questions.length} pergunta(s)</span>
                    }
                </div>

                <div className="question-list">
                {questions.map(question => {
                    return (
                        <Question 
                            key={question.id} 
                            content={question.content} 
                            author={question.author}
                            isAnswer={question.isAnswer}    
                            isHighlighted={question.isHighlighted}
                        >
                           
                            {!question.isAnswer && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleHighLightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="Dar destaque a pergunta" />
                                    </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Deletar pergunta" />
                            </button>
                        </Question>
                    )
                })}
                </div>
            </main>
        </div>
    )
}
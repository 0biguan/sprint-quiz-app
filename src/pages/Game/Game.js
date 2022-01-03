import { useState, useEffect } from 'react'

import './Game.css'

import { useGame } from '../../contexts/gameContext'
import { useQuestion } from '../../contexts/questionContext'

import PlayersContainer from '../../components/PlayersContainer/PlayersContainer'
import Question from '../Question/Question'

import generatePlayersRecords from '../../logic/generatePlayersRecords'
import getApiQuestion from '../../logic/getApiQuestion'
import retrieveSessionToken from '../../logic/retrieveSessionToken'
import resetSessionToken from '../../logic/resetSessionToken'
import updateScore from '../../logic/updateScore'
import TransitionBackground from '../../components/TransitionBackground/TransitionBackground'

export default function Game ({ openOptions, openInfo }) {
  const { level, numberOfPlayers, playersName, playersCards, sessionToken, turn } = useGame()
  const { answerStates, questionInfo, setQuestionInfo, setAnswerStates, fails } = useQuestion()

  const [screen, setScreen] = useState(false)
  const [scoreUpdated, setScoreUpdated] = useState()
  const [transition, setTransition] = useState(true)

  useEffect(() => {
    generatePlayersRecords(playersName, numberOfPlayers, playersCards)
    setTransition(false)
  }, [playersName, numberOfPlayers, playersCards])

  useEffect(() => {
    const getApiToken = async () => {
      sessionToken.current = await retrieveSessionToken()
    }
    getApiToken()

    return () => {
      const resetApiToken = async () => {
        sessionToken.current = await resetSessionToken(sessionToken.current)
      }
      resetApiToken()
    }
  }, [sessionToken])

  useEffect(() => {
    if (answerStates.isClosed) {
      updateScore(questionInfo.category, answerStates.isCorrect, playersCards, turn, fails, setScoreUpdated, numberOfPlayers)
    }
  }, [questionInfo.category, answerStates.isCorrect, answerStates.isClosed, playersCards, turn, numberOfPlayers, fails])

  const handleScreen = () => {
    setScreen(screen => !screen)
  }

  const handleGetNewRandomQuestion = () => {
    getApiQuestion(setQuestionInfo, handleScreen, sessionToken.current, level, playersCards.current[turn - 1].finalQuestion)
    setAnswerStates({
      isAnswered: false,
      isCorrect: undefined,
      isClosed: false
    })
    setScoreUpdated(false)
  }

  return (
    <div className='game'>
      <div className="game__options" onClick={openOptions} />
      <div className="select__info game__info" onClick={openInfo} />
      <div className={scoreUpdated ? 'game__wheel' : 'game__wheel game__wheel--blocked'} onClick={() => handleGetNewRandomQuestion()} />
      <PlayersContainer />
      <Question move={handleScreen} screen={screen} />
      <div className={transition ? 'game__transition move-right' : 'game__transition'}>
        <TransitionBackground />
      </div>
    </div>
  )
}

const generatePlayersRecords = (playersName, numberOfPlayers, playersCards) => {
  let cards = []
  const names = Object.values(playersName).slice(0, numberOfPlayers)
  for (let name of names) {
    const card = {
      name,
      records: {
        entertainment: false,
        history: false,
        geography: false,
        science: false,
        sports: false,
        art: false
      },
      finalQuestion: true
    }
    cards.push(card)
  }
  playersCards.current = cards
}

export default generatePlayersRecords
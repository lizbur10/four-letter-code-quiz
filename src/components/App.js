import { useState, useEffect } from "react";
import WelcomeScreen from "./WelcomeScreen";
import QuizQuestion from "./QuizQuestion";
// import ResponseTable from "./ResponseTable";
import ResultsTally from "./ResultsTally";
import RightWrong from "./RightWrong";
// import Contact from "./Contact";

function App() {
  const [game, setGame] = useState({
    display: "welcome",
    settings: {
      scope: "appledore",
      mode: "nameToCode",
      numQuestions: 5,
    },
    correct: null,
    answer: null,
    bird: {},
    userResponse: "",
    questionList: [],
    gameOver: {},
  });

  useEffect(() => {
    if (game.questionList.length === game.settings.numQuestions) endGame();
  });

  const launchQuestion = () => {
    let url;
    game.settings.scope === "appledore"
      ? (url = "http://localhost:3000/birds/appledore/random")
      : (url = "http://localhost:3000/birds/random");
    fetch(url)
      .then((resp) => resp.json())
      .then((bird) => {
        if (game.questionList.find((question) => question.id === bird.id)) {
          launchQuestion();
        } else {
          setGame(() => ({ ...game, display: "question", bird: bird }));
        }
      });
  };

  const onChangeHandler = (event) => {
    setGame({ ...game, userResponse: event.target.value });
  };

  const giveAnswer = (bird) => {
    const answer =
      game.settings.mode === "nameToCode"
        ? bird.four_letter_code
        : bird.common_name;
    bird.correct = false;
    setGame({
      ...game,
      display: "rightWrong",
      answer: answer,
      questionList: [...game.questionList, bird],
    });
  };

  // const checkContinue = () => {
  //   game.questionList.length < game.settings.numQuestions
  //     ? launchQuestion()
  //     : endGame();
  // };

  const onAnswerSubmit = (bird, event) => {
    event.preventDefault();
    if (checkCorrect(bird)) {
      bird.correct = true;
      setGame({
        ...game,
        correct: true,
        display: "rightWrong",
        bird: {},
        userResponse: "",
        questionList: [...game.questionList, bird],
      });
    } else {
      setGame({
        ...game,
        correct: false,
        display: "rightWrong",
        userResponse: "",
      });
    }
  };

  const checkCorrect = (bird) => {
    const { userResponse } = game;
    const correctAnswer =
      game.settings.mode === "nameToCode"
        ? bird.four_letter_code
        : bird.common_name;
    return (
      userResponse.toLowerCase() === correctAnswer.toLowerCase() ||
      userResponse.toLowerCase().replace("'", "") ===
        correctAnswer.toLowerCase().replace("'", "") ||
      userResponse.toLowerCase().replace("-", " ") ===
        correctAnswer.toLowerCase().replace("-", " ") ||
      userResponse.toLowerCase().replace("'", "").replace("-", " ") ===
        correctAnswer.toLowerCase().replace("'", "").replace("-", " ")
    );
  };

  const endGame = () => {
    const total = game.questionList.reduce((memo, currentVal) => {
      return currentVal.correct ? memo + 1 : memo;
    }, 0);
    let congrat;
    if (total > 8) {
      congrat = "You rule!";
    } else if (total > 6) {
      congrat = "Nice going!";
    } else if (total > 4) {
      congrat = "You're making progress!";
    } else {
      congrat = "Keep practicing:";
    }
    setGame({
      ...game,
      bird: "",
      display: "over",
      gameOver: { total: total, congrat: congrat, open: true },
    });
  };

  // const renderResponseTable = () => {
  //   return (
  //     <ResponseTable
  //       questionList={game.questionList}
  //       mode={game.settings.mode}
  //     />
  //   );
  // };

  const onOptionChange = (event) =>
    setGame({
      ...game,
      settings: { ...game.settings, [event.target.name]: event.target.id },
    });

  // const handleContactClick = (event) => {
  //   event.preventDefault();
  //   setGame({ ...game, display: "contact" });
  // };

  const renderWelcomeScreen = () => {
    return (
      <WelcomeScreen
        scope={game.settings.scope}
        mode={game.settings.mode}
        launchQuestion={launchQuestion}
        onChange={onOptionChange}
        open={true}
        // handleContactClick={handleContactClick}
      />
    );
  };

  const renderQuestion = () => {
    return (
      <QuizQuestion
        bird={game.bird}
        mode={game.settings.mode}
        userResponse={game.userResponse}
        onAnswerSubmit={onAnswerSubmit}
        onChangeHandler={onChangeHandler}
        giveAnswer={giveAnswer}
        open={true}
      />
    );
  };

  const onResultsModalClose = () => {
    setGame({ ...game, display: "welcome", gameOver: {}, questionList: [] });
  };

  const renderQuizResults = () => {
    return (
      <ResultsTally
        gameOver={game.gameOver}
        numQuestions={game.settings.numQuestions}
        onModalClose={onResultsModalClose}
        questionList={game.questionList}
        mode={game.settings.mode}
      />
    );
  };

  const onRightWrongModalClose = () => {
    // debugger;
    if (game.correct) {
      setGame({ ...game, correct: null, display: "question" });
    } else if (game.answer) {
      setGame({ ...game, correct: null, answer: null });
    } else {
      setGame({ ...game, correct: null, display: "question" });
    }
  };

  const renderRightWrong = () => {
    return (
      <RightWrong
        open={true}
        correct={game.correct}
        answer={game.answer}
        onEnterPress={onRightWrongModalClose}
      />
    );
  };

  // const renderContactForm = () => {
  //   return <Contact open={true} />;
  // };
  return (
    <div className="ui container">
      {game.display === "welcome" ? renderWelcomeScreen() : null}
      {game.display === "question" ? renderQuestion() : null}
      {game.display === "rightWrong" ? renderRightWrong() : null}
      {game.display === "over" ? renderQuizResults() : null}
      {/* {game.display === "contact" ? renderContactForm() : null} */}
    </div>
  );
}

export default App;

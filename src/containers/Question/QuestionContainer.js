import React, {Component, PropTypes} from "react";
import Question from "../../components/Question/Question";
import AnswerOption from "../../components/Answer/AnswerOption";
import QuestionCounter from "../../components/Question/QuestionCounter";
import Score from "../../components/Common/Score";
import TimeProgress from "../../components/Common/TimeProgress";
import AnswerStatus from "../../components/Answer/AnswerStatus";
import "./QuestionContainer.css";

export default class QuestionContainer extends Component {
  constructor(props) {
    super(props);

    /**
     * State of Question Container:
     *
     * - Timer {Object}:
     *  - points Should be calculated (maxPoints * percentOf(timeLeft / maxTimePerQuestion) / 100) to Normalize it value
     *  - value is current percentOf(timeLeft / maxTimePerQuestion)
     *  - time is How much time left (maxTimePerQuestion - "buffer") per iteration
     *  - timeout is How much time gone till Answer action
     *  - buffer is value of Interval time
     * */
    this.state = {
      answer: {
        id: null,
        time: null,
        points: null,
        question: null,
      },
      timer: {
        points: 0,
        value: 0,
        time: 0,
        timeout: 0,
        buffer: 100,
      },
      stopTimeCounter: false,
    };

    this.onAnswerClick = this.onAnswerClick.bind(this);
    this.runCounter = this.runCounter.bind(this);
    this.stopCounting = this.stopCounting.bind(this);
    this.onTimeProgressEnd = this.onTimeProgressEnd.bind(this);
  }

  onAnswerClick(data) {
    const {id} = data;
    const answer = Object.assign({}, this.state.answer, {
      id,
      points: this.state.timer.points,
      time: this.state.timer.timeout,
      question: this.props.questions.current
    });

    this.stopCounting();
    this.setState({answer});

    this.props.checkAnswerStatus({answer});
  }

  componentDidMount() {
    if (!this.props.answers.current) {
      this.runCounter();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.questions.current.id !== nextProps.questions.current.id) {
      this.runCounter(nextProps.questions);
    }
  }

  componentWillUnmount() {
    this.stopCounting();
  }

  runCounter (questions) {
    const data = questions || this.props.questions;

    this.setState({
      timer: Object.assign({}, this.state.timer, {
        value: 100,
        time: data.current.time
      })
    });

    this.counting = setInterval(() => {
      const percent = Math.round((this.state.timer.time / data.current.time) * 100);

      this.setState({
        timer: Object.assign({}, this.state.timer, {
          points: Math.round((this.props.questions.current.score) * percent / 100),
          time: this.state.timer.time - this.state.timer.buffer,
          timeout: this.state.timer.timeout + this.state.timer.buffer,
          value: percent
        })
      });

      if (this.state.timer.time <= 0) {
        return this.onTimeProgressEnd();
      }
    }, this.state.timer.buffer);
  }

  stopCounting() {
    clearInterval(this.counting);

    this.counting = null;
  }

  onTimeProgressEnd() {
    this.stopCounting();

    const answer = Object.assign({}, this.state.answer, {
      id: null,
      time: 0,
      points: 0,
      question: this.props.questions.current
    });

    this.setState({
      timer: Object.assign({}, this.state.timer, {
        time: 0,
        value: 0,
      })
    });

    this.props.checkAnswerStatus({answer});
  }

  render() {
    return (
      <div className="question-container">
          <div className="row">
            <div className="small-12 medium-3 medium-offset-3 columns text-center">
              <span className="question-head-value">
                <QuestionCounter
                  total={this.props.questions.list.length}
                  current={this.props.questions.current.id + 1} />
              </span>
              <p>Correct question</p>
            </div>

            <div className="small-12 medium-3 columns text-center">
              <span className="question-head-value">
                + <Score points={this.props.questions.current.score}/>
              </span>
              <p>Score to get</p>
            </div>

            <div className="small-12 medium-6 medium-offset-3 columns text-center">
              <div className="spacer s2" />

              <TimeProgress
                value={this.state.timer.value}
                time={this.state.timer.time} />

              <div className="spacer s2" />
            </div>

            <div className="small-11 medium-10 large-6 large-offset-3 column">
              <div className="text-center">
                <Question question={this.props.questions.current} />
              </div>

              {this.props.questions.current.answers.map(answer => {
                return <AnswerOption
                  onClickHandle={this.onAnswerClick}
                  key={answer.id}
                  id={answer.id.toString()}
                  type={"answer-" + this.props.questions.current.type + '-' + answer.id}
                  content={answer.title} />
              })}
            </div>

            <div className="small-12 column">
              {this.props.answers &&
                <AnswerStatus
                  answer={this.props.answers}
                  closeAction={this.props.nextQuestion}/>
              }
            </div>
          </div>
      </div>
    );
  }
}

QuestionContainer.propTypes = {
  questions: PropTypes.object.isRequired,
  checkAnswerStatus: PropTypes.func.isRequired,
  answers: PropTypes.object.isRequired,
  nextQuestion: PropTypes.func.isRequired,
};

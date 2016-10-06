import React from 'react';
import _ from 'lodash';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Questions } from '../api/questions.js';

const GOOGLE_FORM_LINK = 'https://goo.gl/forms/lf9dBVNkjt0ixVmn2';
const TWITTER_PAGE_LINK = 'https://twitter.com/vwyf1x1';

class ResultItem extends React.Component {
  componentDidMount() {
    this.renderPieChartWithLegend(this.props);
  }
  componentDidUpdate() {
    this.renderPieChartWithLegend(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.renderPieChartWithLegend(nextProps);
  }
  renderPieChartWithLegend(props) {
    this.chart && this.chart.destroy();
    // global options variable
    var options = {
      responsive: true,
      scaleBeginAtZero: true,
      // you don't have to define this here, it exists inside the global defaults
      legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    }

    var ctxPTD = $(this.pieChart).get(0).getContext("2d");
    var dataPTD = [
      {
        label: props.question.optionA,
        color: "rgba(74, 74, 74, 1)",
        highlight: "rgba(74, 74, 74, .9)",
        value: props.question.count.A,
      },
      {
        label: props.question.optionB,
        color: "rgba(252, 238, 31, 1)",
        highlight: "rgba(252, 238, 31, .9)",
        value: props.question.count.B,
      },
    ]

    this.chart = new Chart(ctxPTD).Pie(dataPTD, options);
    // pie chart legend
    $(this.legend).html(this.chart.generateLegend());
  }

  render() {
    return (
      <div className='col-md-4'>
        <div className='result-wrapper'>
          <h1>{this.props.question.text}</h1>
          <div className='chart'>
            <canvas className='pie' ref={ref => this.pieChart = ref} />
            <div ref={ref => this.legend = ref} />
          </div>
        </div>
      </div>);
  }
}

ResultItem.propTypes = {
  question: React.PropTypes.object,
}

const ResultsRow = ({questions}) => (
  <div className='results-row'>
    <div className='container'>
      <div className='row'>
        {questions.map(question => <ResultItem key={question.id} question={question} />)}
      </div>
    </div>
  </div>);

class Results extends TrackerReact(React.Component) {
  renderResults() {
    let questions = Questions.find().fetch()
      .filter(q => q.count.A !== 0 || q.count.B !== 0)
      .sort((q1, q2) => q2.lastUpdatedAt - q1.lastUpdatedAt);
    return _.chunk(questions, 3).map(
      (threeQuestions, i) => <ResultsRow key={i} questions={threeQuestions} />);
  }

  render() {
    return (
      <div className="main container-fluid">
        <header>
          <a className='title' href={TWITTER_PAGE_LINK} target='_blank'>#VoteWithYourFeet</a>
          <a className='submit' href={GOOGLE_FORM_LINK} target='_blank'>SUBMIT QUESTIONS</a>
        </header>
        <div className='all-results-wrapper'>
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

export default Results;

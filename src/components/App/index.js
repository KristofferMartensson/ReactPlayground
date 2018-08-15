import React, { Component } from 'react';
import './style.css';


import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const tableAPI = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/leagues-classic-standings/461623';

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch(tableAPI)
      .then(response => {
        return response.json();
      })
      .then(data => this.setState({ results: data.standings.results, isLoading: false }));
  }

  render() {
    const { results, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading ...</p>;
    }
    return (
    <div>
      <ul>
      { results.map(result =>
          <li key={result.objectID}>
            <a>{result.rank_sort}: {result.entry_name}: {result.event_total}</a>
          </li>
        )}
      </ul>
    </div>
    );
  }
}

const teamAPI = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/entry/63705/event/1/picks'
const teamAPI2 = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/entry/63706/event/1/picks'
const allDataApi = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/bootstrap-static'

class Teams extends Component {
  constructor(props) {
    super(props);

    this.state = {
      picks: [],
      elements: [],
      results: [],
      hasStartedLoading: false,
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch(tableAPI)
    .then(response => {
      return response.json();
    })
    .then(data => this.setState({ results: data.standings.results, isLoading: false }));

    fetch(allDataApi)
      .then(response => {
        return response.json();
      })
      .then(data => this.setState({ elements: data.elements }));

    // fetch(teamAPI)
    //   .then(response => {
    //     console.log('sss', response)
    //     return response.json();
    //   })
    //   .then(data => this.setState({ picks: data.picks, isLoading: false }));

      fetch(tableAPI)
      .then(response => {
        return response.json();
      })
      .then(data => this.setState({ results: data.standings.results, isLoading: false }));
  }

  handleLoadingTeams(){
    const { results} = this.state;
    results.forEach(element => {
      fetch('https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/entry/' + element.entry + '/event/1/picks')
      .then(response => {
        return response.json();
      })
      .then(data => this.setState({ picks: data.picks, hasStartedLoading: true }));
    });
  }

  render() {
    const { picks, isLoading, elements, results, hasStartedLoading } = this.state;
    if (picks.length === 0 && hasStartedLoading === false){
      this.handleLoadingTeams();
    }
    if (isLoading) {
      return <p>Loading ...</p>;
    }
    return (
      <div>
        <ul>
          {results.map(result =>
            <li key={result.entry}>
              <a>Manager: {result.entry_name} </a>
              <ul>
                {picks.map(pick =>
                  <li key={pick.element}>
                    <a>Player: { getPlayer(pick.element, elements)}</a>
                  </li>
                )}
              </ul>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

function getPlayer(id, players){
  var name;
  players.forEach(element => {
    if (element.id === id){
      name = element.web_name;
    }
  });
  return name;
}

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/table">Table</Link></li>
        <li><Link to="/teams">Teams</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/Table" component={Table}/>
      <Route path="/Teams" component={Teams}/>
    </div>
  </Router>
)
export default BasicExample

// const tableAPI = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/leagues-classic-standings/461623';

// export default App;


// https://fantasy.premierleague.com/drf/entry/1110364
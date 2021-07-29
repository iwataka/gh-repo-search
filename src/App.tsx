import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props)
    this.state = {
      trends: []
    };
  }

  componentDidMount() {
    let trends = [
      {
        url: "https://github.com/iwataka/dotfiles",
        owner: "iwataka",
        repo: "dotfiles"
      }
    ];
    this.setState({
      trends: trends
    });
  }

  render() {
    return (
      <div>
        <GHTrendList trends={this.state.trends}/>
      </div>
    );
  }
}

interface AppProps {}

interface AppState {
  trends: Array<GHTrendProps>;
}

class GHTrendList extends React.Component<GHTrendListProps> {

  constructor(props: GHTrendListProps) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.trends.map(trend => (
          <li key={trend.url}>{trend.owner}/{trend.repo}</li>
        ))}
      </ul>
    )
  }

}

interface GHTrendListProps {
  trends: Array<GHTrendProps>;
}

class GHTrend extends React.Component {
  render() {
    return (
      <div>trend</div>
    )
  }
}

interface GHTrendProps {
  owner: string;
  repo: string;
  url: string;
}

export default App;

import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

interface GHAPIRepo {
  id: number;
  html_url: string;
  owner: {
    login: string;
  };
  name: string;
  stargazers_count: number;
}

interface GHAPISearchRepos {
  data: {
    items: Array<GHAPIRepo>
  };
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props)
    this.state = {
      repos: []
    };
  }

  componentDidMount() {
    let self = this;
    axios.get('https://api.github.com/search/repositories?q=pushed:>2021-07-01&sort=stars&order=desc&per_page=10')
      .then(function (res: GHAPISearchRepos) {
        console.log(res);
        self.setState({
          repos: res.data.items
        });
      })
  }

  render() {
    return (
      <div>
        <GHRepoList repos={this.state.repos}/>
      </div>
    );
  }
}

interface AppProps {}

interface AppState {
  repos: Array<GHAPIRepo>;
}

class GHRepoList extends React.Component<GHRepoListProps> {

  constructor(props: GHRepoListProps) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.repos.map(repo => (
          <li key={repo.id}><GHRepo repo={repo}/></li>
        ))}
      </ul>
    )
  }

}

interface GHRepoListProps {
  repos: Array<GHAPIRepo>;
}

class GHRepo extends React.Component<GHRepoProps> {
  render() {
    let r = this.props.repo
    return (
      <div>
        <a href={r.html_url} target="_blank">{r.owner.login}/{r.name}</a> | {r.stargazers_count}
      </div>
    )
  }
}

interface GHRepoProps {
  repo: GHAPIRepo;
}

export default App;

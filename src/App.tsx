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
        let repos = res.data.items.map(i => {
          return {
            url: i.html_url,
            owner: i.owner.login,
            name: i.name,
            id: i.id,
            stars: i.stargazers_count
          };
        });
        self.setState({
          repos: repos
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
  repos: Array<GHRepoProps>;
}

class GHRepoList extends React.Component<GHRepoListProps> {

  constructor(props: GHRepoListProps) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.repos.map(repo => (
          <li key={repo.id}><GHRepo owner={repo.owner} name={repo.name} id={repo.id} url={repo.url} stars={repo.stars}/></li>
        ))}
      </ul>
    )
  }

}

interface GHRepoListProps {
  repos: Array<GHRepoProps>;
}

class GHRepo extends React.Component<GHRepoProps> {
  render() {
    return (
      <div>
        <a href={this.props.url} target="_blank">{this.props.owner}/{this.props.name}</a> | {this.props.stars}
      </div>
    )
  }
}

interface GHRepoProps {
  owner: string;
  name: string;
  url: string;
  id: number;
  stars: number;
}

export default App;

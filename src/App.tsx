import React from 'react';
import './App.css';
import axios from 'axios';
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import StarRateIcon from '@material-ui/icons/StarRate';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import Chip from '@material-ui/core/Chip';

interface GHAPIRepo {
  id: number;
  html_url: string;
  owner: {
    login: string;
  };
  name: string;
  description: string;
  forks_count: number;
  stargazers_count: number;
  language: string;
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
    const darkTheme = createTheme({
      palette: {
        type: 'dark',
      },
    });
    return (
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              GitHub Repository Viewer
            </Typography>
          </Toolbar>
        </AppBar>
        <br/>
        <Container maxWidth="md">
          <CssBaseline/>
          <GHRepoList repos={this.state.repos}/>
        </Container>
      </ThemeProvider>
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">
            Search Repositories
          </Typography>
        </Grid>
        {this.props.repos.map(repo => (
          <Grid item xs={12}>
            <GHRepo repo={repo}/>
          </Grid>
        ))}
      </Grid>
    )
  }

}

interface GHRepoListProps {
  repos: Array<GHAPIRepo>;
}

class GHRepo extends React.Component<GHRepoProps> {
  render() {
    let r = this.props.repo;
    let langChip = null;
    if (r.language) {
      langChip = <Chip label={r.language}/>;
    }
    return (
      <Card>
        <CardContent>
          <Typography variant="h5">
            {r.owner.login}/{r.name}
          </Typography>
          <Typography>
            {r.description}
          </Typography>
          <br/>
          <Typography>
            {langChip}
            <Chip icon={<StarRateIcon/>} label={r.stargazers_count}/>
            <Chip icon={<RestaurantIcon/>} label={r.forks_count}/>
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

interface GHRepoProps {
  repo: GHAPIRepo;
}

export default App;

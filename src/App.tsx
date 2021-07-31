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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const defaultLanguage = "all";
const defaultSort = "stars";
const defaultPushed = ">2021-01-01";
const defaultPerPage = 10;
const defaultOrder = "desc";

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

  private language = defaultLanguage;
  private sort = defaultSort;
  private pushed = defaultPushed;
  private perPage = defaultPerPage;
  private order = defaultOrder;

  constructor(props: AppProps) {
    super(props)
    this.state = {
      repos: []
    };
  }

  componentDidMount(): void {
    this.searchHandler();
  }

  searchHandler(): void {
    axios.get(`https://api.github.com/search/repositories?q=language:${this.language}+pushed:${this.pushed}&sort=${this.sort}&order=${this.order}&per_page=${this.perPage}`)
      .then(this.searchAPIHandler.bind(this));
  }

  private searchAPIHandler(res: GHAPISearchRepos): void {
    this.setState({
      repos: res.data.items
    });
  }

  languageHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    this.language = e.target.value;
  }

  sortHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    this.sort = e.target.value;
  }

  pushedHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    this.pushed = e.target.value;
  }

  perPageHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    this.perPage = parseInt(e.target.value, 10);
  }

  orderHandler(e: React.MouseEvent<HTMLElement>, nextView: string): void {
    this.order = nextView;
  }

  render(): React.ReactNode {
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
          <GHRepoList
            repos={this.state.repos}
            searchHandler={this.searchHandler.bind(this)}
            languageHandler={this.languageHandler.bind(this)}
            sortHandler={this.sortHandler.bind(this)}
            pushedHandler={this.pushedHandler.bind(this)}
            perPageHandler={this.perPageHandler.bind(this)}
            orderHandler={this.orderHandler.bind(this)}
          />
        </Container>
      </ThemeProvider>
    );
  }
}

class AppProps {}

interface AppState {
  repos: Array<GHAPIRepo>;
}

class GHRepoList extends React.Component<GHRepoListProps, GHRepoListState> {

  constructor(props: GHRepoListProps) {
    super(props);
    this.state = {
      order: defaultOrder
    };
  }

  orderHandler(e: React.MouseEvent<HTMLElement>, nextView: string): void {
    this.props.orderHandler(e, nextView);
    this.setState({
      order: nextView
    });
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">
            Search Repositories
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            required
            label="language"
            defaultValue={defaultLanguage}
            onChange={this.props.languageHandler}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            label="sort"
            defaultValue={defaultSort}
            onChange={this.props.sortHandler}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            label="pushed"
            defaultValue={defaultPushed}
            onChange={this.props.pushedHandler}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            type="number"
            label="number of repos"
            defaultValue={defaultPerPage}
            onChange={this.props.perPageHandler}
          />
        </Grid>
        <Grid item>
          <ToggleButtonGroup exclusive value={this.state.order} onChange={this.orderHandler.bind(this)}>
            <ToggleButton value="desc">
              <ArrowDownwardIcon/>
            </ToggleButton>
            <ToggleButton value="asc">
              <ArrowUpwardIcon/>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.searchHandler}
          >
            Search
          </Button>
        </Grid>
        {this.props.repos.map(repo => (
          <Grid item xs={12} key={repo.id}>
            <GHRepo repo={repo}/>
          </Grid>
        ))}
      </Grid>
    )
  }

}

interface GHRepoListProps {
  repos: Array<GHAPIRepo>;
  searchHandler: () => void;
  languageHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pushedHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  perPageHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  orderHandler: (e: React.MouseEvent<HTMLElement>, nextView: string) => void;
}

interface GHRepoListState {
  order: string;
}

class GHRepo extends React.Component<GHRepoProps> {
  render() {
    const r = this.props.repo;
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

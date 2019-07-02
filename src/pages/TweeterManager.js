import React, { Component, Fragment } from 'react';
import { withRouter, Route, Redirect, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  ListItemAvatar,
  Avatar
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { find, orderBy } from 'lodash';
import { compose } from 'recompose';
import PostTweet from '../components/PostTweet';
import { searchTweetsFn, homeTweetsFn, createPostFn, likeTweetFn, dislikeTweetFn } from '../requests';

const styles = theme => ({
  posts: {
    marginTop: 2 * theme.spacing.unit,
  },
  fab: {
    position: 'absolute',
    bottom: 3 * theme.spacing.unit,
    right: 3 * theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      bottom: 2 * theme.spacing.unit,
      right: 2 * theme.spacing.unit,
    },
  },
});

const API = process.env.REACT_APP_API || 'http://localhost:3001';

class TweeterManager extends Component {
  state = {
    loading: true,
    posts: [],
    value: '',
    status: ''
  };

  componentDidMount() {
    this.getTweets();
  }

  async fetch(method, endpoint, body) {
    try {
      const response = await fetch(`${API}${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async getTweets() {
    const posts = await homeTweetsFn();
    this.setState({ loading: false, posts });
  }

  async likeTweet(post) {
    const isSuccess = await likeTweetFn(post.id_str);
    post.favorited = !isSuccess;
    this.forceUpdate();
  }

  async disLikeTweet(post) {
    const isSuccess = await dislikeTweetFn(post.id_str);
    post.favorited = isSuccess;
    this.forceUpdate();
  }

  async searchTweets() {
    const searchTerm = this.state.value || '';
    if (searchTerm) {
      const posts = await searchTweetsFn({ searchTerm });
      this.setState({ loading: false, posts });
    } else {
      this.getTweets();
    }
  }

  async postTweets() {
    const post = this.state.status || '';
    const isCreated = await createPostFn(post);
    this.getTweets();
  }

  handleValueChange(event) {
    this.setState({ value: event.target.value });
  }
  
  handleStatusChange(event) {
    this.setState({ status: event.target.value });
  }

  renderPostEditor = ({ match: { params: { id } } }) => {
    if (this.state.loading) return null;
    const post = find(this.state.posts, { id: Number(id) });

    if (!post && id !== 'new') {
      return <Redirect to="/tweets" />;
    }
    return <PostTweet post={post} onSave={this.postTweets} />;
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Typography variant="display1">Tweets Manager</Typography>

        <TextField
          id="post-status"
          label="Status"
          type="text"
          value={this.state.status}
          className={classes.textField}
          onChange={this.handleStatusChange.bind(this)}
          margin="normal"
          variant="outlined"
          multiline
        />
        <Button onClick={() => this.postTweets()} variant="contained" color="primary" className={classes.button}>
          Post
      </Button>
<br />
        <TextField
          id="outlined-search"
          label="Search field"
          type="search"
          value={this.state.value}
          className={classes.textField}
          onChange={this.handleValueChange.bind(this)}
          margin="normal"
          variant="outlined"
        />
        <Button onClick={() => this.searchTweets()} variant="contained" color="primary" className={classes.button}>
          Search
      </Button>
        {this.state.posts.length > 0 ? (
          <Paper elevation={1} className={classes.posts}>
            <List>
              {orderBy(this.state.posts, ['created_at'], ['desc'])
                .map(post => (
                  <ListItem key={post.id} button component={Link} to={`/posts/${post.id}`}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={post.user.profile_image_url} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={post.text + '@' + post.user.screen_name}
                      secondary={post.created_at && `Updated ${moment(post.created_at).fromNow()}`}
                    />
                    <ListItemSecondaryAction>
                      {post.favorited ? (
                        <IconButton color="inherit" onClick={() => this.disLikeTweet(post)}>
                          <img src="https://img.icons8.com/material-sharp/24/000000/thumbs-down.png"></img>
                        </IconButton>
                      ) : <IconButton color="inherit" onClick={() => this.likeTweet(post)}>
                          <img src="https://img.icons8.com/material/24/000000/facebook-like.png"></img>
                        </IconButton>}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Paper>
        ) : (
            !this.state.loading && <Typography variant="subheading">No tweets to display</Typography>
          )}
        <Button
          variant="fab"
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          to="/tweets/new"
        >
          <AddIcon />
        </Button>
        <Route exact path="/tweets/:id" component={PostTweet} />
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(TweeterManager);

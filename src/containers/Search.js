import React, { useState, useReducer, useEffect } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';

import { Button, TextField, Typography } from "@material-ui/core";

import PostList from '../components/PostList';
import Sidebar from './Sidebar';

const SUBSCRIPTION = 'SUBSCRIPTION';
const INITIAL_QUERY = 'INITIAL_QUERY';
const ADDITIONAL_QUERY = 'ADDITIONAL_QUERY';

const reducer = (state, action) => {
  switch (action.type) {
    case INITIAL_QUERY:
      return action.posts;
    case ADDITIONAL_QUERY:
      return [...state, ...action.posts]
    case SUBSCRIPTION:
      return [action.post, ...state]
    default:
      return state;
  }
};

export default function Search() {
  const [posts, dispatch] = useReducer(reducer, []);
  const [nextToken, setNextToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [query, setQuery] = useState('');

  const searchPosts = async (type, nextToken = null) => {
    console.log('searchPosts called: ' + query)
    if (query === '') return;
    const res = await API.graphql(graphqlOperation(searchPostsGql, {
      filter: { content: { matchPhrase: query }}, 
      sort: {direction: "desc", field: "createdAt"},
      limit: 20,
      nextToken: nextToken,
    }));
    console.log(res);
    dispatch({ type: type, posts: res.data.searchPosts.items })
    setNextToken(res.data.searchPosts.nextToken);
    setIsLoading(false);
  }

  const getAdditionalPosts = () => {
    if (nextToken === null) return; //Reached the last page
    searchPosts(ADDITIONAL_QUERY, nextToken);
  }

  const handleChange = event => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    const init = async() => {
      const currentUser = await Auth.currentAuthenticatedUser();
      setCurrentUser(currentUser);
    }
    init()
  }, []);

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography variant={"h3"} component={"h1"}>
          {currentUser ? `Hi this is ${currentUser.username}` : "loading..."}
        </Typography>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Sidebar activeListItem="search" />
          <PostList
            isLoading={isLoading}
            posts={posts}
            getAdditionalPosts={getAdditionalPosts}
            listHeaderTitle={"Search"}
            listHeaderTitleButton={
              <React.Fragment>
                <TextField
                  label="Enter Keywords"
                  multiline
                  rowsMax="3"
                  variant="filled"
                  value={query}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    searchPosts(INITIAL_QUERY);
                  }}
                  fullWidth
                >
                  Search
                </Button>
              </React.Fragment>
            }
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export const searchPostsGql = /* GraphQL */ `
  query SearchPosts(
    $filter: SearchablePostFilterInput
    $sort: SearchablePostSortInput
    $limit: Int
    $nextToken: String
  ) {
    searchPosts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        type
        id
        content
        owner
      }
      nextToken
      total
    }
  }
`;
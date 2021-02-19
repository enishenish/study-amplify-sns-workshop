import React, { useState, useEffect, useReducer } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';

import { listTimelines } from '../graphql/queries';
import { onCreateTimeline } from '../graphql/subscriptions';
import _ from 'lodash';

import PostList from '../components/PostList';
import Sidebar from './Sidebar';
import { Typography } from '@material-ui/core';

const SUBSCRIPTION = 'SUBSCRIPTION';
const INITIAL_QUERY = 'INITIAL_QUERY';
const ADDITIONAL_QUERY = 'ADDITIONAL_QUERY';

const reducer = (state, action) => {
  console.log(`${state} ${action}`);
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

export default function Timeline() {
  const [posts, dispatch] = useReducer(reducer, []);
  const [nextToken, setNextToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const getPosts = async (type, currentUser, nextToken = null) => {
    const res = await API.graphql(graphqlOperation(listTimelines, {
      userId: currentUser.username,
      sortDirection: 'DESC',
      limit: 20, //default = 10
      nextToken: nextToken,
    }));
    console.log(res);
    dispatch({ type: type, posts: _.map(res.data.listTimelines.items, 'post') })
    setNextToken(res.data.listTimelines.nextToken);
    setIsLoading(false);
  }

  const getAdditionalPosts = () => {
    if (nextToken === null) return; //Reached the last page
    getPosts(ADDITIONAL_QUERY, currentUser, nextToken);
  }

  useEffect(() => {
    console.log('init')
    const init = async () => {
      const currentUser = await Auth.currentAuthenticatedUser();
      setCurrentUser(currentUser);

      getPosts(INITIAL_QUERY, currentUser);
    }

    init();
  }, []);

  useEffect(()=> {
    console.log(currentUser);
    if(!currentUser) return;
    console.log('make subscription')
    const subscription = API.graphql(graphqlOperation(onCreateTimeline, {userId: currentUser.username})).subscribe({
        next: (msg) => {
          console.log('timeline subscription fired')
          console.log(msg)
          dispatch({ type: SUBSCRIPTION, post: msg.value.data.onCreateTimeline.post });
        }
      });
    return () => {subscription.unsubscribe(); console.log("unsubscribed!");};
  //}, [currentUser])
  })

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography variant={"h3"} component={"h1"}>
          {currentUser ? `Hi this is ${currentUser.username}` : "loading..."}
        </Typography>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Sidebar activeListItem="Home" />
          <PostList
            isLoading={isLoading}
            posts={posts}
            getAdditionalPosts={getAdditionalPosts}
            listHeaderTitle={"Home"}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
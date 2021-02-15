/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
      type
      id
      content
      owner
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
      type
      id
      content
      owner
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
      type
      id
      content
      owner
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTimeline = /* GraphQL */ `
  subscription OnCreateTimeline($userId: String!) {
    onCreateTimeline(userId: $userId) {
      userId
      timestamp
      postId
      post {
        type
        id
        content
        owner
        timestamp
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTimeline = /* GraphQL */ `
  subscription OnUpdateTimeline($userId: String!) {
    onUpdateTimeline(userId: $userId) {
      userId
      timestamp
      postId
      post {
        type
        id
        content
        owner
        timestamp
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTimeline = /* GraphQL */ `
  subscription OnDeleteTimeline($userId: String!) {
    onDeleteTimeline(userId: $userId) {
      userId
      timestamp
      postId
      post {
        type
        id
        content
        owner
        timestamp
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateFollowRelationship = /* GraphQL */ `
  subscription OnCreateFollowRelationship {
    onCreateFollowRelationship {
      followeeId
      followerId
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateFollowRelationship = /* GraphQL */ `
  subscription OnUpdateFollowRelationship {
    onUpdateFollowRelationship {
      followeeId
      followerId
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteFollowRelationship = /* GraphQL */ `
  subscription OnDeleteFollowRelationship {
    onDeleteFollowRelationship {
      followeeId
      followerId
      timestamp
      createdAt
      updatedAt
    }
  }
`;

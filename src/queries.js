import gql from 'graphql-tag';
export const queries = {
  searchTweetsQuery: gql`
        query searchTweetsQuery($searchTerm: String!) {
            searchPosts(searchTerm: $searchTerm) {
                id,
                id_str,
                created_at,
                user {
                    profile_image_url,
                    screen_name
                },
                text,
                favorited
            }
        }`,
    homeTweetsQuery: gql`{
        homeTweets{
          id,
          id_str,
          created_at,
          user {
            profile_image_url,
            screen_name
          },
          text,
          favorited
        }
      }`,
      createPostQuery: gql`
        mutation CreatePost($text: String) {
          post:createPost(text: $text)
        }
      `,
      likeTweetQuery: gql`
        mutation LikeTweet($id: String) {
          like:likeTweet(id: $id)
        }
      `,
      dislikeTweetQuery: gql`
        mutation DislikeTweet($id: String) {
          dislike:dislikeTweet(id: $id)
        }
      `
};

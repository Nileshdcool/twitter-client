import {queries} from './queries';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';

const endpointURL = 'http://localhost:3001/graphql';
const client = new ApolloClient({
    link: new HttpLink({uri: endpointURL}),
    cache: new InMemoryCache()
});

export async function searchTweetsFn(searchTerm) {
    const {data} = await client.query({query: queries.searchTweetsQuery, variables: searchTerm});
    return data.searchPosts;
}

export async function homeTweetsFn() {
    const {data} = await client.query({query: queries.homeTweetsQuery});
    return data.homeTweets;
}

export async function createPostFn(text) {
    const {data} = await client.mutate({mutation: queries.createPostQuery, variables: {text: text}});
    return data.post;
}

export async function likeTweetFn(id) {
    const {data} = await client.mutate({mutation: queries.likeTweetQuery, variables: {id: id}});
    return data.post;
}

export async function dislikeTweetFn(id) {
    const {data} = await client.mutate({mutation: queries.dislikeTweetQuery, variables: {id: id}});
    return data.post;
}
import { gql } from '@apollo/client';

export const GET_ME = gql`
    query getMe {
        me {
            _id
            username
            email
            savedbooks {
                bookId
                title
                authors
                description
                image
            }
        }
    }
`;
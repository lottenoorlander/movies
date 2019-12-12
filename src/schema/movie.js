import { makeExecutableSchema } from "graphql-tools";

const filter = (data, conditions) => {
  const fields = Object.keys(conditions);
  return data.filter(obj => {
    return (
      fields.filter(k => obj[k] === conditions[k]).length === fields.length
    );
  });
};

const find = (data, conditions) => {
  return filter(data, conditions)[0];
};
const movies = [
  {
    id: 455,
    imdb_id: "tt0286499",
    budget: 3500159,
    production_companies: [
      {
        id: 43,
        logo_path: "/4RgIPr55kBakgupWkzdDxqXJEqr.png",
        name: "Fox Searchlight Pictures",
        origin_country: "US"
      },
      {
        id: 1490,
        logo_path: null,
        name: "Kintop Pictures",
        origin_country: "US"
      },
      {
        id: 2406,
        logo_path: "/awYxP0L1FKUxf0oIanEDEKFKuaY.png",
        name: "FilmFörderung Hamburg",
        origin_country: "DE"
      },
      {
        id: 2452,
        logo_path: "/6CLoZ59fLPG7UyxQtGTqRevjf58.png",
        name: "UK Film Council",
        origin_country: "GB"
      }
    ],
    release_date: "2002-04-11",
    rating: 7,
    votes: 1099
  }
];

const typeDefs = `
  type Query {
    movies: [Movie]
    movie(id: ID, imdb_id: String): Movie
  }

  type Movie {
    id: ID!
    imdb_id: String
    budget(currency: Currency = EUR): Int   
    production_companies: [Production_company]
    release_date: String
    rating: Int
    votes: Int
  }

  type Production_company {
      id: ID!
      logo_path: String
      name: String
      origin_country: String
  }
  input RatingInput {
      value: String
      comment: String
  }
  enum Currency {
    EUR
    GBP
    USD
  }
  type Mutation {
    upvoteMovie (id: Int!): Movie
    rateMovie (id: Int!, rating: Int!): Movie
  }
`;

const resolvers = {
  Query: {
    movies: () => movies,
    movie: (_, { id }) => find(movies, { id: id })
  },
  Mutation: {
    upvoteMovie: (_, { id }) => {
      const movie = find(movies, { id: id });
      if (!movie) {
        throw new Error(`Couldn't find movie with id ${id}`);
      }
      movie.votes++;
      return movie;
    },
    rateMovie: (_, { id, rating }) => {
      const movie = find(movies, { id: id });
      if (!movie) {
        throw new Error(`Couldn't find movie with id ${id}`);
      }
      movie.rating = rating;
      return movie;
    }
  }
  //   Movie: {
  //     movies: movie => filter(movies, { id: movie.id })
  //   }
  //   Movie: {
  //     author: post => find(movies, { id: post.authorId })
  //   }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;

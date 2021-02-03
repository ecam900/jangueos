import {
  SearchContext, // the context that wraps and connects our components
  SearchContextManager, // the context manager, includes the Context.Provider
} from '@giphy/react-components';

// GYPHY - the search experience consists of the manager and its child components that use SearchContext
const SearchExperience = ({ children }) => (
  <SearchContextManager apiKey={process.env.NEXT_PUBLIC_GIPHY_API_KEY}>
    {children}
  </SearchContextManager>
);

export default SearchExperience;

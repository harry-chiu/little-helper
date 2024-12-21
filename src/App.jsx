import { ToastContainer } from 'react-toastify';
import Stock from './containers/Stock';
import GlobalStyle from './global-style';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <ToastContainer />
      <Stock />
    </>
  );
};

export default App;

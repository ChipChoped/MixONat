import { Header } from './components/header';
import { Outlet } from 'react-router-dom';
import { Footer } from './components/footer';

function App()
{
  return(
    <>
      <Header/>
      <Outlet/>
      {/*<Footer/>*/}
    </>
  )
}

export default App;

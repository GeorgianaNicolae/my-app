import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import TodayWeatherPage from './pages/TodayWeatherPage';




function App() {
  return (
    <div className='container'>
      <div data-testid="navBar">
        <a href='/' title='Home'>Hoaxify</a>
        <a href='/signup' title='Sign Up'>Sign Up</a>
      </div>
      {window.location.pathname === "/" && <HomePage />}
      {window.location.pathname === "/signup" && <SignUpPage />}
      {window.location.pathname === "/login" && <LoginPage />}
      {window.location.pathname.startsWith('/user/') && <UserPage />}
      {window.location.pathname === "/todayweather" && <TodayWeatherPage />}


    </div>
  );
}

export default App;
